import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaFilter, FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { ethers } from "ethers";

import "./SwapPage.css";
import SearchBar from "./SearchBar";

import { sendL1toL2 } from "../utils/sendL1toL2";
import { useConnectModal } from "@rainbow-me/rainbowkit";

import { useWalletClient, useBalance, useAccount } from "wagmi";
import { sepolia, arbitrumSepolia } from "wagmi/chains";

import { useEthersSigner } from "../utils/convertViem";

export default function SwapPage() {
  // ******************* Preprocessing to Gate Page If forced entry *******************
  const navigate = useNavigate();
  const location = useLocation();
  const { addy, name, abi } = location.state || {};

  useEffect(() => {
    // Check if addy, name, or abi is null or undefined
    if (!addy || !name || !abi) {
      navigate("/"); // Redirect to the home page
    }
  }, [addy, name, abi, navigate]);

  console.log("The Protocol for this page is: ", addy, name, abi);

  // ******************* State Set up *******************

  // const dispatch = useDispatch();
  const [functionMethod, setfunctionMethod] = useState("Ethereum Mainnet");
  const [ethAmount, setEthAmount] = useState("1.5");
  const [formInputOne, setFormInputOne] = useState("");
  const [formInputTwo, setFormInputTwo] = useState("");
  const [isSwapped, setIsSwapped] = useState(false);

  // const [executeStatus, setExecuteStatus] = useState(false);
  const [l1Tx, setL1Tx] = useState("");
  const [l2Tx, setL2Tx] = useState("");
  const [l2Status, setL2Status] = useState("");

  // ******************* Ethers, MetaMask Signer *******************
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    async function connectToMetaMask() {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          setSigner(provider.getSigner());
        } catch (error) {
          console.error("Cannot connect to MetaMask", error);
        }
      } else {
        console.error("MetaMask not found");
      }
    }
    connectToMetaMask();
  }, []);

  // ******************* Go Back Function *******************
  function handleSwapClick() {
    navigate("/");
  }

  // ******************* Get and Create Wallet *******************
  const { address, isConnecting, isDisconnected } = useAccount();
  const { data: balance } = useBalance({
    address: address || null,
  });

  return (
    <div className="landing-bg bg-cover bg-no-repeat text-white min-h-screen pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold mb-2">Protocol: {name} </h1>
        <p className="mb-8">
          Execute transactions to {name} on Arbitrum from your ETH account
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
            {/* Network Selection and Asset Input */}
            <div className="flex items-start text-sm font-medium">
              <div className="w-1/2 text-left">
                <div className="mb-3">
                  <span
                    className="text-white"
                    style={{ color: "rgba(99, 117, 146, 1)" }}
                  >
                    From:
                  </span>
                  <select
                    value={functionMethod}
                    onChange={(e) => setfunctionMethod(e.target.value)}
                    className="ml-2 bg-gray-700 text-white rounded p-1"
                  >
                    <option value="Ethereum Mainnet">Ethereum Mainnet</option>
                    <option value="Binance">Binance</option>
                    <option value="Polygon">Polygon</option>
                    <option value="Solana">Solana</option>
                  </select>
                </div>

                {/* Amount input and Token Symbols */}
                <div
                  className="mt-3 px-4 py-2 rounded shadow flex items-center justify-center"
                  style={{
                    backgroundColor: "rgba(25, 29, 36, 1)",
                    marginRight: "20px",
                  }}
                >
                  <input
                    type="text"
                    value={ethAmount}
                    onChange={(e) => setEthAmount(e.target.value)}
                    className="text-white bg-transparent focus:outline-none"
                  />
                </div>
                <div
                  className="text-left text-white text-xs"
                  style={{ color: "rgba(99, 117, 146, 1)", marginTop: "20px" }}
                >
                  {!isDisconnected && (
                    <span>
                      Balance: {balance?.formatted} {balance?.symbol}{" "}
                      <span style={{ color: "#3182ce" }}>MAX</span>
                    </span>
                  )}
                  {isDisconnected && <span>Connect wallet to see balance</span>}
                </div>
                <hr
                  className="my-4 border-gray-700"
                  style={{ width: "calc(100% - 20px)" }}
                />

                <div className="text-left text-white text-xs">
                  {/* need to obtain from coingecko api */}
                  <p>
                    Rate: 1 ETH = 1915.48 ARB{" "}
                    <span style={{ color: "rgba(99, 117, 146, 1)" }}>
                      ($1586.04){" "}
                    </span>{" "}
                    SWAP FEE: $10 USD
                  </p>
                </div>
              </div>

              <div className="w-1/2 text-left">
                <div className="mb-3">
                  <input
                    type="text"
                    value={formInputOne}
                    onChange={(e) => setFormInputOne(e.target.value)}
                    className="w-full p-2 text-white bg-gray-700 rounded focus:outline-none"
                    placeholder="Form Input One"
                    style={{
                      backgroundColor: "rgba(25, 29, 36, 1)",
                      borderRadius: "8px",
                    }}
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    value={formInputTwo}
                    onChange={(e) => setFormInputTwo(e.target.value)}
                    className="w-full p-2 text-white bg-gray-700 focus:outline-none"
                    placeholder="Form Input Two"
                    style={{
                      backgroundColor: "rgba(25, 29, 36, 1)",
                      borderRadius: "8px",
                      height: "200px",
                    }}
                  />
                </div>
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
                Back to Protocol
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
                className="w-1 bg-gray-600"
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
      ) : (
        <div className="flex justify-center items-start mt-8 mb-8">
          <div
            className="relative inline-block w-full px-6 py-6 rounded-lg bg-gray-800 shadow-lg"
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
              L1TxHash: <span>https://sepolia.etherscan.io/tx/${l1Tx}</span>
              L2TxHash: <span>https://sepolia.arbiscan.io/tx/${l2Tx}</span>
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

// ******************* Execute Button Function *******************
export const ExecuteButton = ({
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

  const l1Signer = useEthersSigner({ chainId: sepolia.id });
  const l2Signer = useEthersSigner({ chainId: arbitrumSepolia.id });
  console.log(l1Signer);
  console.log(l2Signer);

  async function handleExecuteClick() {
    // REPLACE: add a loading buffer or move to next screen
    // ******************* Check if Wallet is Connected *******************
    if (isDisconnected || !isSuccess || isError || isLoading) {
      openConnectModal(); // Short Circuit
      return;
    }

    // ******************* Swap to Arb Sepolia *******************
    // try {
    //   await walletClient.data.switchChain({
    //     id: arbitrumSepolia.id,
    //   });
    // } catch (error) {
    //   console.log(error);
    //   return; // Short Circuit
    // }

    // ******************* Convert WalletClient to Signer Object *******************
    // const l2Signer = useEthersSigner();

    const contractABI = [
      {
        inputs: [
          { internalType: "address", name: "destination", type: "address" },
        ],
        name: "withdrawEth",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
      },
    ]; // REPLACE with `abi`
    const contractAddress = "0x0000000000000000000000000000000000000064"; // REPLACE with `addy`

    const userInputs = {
      functionName: "withdrawEth",
      functionABI: "", // REPLACE
      value: "0.000000000000000001",
      idata: ["0x3D0AD1BC6023e75B17b36F04CFc0022687E69084"], // needs to be in order
    }; // REPLACE ENITRELY

    try {
      const { l1TxHash, l2TxHash, status } = await sendL1toL2(
        contractAddress,
        "contractName",
        contractABI,
        userInputs
      );

      // Update the state after the transaction
      setIsSwapped(true);
      setL1Tx(l1TxHash);
      setL2Tx(l2TxHash);
      setL2Status(status);
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
