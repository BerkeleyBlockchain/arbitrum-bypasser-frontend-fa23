import { useEffect, useState } from "react";
import { getLastTransactions } from "../utils/getTransactions";

import { useAccount, useBalance } from "wagmi";
import { ClipLoader } from "react-spinners";
import {
  forceInclude,
  isBlockEligibleForForceInclusion,
} from "../utils/forceInclude";
import { transpileModule } from "typescript";

export default function TransactionPage() {
  // ******************* Get and Create Wallet *******************
  const { address, isConnecting, isDisconnected } = useAccount();
  const { data: balance } = useBalance({
    address: address || null,
  });

  // ******************* Grab Transactions *******************
  const [transactions, setTransactions] = useState([]);
  const [currentTransaction, setCurrentTransaction] = useState({});

  useEffect(() => {
    async function getTxFromScanner(account) {
      try {
        const txs = await getLastTransactions(account, 5);
        setTransactions(txs);
        return txs;
      } catch (err) {
        console.log(err);
        setTransactions([]);
      }
    }
    async function getTxFromLocal() {
      const localTransaction = localStorage.getItem("currentTransaction");
      if (localTransaction) {
        console.log(JSON.parse(localTransaction));
        setCurrentTransaction(JSON.parse(localTransaction));
      }
    }

    if (address != null) {
      getTxFromScanner(address);
    }
    getTxFromLocal();
  }, [address]);

  useEffect(() => {
    if (
      transactions.length > 0 &&
      currentTransaction &&
      currentTransaction === transactions[0].hash
    ) {
      setCurrentTransaction({});
      localStorage.removeItem("currentTransaction");
    }
  }, [currentTransaction, transactions]);

  return (
    <div className="swap-bg bg-cover bg-fixed bg-no-repeat text-white flex-grow py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold mb-2">Your Latest Transactions:</h1>
        <p className="mb-8">
          Here are the latest transactions for the acccount {address}:
        </p>
        {address == null || !currentTransaction ? (
          <></>
        ) : (
          <CurrentTransactionBox
            hash={currentTransaction.l2TxHash}
            functionName={currentTransaction.name}
            to={currentTransaction.contractAddress}
            userInputs={currentTransaction.userInputs}
            timeStamp={currentTransaction.timeStamp}
          />
        )}

        {transactions.length === 0 ? (
          <ClipLoader size={25} color={"#ffffff"} />
        ) : (
          transactions.map((txObj) => (
            <TransactionBox
              key={txObj.blockHash}
              hash={txObj.hash}
              functionName={txObj.functionName}
              to={txObj.to}
              gasPrice={txObj.gasPrice}
              timeStamp={txObj.timeStamp}
              txreceipt_status={txObj.txreceipt_status}
            />
          ))
        )}
      </div>
    </div>
  );
}

const TransactionBox = ({
  hash,
  functionName,
  to,
  gasPrice,
  timeStamp,
  txreceipt_status,
}) => {
  function convertTimestampToUTC(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    return date.toUTCString();
  }

  return (
    <div className="flex justify-center items-start mt-8 mb-8">
      <div
        className="relative inline-block w-full px-6 py-6 rounded-lg bg-gray-800 shadow-lg"
        style={{
          maxWidth: "800px",
          backgroundColor: "rgba(17, 19, 24, 1)",
        }}
      >
        <div className="text-white text-left text-lg font-bold mb-4">
          <span className="text-[rgba(0,212,136,1)]">
            {convertTimestampToUTC(timeStamp)}
          </span>
          <br />
          {functionName}
        </div>

        <div className="text-white text-sm mb-3">
          Scanner Link:{" "}
          <a
            className="text-blue-500 underline"
            href={`https://sepolia.arbiscan.io/tx/${hash}`}
          >
            {hash}
          </a>
          <br />
          To Contract:{" "}
          <a
            className="text-blue-500 underline"
            href={`https://sepolia.arbiscan.io/address/${to}`}
          >
            {to}
          </a>
          <br />
          Gas Price: {gasPrice} Gwei
          <br />
          TxReceiptStatus:{" "}
          {txreceipt_status === "1" ? (
            <span className="text-[rgba(0,212,136,1)]">Success</span>
          ) : (
            <span className="text-red-400">Pending / Fail</span>
          )}
        </div>

        <hr className="border-gray-700 my-4" />

        <div className="flex justify-center">
          {txreceipt_status === "1" ? (
            <button
              className="bg-gray-400 text-white font-bold py-2 px-6 rounded-full cursor-not-allowed opacity-50"
              disabled
            >
              Force Include
            </button>
          ) : (
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full"
              onClick={() => forceInclude(hash)}
            >
              Force Include
            </button>
          )}
          <button
            className="ml-5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full"
            onClick={() => isBlockEligibleForForceInclusion(hash)}
          >
            Check 24 Hour Status
          </button>
        </div>
      </div>
    </div>
  );
};

const CurrentTransactionBox = ({
  hash,
  functionName,
  to,
  userInputs,
  timeStamp,
}) => {
  return (
    <div className="flex justify-center items-start mt-8 mb-8">
      <div
        className="relative inline-block w-full px-6 py-6 rounded-lg bg-gray-800 shadow-lg"
        style={{
          maxWidth: "800px",
          backgroundColor: "rgba(17, 19, 24, 1)",
        }}
      >
        <div className="text-white text-center text-xl text-shadow text-gray-400 font-bold mb-6">
          MOST RECENT TRANSACTION
          <br />
          <span className="text-yellow-500">Time Elapsed: 00:00:00</span>
        </div>
        <div className="text-white text-left text-lg font-bold mb-1">
          {functionName}
        </div>

        <div className="text-white text-sm mb-3">
          Expected Scanner Link:{" "}
          <a
            className="text-blue-500 underline"
            href={`https://sepolia.arbiscan.io/tx/${hash}`}
          >
            {hash}
          </a>
          <br />
          To Contract:{" "}
          <a
            className="text-blue-500 underline"
            href={`https://sepolia.arbiscan.io/address/${to}`}
          >
            {to}
          </a>
          <br />
          Timestamp: <span>{timeStamp}</span>
          <br />
          Status: <span className="text-yellow-400">Pending</span>
        </div>

        <hr className="border-gray-700 my-4" />

        <div className="flex justify-center">
          {/* TODO change to check date now */}
          {hash === "1" ? (
            <button
              className="bg-gray-400 text-white font-bold py-2 px-6 rounded-full cursor-not-allowed opacity-50"
              disabled
            >
              Force Include
            </button>
          ) : (
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full"
              onClick={() => forceInclude(hash)}
            >
              Force Include
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
