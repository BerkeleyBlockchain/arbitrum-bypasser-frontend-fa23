import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaFilter, FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import "./SwapPage.css";
import { sendL1toL2 } from "../utils/sendL1toL2";

export default function SwapPage() {
  const dispatch = useDispatch();
  const connectedAccount = useSelector((state) => state.connectedAccount);
  const [fromNetwork, setFromNetwork] = useState("Ethereum Mainnet");
  const [ethAmount, setEthAmount] = useState("1.5");
  const [formInputOne, setFormInputOne] = useState("");
  const [formInputTwo, setFormInputTwo] = useState("");
  const [isSwapped, setIsSwapped] = useState(false);
  const [tokenSymbol, setTokenSymbol] = useState("ETH");

  const [etherBalance, setEtherBalance] = useState(null);
  // const etherBalance = useSyncExternalStore(getEthBalance, connectedAccount);

  async function getEthBalance(setEtherBalance) {
    if (!connectedAccount) return;
    const balance = await window.ethereum.request({
      method: "eth_getBalance",
      params: [connectedAccount, "latest"],
    });

    // convert to ETH and round to 2 decimal places
    const balanceInEth = (balance / 10 ** 18).toFixed(4);
    console.log("Balance in ETH", balanceInEth);
    setEtherBalance(balanceInEth);
  }

  useEffect(() => {
    checkMetaMask();
    getEthBalance(setEtherBalance);
  }, [connectedAccount]);

  function checkMetaMask() {
    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask is installed!");
    } else {
      console.log("MetaMask is not installed. Please install it.");
    }
  }

  useEffect(() => {
    checkMetaMask();
    setTokenSymbol(tokenHandles[fromNetwork] || "unknown");
  }, [fromNetwork]);

  function handleSwapClick() {
    setIsSwapped(true);
  }

  async function handleExecuteClick() {
    const { l1Tx, l2Tx, l2Status } = sendL1toL2(
      "0x0000000000000000000000000000000000000064",
      "withdrawEth",
      ["0x3D0AD1BC6023e75B17b36F04CFc0022687E69084"]
    );
  }

  const tokenHandles = {
    "Ethereum Mainnet": "ETH",
    Binance: "BNB",
    Polygon: "MATIC",
    Solana: "SOL",
    //more should be added here as needed
  };

  return (
    <div className="App">
      {/* Search Bar Section */}
      <div className="text-white text-center mt-32 mb-8">
        <h2 className="text-4xl font-bold mb-8">
          Execute Transactions from your ETH account
        </h2>
        <div
          className="inline-flex justify-center items-center w-full px-4 py-3 rounded-lg bg-gray-800"
          style={{ maxWidth: "800px", backgroundColor: "rgba(17, 19, 24, 1)" }}
        >
          <FaSearch className="text-gray-300 mr-3" size={20} />
          <input
            type="text"
            placeholder="Search..."
            className="flex-grow text-white focus:outline-none"
            style={{ backgroundColor: "rgba(17, 19, 24, 1)" }}
          />
          <button className="ml-3 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition duration-150 ease-in-out">
            <FaFilter className="text-white" size={20} />
          </button>
        </div>
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
                    value={fromNetwork}
                    onChange={(e) => setFromNetwork(e.target.value)}
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
                  <span className="text-white ml-2">{tokenSymbol}</span>
                </div>
                <div
                  className="text-left text-white text-xs"
                  style={{ color: "rgba(99, 117, 146, 1)", marginTop: "20px" }}
                >
                  {connectedAccount && (
                    <span>
                      Balance: {etherBalance}{" "}
                      <span style={{ color: "#3182ce" }}>MAX</span>
                    </span>
                  )}
                  {!connectedAccount && (
                    <span>Connecte wallet to see balance</span>
                  )}
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
              <button
                onClick={handleExecuteClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full mx-2"
              >
                Execute
              </button>
              <button
                onClick={handleSwapClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full mx-2"
              >
                Return to Protcols (temp swap button)
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
              Status: <span className="text-[rgba(0,212,136,1)]">Pending</span>
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
