import { useState } from "react";
import "./Landing.css";
import Square from "../components/Square";

export default function Landing() {
  const squaresData = [
    {
      name: "Square 1",
      type: "DAPP",
      imageLink: "https://via.placeholder.com/200",
    },
    {
      name: "Square 2",
      type: "Type B",
      imageLink: "https://via.placeholder.com/200",
    },
    {
      name: "Square 3",
      type: "Type C",
      imageLink: "https://via.placeholder.com/200",
    },
    {
      name: "Square 4",
      type: "Type D",
      imageLink: "https://via.placeholder.com/200",
    },
    {
      name: "Square 5",
      type: "Type E",
      imageLink: "https://via.placeholder.com/200",
    },
    {
      name: "Square 6",
      type: "Type F",
      imageLink: "https://via.placeholder.com/200",
    },
  ];

  const [fromNetwork, setFromNetwork] = useState("Ethereum Mainnet");
  const [ethAmount, setEthAmount] = useState("1.5");

  const [formInputOne, setFormInputOne] = useState("");
  const [formInputTwo, setFormInputTwo] = useState("");
  const [isSwapped, setIsSwapped] = useState(false);
  const [isChosen, setIsChosen] = useState(false);

  function handleSwapClick() {
    setIsSwapped(true);
  }

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
          {squaresData.map((square) => (
            <Square
              key={square.name}
              name={square.name}
              type={square.type}
              imageLink={square.imageLink}
            />
          ))}
          {/* ... other protocol cards */}
        </div>
      </div>
    </div>
  );
}
