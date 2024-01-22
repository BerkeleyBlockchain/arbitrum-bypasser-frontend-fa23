import { React } from "react";
import { ethers } from "ethers";
import { readABI } from "./readFile";

export const signL2Tx = async (
  contractAddress,
  contractABI,
  userInputs,
  livenet
) => {
  // ******************* Grab Program Params *******************
  console.log(`========= signL2Tx =========`);
  console.log(contractAddress, contractABI, userInputs);
  const abi = await readABI(contractABI, livenet);

  const {
    functionName,
    gasBuffer,
    value: userValue,
    idata: userParams,
  } = userInputs;

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
      params: [{ chainId: livenet ? "0xA4B1" : "0x66eee" }], // Replace with Arbitrum Chain ID
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log("ETH Window:", window.ethereum);
    console.log("Provider:", provider);
    const signer = provider.getSigner();
    console.log("Signer:", signer);

    // ******************* Connect to Contract *******************
    const icontract = new ethers.utils.Interface(abi);
    console.log("icontract:", icontract);

    const paramsArray = Object.keys(userParams).map((key) => userParams[key]);
    const idata = icontract.encodeFunctionData(functionName, paramsArray); //this line may be bugging
    console.log("idata:", idata);
    console.log(userValue);

    // ******************* Estimate Gas and Nonce *******************
    const nonceNumber = await provider.getTransactionCount(account);
    console.log(nonceNumber);
    let adjustedGas;
    try {
      const estGas = await provider.estimateGas({
        to: contractAddress,
        data: idata,
        value: ethers.utils.parseEther(userValue),
      });
      const multiplier = ethers.utils.parseUnits(
        (1 + gasBuffer).toString(),
        18
      );
      adjustedGas = estGas
        .mul(multiplier)
        .div(ethers.utils.parseUnits("1", 18));
      console.log(estGas.toString(), adjustedGas.toString());
    } catch (err) {
      console.log("COULDN'T ESTIMATE GAS, USING DEFAULT");
      const estGas = ethers.utils.parseEther("0.00000000000005");
      const multiplier = ethers.utils.parseUnits(
        (1 + gasBuffer).toString(),
        18
      );
      adjustedGas = estGas
        .mul(multiplier)
        .div(ethers.utils.parseUnits("1", 18));
      console.log(estGas.toString(), adjustedGas.toString());
    }

    // ******************* Create TX Object *******************
    let transaction = {
      to: contractAddress,
      value: ethers.utils.parseEther(userValue.toString()),
      data: idata,
      gasLimit: adjustedGas,
      maxPriorityFeePerGas: (await provider.getFeeData()).maxPriorityFeePerGas,
      maxFeePerGas: (await provider.getFeeData()).maxFeePerGas,
      nonce: nonceNumber,
      type: 2,
      chainId: livenet ? 42161 : 421614, // TODO: this is arb sepolia curretnyl make it dynamic
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
