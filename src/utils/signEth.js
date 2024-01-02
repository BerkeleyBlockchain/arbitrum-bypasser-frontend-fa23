import { React } from "react";
import { ethers } from "ethers";

export const signEth = async (transactionl2Request, l2Signer) => {
  const { data: message } = transactionl2Request;
  console.log(transactionl2Request);

  if (!window.ethereum) {
    alert("MetaMask is not installed!");
    return;
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];
    const messageHash = ethers.utils.sha256(ethers.utils.toUtf8Bytes(message)); // Message is encrypted using sha256, this can be changed. personal_sign is used for a regular string

    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x66eee" }], // Replace with Arbitrum Chain ID
    });

    const signature = await window.ethereum.request({
      method: "eth_sign",
      // params: [account, window.ethers.utils.hexlify(window.ethers.utils.toUtf8Bytes(message))],
      params: [account, messageHash],
    });
    console.log("Signed message:", signature);
    return signature;
  } catch (error) {
    console.error("Error signing message:", error);
  }
  return;
};
