import { React } from "react";
import { ethers } from "ethers";
import { readABI } from "./readFile";

export const signL2Tx = async (contractAddress, contractABI, userInputs) => {
  // ******************* Grab Program Params *******************
  console.log(`========= signL2Tx =========`);
  console.log(contractAddress, contractABI, userInputs);
  const abi = await readABI(contractABI);

  const { functionName, value: userValue, idata: userParams } = userInputs;

  if (!window.ethereum) {
    alert("MetaMask is not installed!");
    return;
  }

  try {
    // ******************* Grab Account Address *******************
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];

    // ******************* Switch to L2 Chain *******************
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x66eee" }], // Replace with Arbitrum Chain ID
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // ******************* Connect to Contract *******************
    const icontract = new ethers.utils.Interface(abi);
    console.log(icontract);

    const idata = icontract.encodeFunctionData(functionName, userParams);
    console.log(idata);
    console.log(userValue);

    // ******************* Estimate Gas and Nonce *******************
    const nonceNumber = await provider.getTransactionCount(account);
    const estGas = await provider.estimateGas({
      to: contractAddress,
      data: idata,
      value: ethers.utils.parseEther(userValue),
    });
    console.log(estGas);

    // ******************* Create TX Object *******************
    let transaction = {
      to: contractAddress,
      value: ethers.utils.parseEther(userValue),
      data: idata,
      gasLimit: estGas,
      maxPriorityFeePerGas: (await provider.getFeeData()).maxPriorityFeePerGas,
      maxFeePerGas: (await provider.getFeeData()).maxFeePerGas,
      nonce: nonceNumber,
      type: 2,
      chainId: 421614, // TODO: this is arb sepolia curretnyl make it dynamic
    };
    console.log(transaction);

    const transactionRequest = await signer.populateTransaction(transaction);
    console.log(transactionRequest);

    const serializedUnsignedTx =
      ethers.utils.serializeTransaction(transactionRequest);
    console.log(serializedUnsignedTx);

    // ******************* Sign Serialized Tx Objet *******************
    const signature = await window.ethereum.request({
      method: "eth_sign",
      params: [account, ethers.utils.keccak256(serializedUnsignedTx)],
    });
    console.log("Signed message:", signature);

    // ******************* Convert to a TX Format*******************
    const finalTx = ethers.utils.serializeTransaction(
      transactionRequest,
      signature
    );
    return finalTx;
  } catch (error) {
    console.error("Error signing message:", error);
  }
  return;
};
