import React, { useEffect, useState, useContext } from "react";
import { FaCheckCircle, FaFilter, FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { ethers } from "ethers";
import _ from "lodash";

import "./SwapPage.css";
import GasSlider from "../components/GasSlider";
import { readABIFunctions } from "../utils/readFile";

import { sendL1toL2 } from "../utils/sendL1toL2";
import { useConnectModal } from "@rainbow-me/rainbowkit";

import { useWalletClient, useBalance, useAccount } from "wagmi";
import { sepolia, arbitrumSepolia } from "wagmi/chains";
import { ReceiptTransactionBox } from "./TransactionPage";

import { GlobalContext } from "../ContextProvider";

export default function SwapPage() {
  // ******************* Preprocessing to Gate Page If forced entry *******************
  const navigate = useNavigate();
  const location = useLocation();
  const { addy, name, abi } = location.state || {};
  const [functionList, setFunctionList] = useState({});
  const [selectedFunction, setSelectedFunction] = useState("");
  const [functionInputs, setFunctionInputs] = useState({});

  // ******************* Mainnet or Testnet *******************
  const { livenet } = useContext(GlobalContext);

  const [tokenIn, setTokenIn] = useState("");
  const [tokenOut, setTokenOut] = useState("");
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("");

  const tokens = [
    { address: 0xaf88d065e77c8cc2239327c5edb3a432268e5831, symbol: "USDC" },
    { address: 0x912ce59144191c1204e64559fe8253a0e49e6548, symbol: "ARB" },
  ];

  useEffect(() => {
    async function getABIFunctions() {
      if (!abi) {
        console.error("ABI is not defined");
        return;
      }
      const funcs = await readABIFunctions(abi, livenet);
      if (funcs && typeof funcs === "object" && Object.keys(funcs).length > 0) {
        setFunctionList(funcs);
        setSelectedFunction(Object.keys(funcs)[0]);
      } else {
        console.error("Function list is empty or not an object:", funcs);
      }
    }
    // Check if addy, name, or abi is null or undefined
    if (!addy || !name || !abi) {
      navigate("/");
    } else {
      getABIFunctions();
    }
  }, [addy, name, abi, navigate, livenet]);

  // ******************* State Set up *******************
  // const dispatch = useDispatch();
  const [payableValue, setPayableValue] = useState(""); //0.000000000000000001 in wei
  const [formInputs, setFormInputs] = useState([]); // ["0x3D0AD1BC6023e75B17b36F04CFc0022687E69084"]
  const [gasBuffer, setGasBuffer] = useState(20);

  const handleFormInput = (functionName, paramName, value) => {
    setFormInputs((currentInputs) => ({
      ...currentInputs,
      [functionName]: {
        ...(currentInputs[functionName] || {}),
        [paramName]: value,
      },
    }));
  };

  const handleInputChange = (
    functionName,
    inputName,
    value,
    isNested = false,
    parentName = ""
  ) => {
    setFunctionInputs((prevInputs) => {
      const newInputs = _.cloneDeep(prevInputs);

      // Determine the path to set the value in the state
      const path = isNested
        ? [functionName, parentName, inputName]
        : [functionName, inputName];
      _.set(newInputs, path, value);

      return newInputs;
    });
  };

  const renderFunctionInputs = (functionName, inputs) => {
    return inputs.map((input, index) => {
      if (input.type === "tuple" && input.components) {
        // Render inputs for each tuple component
        return input.components.map((component) => (
          <div key={`${functionName}-${component.name}`} className="mb-3">
            <label
              htmlFor={`${functionName}-${component.name}`}
              className="block text-sm font-medium text-gray-300"
            >
              {component.name} ({component.type}):
            </label>
            <input
              type="text"
              value={_.get(functionInputs, [functionName, component.name], "")}
              onChange={(e) =>
                handleInputChange(functionName, component.name, e.target.value)
              }
              className="mt-1 block w-full rounded-md bg-gray-700 border-transparent focus:border-gray-500 focus:ring-0 text-white"
            />
          </div>
        ));
      } else {
        // Render a single input for non-tuple types
        return (
          <div key={`${functionName}-${input.name}`} className="mb-3">
            <label
              htmlFor={`${functionName}-${input.name}`}
              className="block text-sm font-medium text-gray-300"
            >
              {input.name} ({input.type}):
            </label>
            <input
              type="text"
              value={_.get(functionInputs, [functionName, input.name], "")}
              onChange={(e) =>
                handleInputChange(functionName, input.name, e.target.value)
              }
              className="mt-1 block w-full rounded-md bg-gray-700 border-transparent focus:border-gray-500 focus:ring-0 text-white"
            />
          </div>
        );
      }
    });
  };

  useEffect(() => {
    if (Object.keys(functionList).length === 0) {
      return;
    }

    const length = Object.keys(functionList[selectedFunction]?.inputs).length;
    const arrayOfEmptyStrings = new Array(length).fill("");
    setFormInputs(arrayOfEmptyStrings);
    setPayableValue("");
    setGasBuffer(20);
  }, [functionList, selectedFunction]);

  const [isSwapped, setIsSwapped] = useState(false);

  const [l1Tx, setL1Tx] = useState("");
  const [l2Tx, setL2Tx] = useState("");
  const [l2Status, setL2Status] = useState("");

  // ******************* Go Back Function *******************
  function handleSwapClick() {
    navigate("/");
  }

  // ******************* Get and Create Wallet *******************
  const { address, isDisconnected } = useAccount();
  const { data: balance } = useBalance({
    address: address || null,
  });

  // ******************* Handle Click Function *******************
  const handleMaxClick = () => {
    setPayableValue(balance?.formatted);
  };
  const handleHalfClick = () => {
    setPayableValue(balance?.formatted / 2);
  };
  const handleNoneClick = () => {
    setPayableValue("");
  };

  const ExecuteButton = ({
    isDisconnected,
    setIsSwapped,
    setL1Tx,
    setL2Status,
    setL2Tx,
  }) => {
    const { openConnectModal } = useConnectModal();

    const walletClient = useWalletClient();
    const { data: clientData, isSuccess, isLoading, isError } = walletClient;
    console.log(walletClient);

    async function handleExecuteClick() {
      if (isDisconnected || !isSuccess || isError || isLoading) {
        openConnectModal();
        return;
      }

      const contractAddress = addy;
      const userInputs = {
        functionName: selectedFunction,
        gasBuffer: gasBuffer * 0.01,
        value: payableValue,
        idata: functionInputs[selectedFunction] || {}, // Ensure this is not undefined and is correctly formatted
      };

      try {
        const { l1TxHash, l2TxHash, status } = await sendL1toL2(
          contractAddress,
          name,
          abi,
          userInputs,
          livenet
        );

        setIsSwapped(true);
        setL1Tx(l1TxHash);
        setL2Tx(l2TxHash);
        setL2Status(status);

        // Store the transaction data
        localStorage.setItem(
          "currentTransaction",
          JSON.stringify({
            l2TxHash: l2TxHash,
            l1TxHash: l1TxHash,
            timeStamp: new Date().toISOString(),
            contractAddress: contractAddress,
            name: selectedFunction,
          })
        );
        // localStorage.setItem(
        //   "currentTransaction",
        //   JSON.stringify({
        //     l2TxHash: "sadgadsg",
        //     l1TxHash: "sadgadsg",
        //     timestamp: "2024-01-07T22:18:01",
        //     contractAddress: "sadgadsg",
        //     name: "Testing Function",
        //   })
        // );
      } catch (error) {
        console.error("Transaction execution error:", error);
        // Here you would handle the error, potentially updating the UI to inform the user
      }
    }

    return (
      <button
        onClick={handleExecuteClick}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full mx-2"
      >
        Execute
      </button>
    );
  };

  // ******************* SWAP PAGE CONTENTS *******************
  return (
    <div className="landing-bg bg-cover bg-no-repeat text-white flex-grow pt-24">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold mb-2">
          Protocol: <span className="text-[rgba(0,212,136,1)]">{name}</span>
        </h1>
        <p className="mb-8">
          Execute transactions to{" "}
          <span className="text-[rgba(0,212,136,1)]">{name}</span> on Arbitrum
          from your ETH account
        </p>
      </div>

      {/* The Content */}
      {!isSwapped ? (
        <div className="flex justify-center items-start mt-8 mb-8">
          {/* Swap Box Content */}
          <div
            className="relative inline-block w-full px-6 py-6 rounded-lg bg-gray-800 shadow-lg"
            style={{
              maxWidth: "800px",
              backgroundColor: "rgba(17, 19, 24, 1)",
            }}
          >
            <div className="flex items-start text-sm font-medium">
              {/* Left Column */}
              <div className="w-1/2 text-left">
                {/* Method Selection */}
                <div className="mb-4">
                  <span className="text-white">Method:</span>
                  <select
                    value={selectedFunction}
                    onChange={(e) => {
                      setSelectedFunction(e.target.value);
                    }}
                    className="ml-2 bg-blue-600 text-white text-center rounded p-1"
                  >
                    {Object.entries(functionList).map(([key, value]) => (
                      <option value={key}>{key}</option>
                    ))}
                  </select>
                </div>

                {/* Payable Value Input */}
                <div>
                  <span className="white">Payable Value:</span>
                </div>
                <div
                  className="mt-3 px-4 py-2 rounded shadow flex items-start justify-start"
                  style={{
                    backgroundColor: "rgba(25, 29, 36, 1)",
                    marginRight: "20px",
                  }}
                >
                  {Object.keys(functionList).length === 0 ? (
                    <ClipLoader size={25} color={"#ffffff"} />
                  ) : (
                    <input
                      type="text"
                      value={payableValue}
                      placeholder={
                        functionList[selectedFunction].stateMutability ===
                        "payable"
                          ? "e.g. 0.005 in ETH (payable)"
                          : "e.g. 0.005 in ETH (not payable)"
                      }
                      onChange={(e) => setPayableValue(e.target.value)}
                      className="text-white w-full bg-transparent focus:outline-none"
                    />
                  )}
                </div>

                <div
                  className="text-left text-white text-xs"
                  style={{ color: "rgba(99, 117, 146, 1)", marginTop: "10px" }}
                >
                  {!isDisconnected && (
                    <span className="flex justify-between items-center w-full">
                      <span>
                        Balance: {balance?.formatted.slice(0, 5)}{" "}
                        {balance?.symbol}{" "}
                      </span>
                      <span>
                        <button
                          onClick={handleNoneClick}
                          className="text-blue-500 hover:text-blue-700 font-bold p-1 rounded-full mx-1"
                        >
                          NONE
                        </button>
                        <button
                          onClick={handleHalfClick}
                          className="text-blue-500 hover:text-blue-700 font-bold p-1 rounded-full mx-1"
                        >
                          HALF
                        </button>
                        <button
                          onClick={handleMaxClick}
                          className="pr-6 text-blue-500 hover:text-blue-700 font-bold p-1 rounded-full mx-1"
                        >
                          MAX
                        </button>
                      </span>
                    </span>
                  )}
                  {isDisconnected && <span>Connect wallet to see balance</span>}
                </div>
                <hr
                  className="my-4 border-gray-700"
                  style={{ width: "calc(100% - 20px)" }}
                />

                {/* Gas Slider Input */}
                <GasSlider gasState={gasBuffer} setGasState={setGasBuffer} />
              </div>

              {/* Method Inputs*/}
              <div className="w-1/2 text-left">
                {Object.keys(functionList).length === 0 ||
                functionList[selectedFunction]?.inputs.length === 0 ? (
                  <div className="mb-3">No Inputs Needed!</div>
                ) : (
                  renderFunctionInputs(
                    selectedFunction,
                    functionList[selectedFunction]?.inputs
                  )
                )}
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <ExecuteButton
                isDisconnected={isDisconnected}
                setIsSwapped={setIsSwapped}
                setL1Tx={setL1Tx}
                setL2Status={setL2Status}
                setL2Tx={setL2Tx}
              />
              <button
                onClick={handleSwapClick}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full mx-2"
              >
                Back to Protocols
              </button>
            </div>
          </div>
          <SwapStatusBar isSwapped={isSwapped} />
        </div>
      ) : (
        <div className="flex justify-center items-start mt-8 mb-8">
          <ReceiptTransactionBox
            l1TxHash={l1Tx}
            l2TxHash={l2Tx}
            functionName={selectedFunction}
            to={addy}
            timeStamp={new Date()}
            livenet={livenet}
          />
          <SwapStatusBar isSwapped={isSwapped} />
        </div>
      )}
    </div>
  );
}

const SwapStatusBar = ({ isSwapped }) => {
  return (
    <div className="flex flex-col items-center ml-8">
      <div className="flex flex-col justify-between items-start h-full">
        <div className="flex items-center">
          <div className="h-8 w-8">
            <FaCheckCircle size={32} className="text-[rgba(0,212,136,1)]" />
          </div>
          <span className="text-xs text-white ml-2">Starting Swap</span>
        </div>
        <div
          className="w-1 bg-[rgba(0,212,136,1)]"
          style={{ height: "64px", width: "2px", marginLeft: "15px" }}
        ></div>
        <div className="flex items-center">
          <div
            className="h-8 w-8 border-2 border-[rgba(0,212,136,1)] rounded-full flex items-center justify-center"
            style={{ backgroundColor: "transparent" }}
          >
            <span className="text-xs text-white font-bold text-[rgba(0,212,136,1)]">
              2
            </span>
          </div>
          <span className="text-xs text-white ml-2">Crossing Bridge</span>
        </div>

        <div
          className="w-1 bg-[rgba(0,212,136,1)]"
          style={{ height: "64px", width: "2px", marginLeft: "15px" }}
        ></div>
        <div className="flex items-center">
          <div
            className="h-8 w-8 border-2 border-[rgba(0,212,136,1)] rounded-full flex items-center justify-center"
            style={{ backgroundColor: "transparent" }}
          >
            <span className="text-xs text-white font-bold text-[rgba(0,212,136,1)]">
              3
            </span>
          </div>
          <span className="text-xs text-white ml-2">Approving Transfer</span>
        </div>

        <div
          className="w-1 bg-gray-600"
          style={{ height: "64px", width: "2px", marginLeft: "15px" }}
        ></div>
        <div className="flex items-center">
          <div
            className="h-8 w-8 border-2 border-gray-500 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "transparent" }}
          >
            <span className="text-xs text-white font-bold text-gray-500">
              4
            </span>
          </div>
          <span className="text-xs text-white ml-2">Complete</span>
        </div>
      </div>
    </div>
  );
};
