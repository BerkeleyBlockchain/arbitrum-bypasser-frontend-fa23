"use client";
import React, { useState } from "react";

export default function AddABI() {
  const [protocolName, setProtocolName] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [abiType, setABIType] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="p-4" style={{ color: "white" }}>
      <h1 className="text-2xl font-bold mb-4">Add ABI</h1>
      <h2 className="text-lg font-bold mb-4">
        Add a new smart contract ABI from your favorite protocol. After
        submitting, we will review and let you know if it is approved.
      </h2>
      <form
        method="POST"
        action="https://script.google.com/macros/s/AKfycbxy78SBMMM2G-hyqj1aZxvOOAfwHgy05pGULhRvVPvIcUZEOnO8S6CUmDyoHFF_VCfs/exec"
      >
        <div className="mb-3">
          <label
            htmlFor="protocolName"
            className="block mb-2 text-sm font-medium"
            style={{ color: "white" }}
          >
            Protocol Name
          </label>
          <input
            name="Protocol Name"
            type="text"
            id="protocolName"
            value={protocolName}
            onChange={(e) => setProtocolName(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="e.g., Uniswap, Compound"
            required
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="contractAddress"
            className="block mb-2 text-sm font-medium"
            style={{ color: "white" }}
          >
            Contract (address)
          </label>
          <input
            name="Contract (address)"
            type="text"
            id="contractAddress"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="0x..."
            required
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="abiType"
            className="block mb-2 text-sm font-medium"
            style={{ color: "white" }}
          >
            Type
          </label>
          <input
            name="Type"
            type="text"
            id="abiType"
            value={abiType}
            onChange={(e) => setABIType(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="e.g., dApp, DEX, Bridge, etc."
            required
          />
        </div>

        {/* Email (Optional) input field */}
        <div className="mb-3">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium"
            style={{ color: "white" }}
          >
            Email (Optional)
          </label>
          <input
            name="Email (Optional)"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            placeholder="example@mail.com"
          />
        </div>

        <button
          type="submit"
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
