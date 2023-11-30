import React, { useState, useEffect } from "react";
import "./App.css";
import {
  FaTwitter,
  FaDiscord,
  FaSearch,
  FaFilter,
  FaCheckCircle,
} from "react-icons/fa";
import { sendL1toL2 } from "./utils/sendL1toL2";
import {
  fetchProtocolList,
  fetchFunctionList,
  fetchParamFields,
} from "./utils/fetchContract";

function App() {
  const [fromNetwork, setFromNetwork] = useState("Ethereum Mainnet");
  const [ethAmount, setEthAmount] = useState("1.5");
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [formInputOne, setFormInputOne] = useState("");
  const [formInputTwo, setFormInputTwo] = useState("");
  const [isSwapped, setIsSwapped] = useState(false);
  const [isChosen, setIsChosen] = useState(false);

  useEffect(() => {
    checkMetaMask();
  }, []);

  function checkMetaMask() {
    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask is installed!");
    } else {
      console.log("MetaMask is not installed. Please install it.");
    }
  }

  function handleSwapClick() {
    setIsSwapped(true);
  }

  async function testing() {
    // sendL1toL2("0x0000000000000000000000000000000000000064", "withdrawEth", ['0xEbd7E58bd9413C71c76a7D4F641563dC4E05aB94']);
    // const ok = await fetchProtocolList(false);
    const ok = await fetchFunctionList(
      false,
      "0xE971136E269ee49dcbf42f1C3E65538f97D21A51"
    );
    console.log(ok);
  }

  async function connectWallet() {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("Connected", accounts[0]);
        setConnectedAccount(accounts[0]);
      } else {
        alert("Please install MetaMask!");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="App">
      <nav className="bg-black text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded flex items-center">
            <span className="h-3 w-3 border-2 border-white rounded-full mr-2"></span>
            Transactions
          </button>
        </div>
        <div className="flex items-center">
          <FaTwitter className="text-white ml-4 mr-2" size={24} />
          <FaDiscord className="text-white mx-2" size={24} />
          <button
            onClick={connectWallet}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
          >
            Connect Wallet
          </button>
        </div>
      </nav>

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
                    <option value="Binance Smart Chain">
                      Binance Smart Chain
                    </option>
                    <option value="Polygon">Polygon</option>
                    <option value="Solana">Solana</option>
                  </select>
                </div>

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
                  <span className="text-white ml-2">ETH</span>
                </div>
                <div
                  className="text-left text-white text-xs"
                  style={{ color: "rgba(99, 117, 146, 1)", marginTop: "20px" }}
                >
                  <span>Balance: 0.79 </span>
                  <span style={{ color: "#3182ce" }}>MAX</span>
                </div>
                <hr
                  className="my-4 border-gray-700"
                  style={{ width: "calc(100% - 20px)" }}
                />

                <div className="text-left text-white text-xs">
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
                onClick={handleSwapClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full mx-2"
              >
                Execute
              </button>
              <button
                onClick={testing}
                className="bg-gray-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full mx-2"
              >
                Change Protocol
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

export default App;
