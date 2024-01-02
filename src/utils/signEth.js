import { React } from "react";
import { ethers } from "ethers";

const contractABI = [
  {
    inputs: [{ internalType: "address", name: "destination", type: "address" }],
    name: "withdrawEth",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
];
const contractAddress = "0x0000000000000000000000000000000000000064"; // Replace with the actual contract address

export const signEth = async (transactionl2Request, l2Signer) => {
  // ******************* Grab Program Params *******************
  const { data: message } = transactionl2Request;
  console.log(message);

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

    // ******************* Create Transaction Object *******************
    // const contract = new ethers.Contract(contractAddress, contractABI, signer);
    // console.log(contract);
    // const transactionRequest = await contract.populateTransaction.withdrawEth(
    //   "0x3D0AD1BC6023e75B17b36F04CFc0022687E69084",
    //   {
    //     value: ethers.utils.parseEther("1"), // Convert the ETH amount to Wei
    //   }
    // );
    // console.log(transactionRequest);

    const nonceNumber = await provider.getTransactionCount(account);
    const icontract = new ethers.utils.Interface(contractABI);
    console.log(icontract);
    const idata = icontract.encodeFunctionData("withdrawEth", [
      "0x3D0AD1BC6023e75B17b36F04CFc0022687E69084",
    ]);
    console.log(idata);
    const estGas = await provider.estimateGas({
      to: contractAddress,
      data: idata,
      value: ethers.utils.parseEther("0.000000000000000001"),
    });
    console.log(estGas);
    //USer can send more ETH than needed and will be paid back by the Sponsor contract for the surplus
    //Address of Sponsor contract on Rinkeby is :  0xB3F44F713A267B95329977caD3E82370C02fE9e0
    //Change the chainId if you want to transmit to the Georli
    let transaction = {
      to: contractAddress,
      value: ethers.utils.parseEther("0.000000000000000001"),
      data: idata,
      gasLimit: estGas,
      maxPriorityFeePerGas: (await provider.getFeeData()).maxPriorityFeePerGas,
      maxFeePerGas: (await provider.getFeeData()).maxFeePerGas,
      nonce: nonceNumber,
      type: 2,
      chainId: 421614,
    };
    console.log(transaction);

    const transactionRequest = await signer.populateTransaction(transaction);
    console.log(transactionRequest);
    const serializedUnsignedTx =
      ethers.utils.serializeTransaction(transactionRequest);
    console.log(serializedUnsignedTx);

    const signature = await window.ethereum.request({
      method: "eth_sign",
      params: [account, ethers.utils.keccak256(serializedUnsignedTx)],
    });
    console.log("Signed message:", signature);
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
