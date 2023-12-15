import { React } from "react";
import "./Landing.css";
import Square from "../components/Square";
import testnetMap from "../constants/testnet_map.json";

export default function Landing() {
  const squaresData = testnetMap;

  return (
    <div className="landing-bg bg-cover bg-no-repeat text-white min-h-screen pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold mb-2">
          Execute Transactions from your ETH account
        </h1>
        <p className="mb-8">
          Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem
          ipsum.
        </p>
        <div className="flex gap-4 mb-10">
          <input
            className="flex-1 p-4rounded-md"
            type="search"
            style={{
              backgroundColor: "transparent",
              border: "1px solid #4B5563",
              borderRadius: "18px",
              padding: "10px 20px",
              marginRight: "40px",
            }}
            placeholder="Search Protocols"
            outline="none"
          />
          <button className="p-4 rounded-md">Filter</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Repeat this block for each protocol card */}
          {Object.entries(squaresData).map(([key, value]) => {
            return (
              <Square
                key={key}
                addy={key}
                name={value.name}
                type={value.type}
                abi={value.abi}
                image={value.image}
              />
            );
          })}
          {/* ... other protocol cards */}
        </div>
      </div>
    </div>
  );
}
