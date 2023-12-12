import { useState } from "react";
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

  // return (
  //   <div className="Home" /* style={{ paddingBottom: '150px' }} */>

  //     <div className="text-white text-center mt-32 mb-8">
  //       <h2 className="text-4xl font-bold mb-8">Execute Transactions from your ETH account</h2>
  //       <div className="inline-flex justify-center items-center w-full px-4 py-3 rounded-lg bg-gray-800" style={{ maxWidth: '800px', backgroundColor: 'rgba(17, 19, 24, 1)' }}>
  //         <FaSearch className="text-gray-300 mr-3" size={20} />
  //         <input
  //           type="text"
  //           placeholder="Search..."
  //           className="flex-grow text-white focus:outline-none"
  //           style={{ backgroundColor: 'rgba(17, 19, 24, 1)' }}
  //         />
  //         <button className="ml-3 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition duration-150 ease-in-out">
  //           <FaFilter className="text-white" size={20} />
  //         </button>
  //       </div>
  //     </div>
  //     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 200px)', gap: '40px', justifyContent: 'center' }}>
  //       {squaresData.map(square => (
  //         <Square key={square.name} name={square.name} type={square.type} imageLink={square.imageLink} />
  //       ))}
  //     </div>
  //   </div>
  // )
  // return (
  //   <div className="bg-black text-white h-screen p-10">
  //     <h1 className="text-5xl font-bold mb-2">
  //       Execute Transactions from your ETH account
  //     </h1>
  //     <p className="mb-8">
  //       Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.
  //     </p>
  //     <div className="flex gap-4 mb-10">
  //       <input
  //         className="flex-1 p-4 bg-gray-800 rounded-md"
  //         type="search"
  //         placeholder="Search Protocols"
  //       />
  //       <button className="bg-gray-800 p-4 rounded-md">Filter</button>
  //     </div>
  //     <div className="grid grid-cols-3 gap-4">
  //       {/* Repeat this block for each protocol card */}
  //       {squaresData.map(square => (
  //         <Square key={square.name} name={square.name} type={square.type} imageLink={square.imageLink} />
  //       ))}
  //       {/* <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
  //         <div className="flex items-center justify-between mb-4">
  //           <div className="flex items-center">
  //             <span className="p-2 bg-pink-600 rounded-full mr-3"></span>
  //             <h3 className="text-lg font-medium">Uniswap</h3>
  //           </div>
  //           <span className="text-gray-400">DAPP</span>
  //         </div>
  //       </div> */}
  //     </div>
  //   </div>
  // );
  // return (
  //   <div className="bg-black text-white min-h-screen flex items-center justify-center">
  //     <div className="max-w-6xl mx-auto p-10">
  //       <h1 className="text-5xl font-bold mb-2">
  //         Execute Transactions from your ETH account
  //       </h1>
  //       <p className="mb-8">
  //         Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum.
  //       </p>
  //       <div className="flex gap-4 mb-10">
  //         <input
  //           className="flex-1 p-4 bg-gray-800 rounded-md"
  //           type="search"
  //           placeholder="Search Protocols"
  //         />
  //         <button className="bg-gray-800 p-4 rounded-md">Filter</button>
  //       </div>
  //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  //         {/* Repeat this block for each protocol card */}
  //         <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
  //           <div className="flex items-center justify-between mb-4">
  //             <div className="flex items-center">
  //               <span className="p-2 bg-pink-600 rounded-full mr-3"></span>
  //               <h3 className="text-lg font-medium">Uniswap</h3>
  //             </div>
  //             <span className="text-gray-400">DAPP</span>
  //           </div>
  //           {/* Other content goes here */}
  //         </div>
  //         {/* ... other protocol cards */}
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div className="bg-black text-white min-h-screen pt-24">
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
  // return (
  //   <div className="bg-black text-white min-h-screen pt-24">
  //     <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
  //       <div className="flex gap-4 mb-10 items-center">
  //         <div className="flex-1 flex items-center bg-gray-800 rounded-full overflow-hidden border-2 border-gray-600">
  //           <span className="pl-4 pr-2 text-gray-400">
  //             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10l4 4 4-4" />
  //             </svg>
  //           </span>
  //           <input
  //             className="py-2 pl-2 bg-transparent text-white outline-none placeholder-gray-400 flex-grow"
  //             type="search"
  //             placeholder="Search Protocols"
  //           />
  //         </div>
  //         <button className="flex items-center justify-center bg-gray-800 rounded-full w-12 h-12">
  //           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a2 2 0 013-2h12a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
  //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l4 4 4-4" />
  //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 14l4-4 4 4" />
  //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 20l4 4 4-4" />
  //           </svg>
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );
}
