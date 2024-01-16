import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getLastTransactions } from "../utils/getTransactions";
import { useStopwatch } from "react-timer-hook";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { useAccount } from "wagmi";
import { ClipLoader } from "react-spinners";
import {
  forceInclude,
  isBlockEligibleForForceInclusion,
} from "../utils/forceInclude";
import Stopwatch, { RawStopwatch } from "../components/Stopwatch";
import { GlobalContext } from "../ContextProvider";

export default function TransactionPage() {
  // ******************* Mainnet or Testnet *******************
  const { livenet } = useContext(GlobalContext);

  // ******************* Get and Create Wallet *******************
  const { address } = useAccount();
  // const { data: balance } = useBalance({
  //   address: address || null,
  // });

  // ******************* Grab Transactions *******************
  const [transactions, setTransactions] = useState([]);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  useEffect(() => {
    async function getTxFromScanner(account) {
      try {
        const txs = await getLastTransactions(account, 5, livenet);
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
        // console.log(JSON.parse(localTransaction));
        setCurrentTransaction(JSON.parse(localTransaction));
      }
    }

    if (address != null) {
      getTxFromScanner(address);
      getTxFromLocal();
    } else {
      setTransactions([]);
    }
  }, [address, livenet]);

  useEffect(() => {
    console.log(currentTransaction);
    if (
      transactions.length > 0 &&
      currentTransaction &&
      currentTransaction.l2TxHash === transactions[0].hash
    ) {
      setCurrentTransaction(null);
      localStorage.removeItem("currentTransaction");
    }
  }, [currentTransaction, transactions]);

  return (
    <div className="swap-bg bg-cover bg-fixed bg-no-repeat text-white flex-grow py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold mb-2">Your Latest Transactions:</h1>
        <p className="mb-8">
          If 24 hours have passed and your transaction has not been included
          yet, the option to force include will open up.
        </p>
        {address == null || !currentTransaction ? (
          <></>
        ) : (
          <MostRecentTransactionBox
            l1TxHash={currentTransaction.l1TxHash}
            l2TxHash={currentTransaction.l2TxHash}
            functionName={currentTransaction.name}
            to={currentTransaction.contractAddress}
            timestamp={currentTransaction.timeStamp}
            livenet={livenet}
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
              livenet={livenet}
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
  livenet,
}) => {
  const previousDate = new Date(timeStamp * 1000);
  const currentDate = new Date();
  const difference = currentDate - previousDate;
  const isMoreThan24Hours = difference > 24 * 60 * 60 * 1000;
  const disabled =
    txreceipt_status === "1" || !isMoreThan24Hours ? true : false;

  function convertTimestampToUTC(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    return date.toUTCString();
  }

  const [open, setOpen] = useState(false);
  const [forceincludeContent, setForceIncludeContent] = useState("");

  const toggleModal = () => {
    // console.log(timeStamp);
    setForceIncludeContent("");
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleForceInclude = async (hash) => {
    const forceInclusionTx = await forceInclude(hash, livenet);
    if (!forceInclusionTx) {
      console.log("Force Inclusion Failed");
      setForceIncludeContent("Force Inclusion Failed!");
      setOpen(true);
    } else {
      setForceIncludeContent("Refresh and wait for force inclusion!");
      setOpen(true);
    }
  };

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
            href={`https://${livenet ? "" : "sepolia."}arbiscan.io/tx/${hash}`}
          >
            {hash}
          </a>
          <br />
          To Contract:{" "}
          <a
            className="text-blue-500 underline"
            href={`https://${
              livenet ? "" : "sepolia."
            }arbiscan.io/address/${to}`}
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
          <button
            onClick={() => handleForceInclude(hash)}
            disabled={disabled}
            className={`${disabled ? "cursor-not-allowed opacity-50" : ""} ${
              disabled
                ? "bg-gray-400 cursor-not-allowed opacity-50"
                : "bg-red-600 hover:bg-red-700"
            } text-white font-bold py-2 px-6 rounded-full`}
          >
            Force Include
          </button>
          <button
            className="ml-5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full"
            onClick={() => toggleModal()}
          >
            Check 24 Hour Status
          </button>
        </div>
      </div>
      <Snackbar
        open={open}
        autoHideDuration={2}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
          {forceincludeContent !== "" ? (
            <>{forceincludeContent}</>
          ) : (
            <RawStopwatch offset={timeStamp} />
          )}
        </Alert>
      </Snackbar>
    </div>
  );
};

const MostRecentTransactionBox = ({
  l1TxHash,
  l2TxHash,
  functionName,
  to,
  timestamp,
  livenet,
}) => {
  const previousDate = new Date(timestamp);
  const currentDate = new Date();
  const difference = currentDate - previousDate;
  const isMoreThan24Hours = difference > 24 * 60 * 60 * 1000;
  const disabled = !isMoreThan24Hours ? true : false;

  const [stopwatchSecondOffset, setStopwatchSecondOffset] = useState(0);
  const [timestampDate, setTimestampDate] = useState(new Date());

  useEffect(() => {
    const pastDate = new Date(timestamp);
    // console.log(timestamp);
    setTimestampDate(timestampDate);
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate - pastDate;
    const totalSeconds = Math.floor(differenceInMilliseconds / 1000);
    setStopwatchSecondOffset(totalSeconds);
    // console.log("offset", totalSeconds);
  }, [timestamp]);

  const [open, setOpen] = useState(false);
  const [forceincludeContent, setForceIncludeContent] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const handleForceInclude = async (hash) => {
    const forceInclusionTx = await forceInclude(hash, livenet);
    if (!forceInclusionTx) {
      console.log("Force Inclusion Failed");
      setForceIncludeContent("Force Inclusion Failed!");
      setOpen(true);
    } else {
      setForceIncludeContent("Refresh and wait for force inclusion!");
      setOpen(true);
    }
  };

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
          <span className="text-yellow-500">
            {stopwatchSecondOffset && (
              <Stopwatch offset={stopwatchSecondOffset} />
            )}
          </span>
        </div>
        <div className="text=white text-left text-lg font-bold mb-1">
          <span className="text-[rgba(0,212,136,1)]">
            {timestampDate.toUTCString()}
          </span>
          <br />
          Function: {functionName}
        </div>

        <div className="text-white text-sm mb-3">
          Awaiting L2 Transaction:{" "}
          <a
            className="text-blue-500 underline"
            href={`https://${
              livenet ? "" : "sepolia."
            }arbiscan.io/tx/${l2TxHash}`}
          >
            {l2TxHash}
          </a>
          <br />
          Approved L1 Transaction:{" "}
          <a
            className="text-blue-500 underline"
            href={`https://${
              livenet ? "" : "sepolia."
            }etherscan.io/tx/${l1TxHash}`}
          >
            {l1TxHash}
          </a>
          <br />
          To Contract:{" "}
          <a
            className="text-blue-500 underline"
            href={`https://${
              livenet ? "" : "sepolia."
            }arbiscan.io/address/${to}`}
          >
            {to}
          </a>
          <br />
          Status: <span className="text-yellow-400">Pending</span>
        </div>

        <hr className="border-gray-700 my-4" />

        <div className="flex justify-center">
          <button
            onClick={() => handleForceInclude(l2TxHash)}
            disabled={disabled}
            className={`${disabled ? "cursor-not-allowed opacity-50" : ""} ${
              disabled
                ? "bg-gray-400 cursor-not-allowed opacity-50"
                : "bg-red-600 hover:bg-red-700"
            } text-white font-bold py-2 px-6 rounded-full`}
          >
            Force Include
          </button>
        </div>
      </div>
      <Snackbar
        open={open}
        autoHideDuration={2}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
          <>{forceincludeContent}</>
        </Alert>
      </Snackbar>
    </div>
  );
};

export const ReceiptTransactionBox = ({
  l1TxHash,
  l2TxHash,
  functionName,
  to,
  timeStamp,
  livenet,
}) => {
  const navigate = useNavigate();
  const { seconds, minutes, hours } = useStopwatch({
    autoStart: true,
    offsetTimestamp: timeStamp,
  });
  const formatTime = (timeValue) => {
    return String(timeValue).padStart(2, "0");
  };

  return (
    <div
      className="relative inline-block w-full px-6 py-6 rounded-lg bg-gray-800 shadow-lg"
      style={{
        maxWidth: "800px",
        backgroundColor: "rgba(17, 19, 24, 1)",
      }}
    >
      <div className="text-white text-center text-xl text-shadow text-gray-400 font-bold mb-10">
        Waiting for L2 Transaction Confirmation...
        <br />
        <span className="text-yellow-500">
          Time Elapsed: {formatTime(hours)}:{formatTime(minutes)}:
          {formatTime(seconds)}
        </span>
      </div>
      <div className="text-white text-left text-lg font-bold mb-1">
        {functionName}
      </div>

      <div className="text-white text-sm mb-3">
        L1 Transaction Approved:{" "}
        <a
          className="text-blue-500 underline"
          href={`https://${
            livenet ? "" : "sepolia."
          }etherscan.io/tx/${l1TxHash}`}
        >
          {l1TxHash}
        </a>
        <br />
        L2 Transaction Awaiting:{" "}
        <a
          className="text-blue-500 underline"
          href={`https://${
            livenet ? "" : "sepolia."
          }arbiscan.io/tx/${l2TxHash}`}
        >
          {l2TxHash}
        </a>
        <br />
        To Contract:{" "}
        <a
          className="text-blue-500 underline"
          href={`https://${livenet ? "" : "sepolia."}arbiscan.io/address/${to}`}
        >
          {to}
        </a>
        <br />
        Timestamp: <span>{timeStamp.toISOString()}</span>
        <br />
        Status: <span className="text-yellow-400">Pending</span>
      </div>

      <hr className="border-gray-700 my-4" />

      <div className="flex justify-center">
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full"
          onClick={() => navigate("/transactions")}
        >
          Check Force Include Eligibility
        </button>
      </div>
    </div>
  );
};

export const L1TransactionBox = ({ selectedFunction }) => {
  const { seconds, minutes, hours } = useStopwatch({
    autoStart: true,
  });
  const formatTime = (timeValue) => {
    return String(timeValue).padStart(2, "0");
  };

  return (
    <div
      className="relative inline-block w-full px-6 py-6 rounded-lg bg-gray-800 shadow-lg"
      style={{
        maxWidth: "800px",
        backgroundColor: "rgba(17, 19, 24, 1)",
      }}
    >
      <div className="text-white text-center text-xl text-shadow text-gray-400 font-bold mb-10">
        Waiting for L1 Transaction ~ DON'T LEAVE THE PAGE...
        <br />
        <span className="text-yellow-500">
          Time Elapsed: {formatTime(hours)}:{formatTime(minutes)}:
          {formatTime(seconds)}
        </span>
      </div>
      <div className="text-white text-left text-lg font-bold mb-1">
        {selectedFunction}
      </div>

      <div className="text-white text-sm mb-3">
        L1 Transaction Approved:{" "}
        <ClipLoader className="ml-2" size={12} color={"#ffffff"} />
      </div>
    </div>
  );
};
