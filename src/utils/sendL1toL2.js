// Contributors: Tommy, Jay
"use client";
import { React } from "react";
import { signL2Tx } from "./signL2Tx";
import { ethers } from "ethers";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";

const {
  getL2Network,
} = require("@arbitrum/sdk/dist/lib/dataEntities/networks");
const { InboxTools } = require("@arbitrum/sdk");
const { arbitrum, arbitrumSepolia } = require("wagmi/chains");

// ******************* Grab Custom Node RPCS for Eth and Goerli *******************
const l2Provider = jsonRpcProvider({ rpc: process.env.REACT_APP_L2RPC });

export const sendL1toL2 = async (
  contractAddress,
  contractName,
  contractABI,
  userInputs,
  livenet
) => {
  // ******************* Preliminary Checks *******************
  console.log(`========= sendL1toL2 =========`);
  console.log(`Starting transaction from l1 to l2 for ${contractName}...`);
  console.log(contractAddress, contractABI, userInputs);

  if (!window.ethereum) {
    alert("MetaMask is not installed!");
    return;
  }

  // ******************* Presigning a transaction to the address *******************
  const l2SignedTx = await signL2Tx(
    contractAddress,
    contractABI,
    userInputs,
    livenet
  );
  console.log("Contract Address: ", contractAddress);
  console.log("Contract ABI: ", contractABI);
  console.log("User Inputs: ", userInputs);
  console.log("Livenet: ", livenet);
  console.log("Signed L2 tx: ", l2SignedTx);
  // for debugging

  const l2Txhash = ethers.utils.parseTransaction(l2SignedTx).hash; // extract hash to check if tx executed on l2 later
  console.log(
    `Signed this L2 tx hash but not broadcasted: https://${
      livenet ? "" : "sepolia."
    }arbiscan.io/tx/${l2Txhash}`
  );

  // ******************* Grabbing Signer on Sepolia  *******************
  let inboxSdk;
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: livenet ? "0x1" : "0xaa36a7" }], // REPLACE with sepolia
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const l1Signer = provider.getSigner();
    const l2Network = await getL2Network(
      livenet ? arbitrum.id : arbitrumSepolia.id
    );

    inboxSdk = new InboxTools(l1Signer, l2Network);
  } catch (err) {
    console.log("Error Creating InboxTools with Ethers Signer: ", err);
    return;
  }

  // ******************* Sending signed l2 tx to delayedinbox via l1 contrct  *******************
  console.log(`========= sendingToL2Bridge =========`);
  const l1Tx = await inboxSdk.sendL2SignedTx(l2SignedTx);
  console.log(`L1 tx hash created: ${l1Tx.hash}`);
  console.log("Waiting for this transaciton to settle on L1...");

  const l1SentTx = await l1Tx.wait();
  console.log(
    `Settled on L1! Address here: 🙌  https://${
      livenet ? "" : "sepolia."
    }etherscan.io/tx/${l1SentTx.transactionHash}`
  );

  // Waiting for Settlement on L2
  console.log(
    `Now we need to wait for tx to be finalized on L2: ${l2Txhash} to be included on l2 (may take 15 minutes) ....... `
  );

  // Don't need to wait because this will move to frontend move this secitop
  return {
    l1TxHash: l1SentTx.transactionHash,
    l2TxHash: l2Txhash,
    status: false,
  };
};

// ******************* Checking Transaction Completion *******************
export const checkTx = async (l2Txhash) => {
  const l2TxReceipt = await l2Provider.waitForTransaction(l2Txhash);
  const status = l2TxReceipt.status;
  if (status === true) {
    console.log(`L2 Txn Accepted!`);
  } else {
    console.log(`L2 Txn Failed...`);
  }

  return l2TxReceipt;
};
