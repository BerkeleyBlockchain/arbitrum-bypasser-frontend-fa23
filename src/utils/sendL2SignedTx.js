import { React } from "react";
import { ethers } from "ethers";
const IInbox__factory_1 = require("@arbitrum/sdk/dist/lib/abi/factories/IInbox__factory");
const message_1 = require("@arbitrum/sdk/dist/lib/dataEntries/dataEntities/message");
const {
  getL2Network,
} = require("@arbitrum/sdk/dist/lib/dataEntities/networks");
const { sepolia, arbitrumSepolia } = require("wagmi/chains");

export const sendL2SignedTx = async (signedL2Tx) => {
  // ******************* Grab Program Params *******************
  console.log(`========= sendL2SignedTx =========`);
  console.log(signedL2Tx);

  if (!window.ethereum) {
    alert("MetaMask is not installed!");
    return;
  }

  try {
    // ******************* setup providers and signers *******************
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];

    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "sepolia.id" }], // Replace with sepolia Chain ID
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // ******************* construct the contract factory *******************
    // const l2Network = await getL2Network(arbitrumSepolia.id);

    // const icontract = IInbox__factory_1.IInbox__factory.connect(
    //   l2Network.ethBridge.inbox,
    //   signer
    // );
    // console.log(icontract);

    const contractABI = IInbox__factory_1.abi; /// alternate approach
    console.log(contractABI);

    const icontract = new ethers.utils.Interface(contractABI);

    // ******************* construct message params *******************
    const sendData = ethers.utils.solidityPack(
      ["uint8", "bytes"],
      [
        ethers.utils.hexlify(message_1.InboxMessageKind.L2MessageType_signedTx),
        signedL2Tx,
      ]
    );

    const idata = icontract.encodeFunctionData("sendL2Message", [sendData]); // TODO
    console.log(idata);

    // TODO: straigtup just call the function call way with ethers
    // ******************* window.eth sendtransaction *******************
    await icontract.functions.sendL2Message(sendData);

    return;
  } catch (error) {
    console.error("Error signing message:", error);
  }
  return;
};
