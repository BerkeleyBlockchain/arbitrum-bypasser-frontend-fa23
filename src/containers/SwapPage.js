import React, { useEffect, useState } from "react";
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

// import { useEthersSigner } from "../utils/convertViem";

export default function SwapPage() {
  // ******************* Preprocessing to Gate Page If forced entry *******************
  const navigate = useNavigate();
  const location = useLocation();
  const { addy, name, abi } = location.state || {};
  const [functionList, setFunctionList] = useState({});
  const [selectedFunction, setSelectedFunction] = useState("");
  const [functionInputs, setFunctionInputs] = useState({});

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
      const funcs = await readABIFunctions(abi);
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
  }, [addy, name, abi, navigate]);

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

  const handleInputChange = (functionName, inputName, value) => {
    setFunctionInputs((prevInputs) => {
      const newInputs = _.cloneDeep(prevInputs);
      _.set(newInputs, [functionName, inputName], value);
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

  const renderComponentInputs = (functionName, components) => {
    return components.map((component, index) => (
      <div className="mb-3" key={`${functionName}-${component.name}`}>
        <label
          htmlFor={`${functionName}-${component.name}`}
          className="block text-sm font-medium text-gray-300"
        >
          {component.name} ({component.type}):
        </label>
        <input
          id={`${functionName}-${component.name}`}
          type="text"
          value={formInputs[functionName]?.[component.name] || ""}
          onChange={(e) =>
            handleFormInput(functionName, component.name, e.target.value)
          }
          className="mt-1 block w-full rounded-md bg-gray-700 border-transparent focus:border-gray-500 focus:ring-0 text-white"
        />
      </div>
    ));
  };

  const renderInputsOrComponents = (functionName, inputs) => {
    return inputs.map((input) => {
      if (input.type === "tuple" && input.components) {
        return renderComponentInputs(functionName, input.components);
      } else {
        return <input key={`${functionName}-${input.name}`} />;
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

  // ******************* Ethers, MetaMask Signer *******************
  // const [signer, setSigner] = useState(null);

  // useEffect(() => {
  //   async function connectToMetaMask() {
  //     if (window.ethereum) {
  //       try {
  //         await window.ethereum.request({ method: "eth_requestAccounts" });
  //         const provider = new ethers.providers.Web3Provider(window.ethereum);
  //         setSigner(provider.getSigner());
  //       } catch (error) {
  //         console.error("Cannot connect to MetaMask", error);
  //       }
  //     } else {
  //       console.error("MetaMask not found");
  //     }
  //   }
  //   connectToMetaMask();
  // }, []);

  // ******************* Go Back Function *******************
  function handleSwapClick() {
    navigate("/");
  }

  // ******************* Get and Create Wallet *******************
  const { address, isConnecting, isDisconnected } = useAccount();
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
      // REPLACE: add a loading buffer or move to next screen
      // ******************* Check if Wallet is Connected *******************
      if (isDisconnected || !isSuccess || isError || isLoading) {
        openConnectModal(); // Short Circuit
        return;
      }

      const contractAddress = addy;

      const userInputs = {
        functionName: selectedFunction,
        gasBuffer: gasBuffer * 0.01,
        value: payableValue, // this is a string
        idata: formInputs, // needs to be in order
      };

      try {
        const { l1TxHash, l2TxHash, status } = await sendL1toL2(
          contractAddress,
          name,
          abi,
          userInputs
        );

        // Update the state after the transaction
        setIsSwapped(true);
        setL1Tx(l1TxHash);
        setL2Tx(l2TxHash);
        setL2Status(status);
        localStorage.setItem(
          "currentTransaction",
          JSON.stringify({
            l2TxHash: l2TxHash,
            l1TxHash: l1TxHash,
            timeStamp: Date.now().toUTCString(),
            contractAddress,
            name,
          })
        );
      } catch (error) {
        console.error("Transaction execution error:", error);
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

      {!isSwapped ? (
        <div className="flex justify-center items-start mt-8 mb-8">
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
          <div className="flex flex-col items-center ml-8">
            <div className="flex flex-col justify-between items-start h-full">
              <div className="flex items-center">
                <div className="h-8 w-8">
                  <FaCheckCircle
                    size={32}
                    className="text-[rgba(0,212,136,1)]"
                  />
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
                className="w-1 bg-gray-700"
                style={{ height: "64px", width: "2px", marginLeft: "15px" }}
              ></div>
              <div className="flex items-center">
                <div
                  className="h-8 w-8 border-2 border-gray-500 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "transparent" }}
                >
                  <span className="text-xs text-white font-bold text-gray-500">
                    3
                  </span>
                </div>
                <span className="text-xs text-white ml-2">
                  Approving Transfer
                </span>
              </div>

              <div
                className="w-1 bg-gray-700"
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
        </div>
      ) : (
        <div className="flex justify-center items-start mt-8 mb-8">
          <div
            className="relative inline-block w-full px-6 py-6 rounded-lg bg-gray-700 shadow-lg"
            style={{
              maxWidth: "800px",
              backgroundColor: "rgba(17, 19, 24, 1)",
            }}
          >
            <div className="text-white text-center text-lg font-bold mb-4">
              Receipt
            </div>
            <div className="text-white text-sm mb-3">
              Status:{" "}
              <span className="text-[rgba(0,212,136,1)]">{l2Status}</span>
              <br />
              L1 Transacion Confirmation:{" "}
              <a
                className="text-blue-500 underline"
                href={`https://sepolia.arbiscan.io/address/${l1Tx}`}
              >
                {l1Tx}
              </a>
              <br />
              Awaiting L2 Transacion Confirmation:{" "}
              <a
                className="text-blue-500 underline"
                href={`https://sepolia.arbiscan.io/address/${l2Tx}`}
              >
                {l2Tx}
              </a>
            </div>

            <hr className="border-gray-700 my-4" />
            <div className="flex justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full">
                Force Include
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center ml-8">
            <div className="flex flex-col justify-between items-start h-full">
              <div className="flex items-center">
                <div className="h-8 w-8">
                  <FaCheckCircle
                    size={32}
                    className="text-[rgba(0,212,136,1)]"
                  />
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
                <span className="text-xs text-white ml-2">
                  Approving Transfer
                </span>
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
        </div>
      )}
    </div>
  );
}
