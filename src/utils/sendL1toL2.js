// Contributors: Tommy, Jay, Dhruv
import { React } from "react";
import { signEth } from "./signEth";
const { providers, Wallet, ethers } = require("ethers");

const {
  getL2Network,
  addDefaultLocalNetwork,
} = require("@arbitrum/sdk/dist/lib/dataEntities/networks");
const {
  ArbSys__factory,
} = require("@arbitrum/sdk/dist/lib/abi/factories/ArbSys__factory");
const { InboxTools } = require("@arbitrum/sdk");
const { sepolia, arbitrumSepolia } = require("wagmi/chains");

// ******************* Grab Custom Node RPCS for Eth and Goerli *******************
const l1Provider = new providers.JsonRpcProvider(process.env.REACT_APP_L1RPC);
const l2Provider = new providers.JsonRpcProvider(process.env.REACT_APP_L2RPC);

// ******************* instantiate L1 / L2 wallets connected to providers *******************
// const walletPrivateKey = process.env.REACT_APP_DEVNET_PRIVKEY; // might need to change cuz no access to prviate key
// const l1Wallet = new Wallet(client, l1Provider);
// const l2Wallet = new Wallet(client, l2Provider);
// console.log("L1 Wallet: ", l1Wallet);
// console.log("L2 Wallet: ", l2Wallet);

/**
 * Primary function to send a transaction to the delayed inbox in L2 via L1
 * @param {Provider} client ~ provider to send transaction
 * @param {string} address ~ address of the contract
 * @param {string} abi_function ~ function name from abi dictionary
 * @param {array} parameters ~ [value, value, value, ...]
 */
export const sendL1toL2 = async (
  l1Signer,
  l2Signer,
  client,
  address,
  abi_function,
  parameters
) => {
  // console.log(await l1Signer.getGasPrice());
  // return;
  console.log(`Starting transaction from l1 to l2 for ${abi_function}...`);

  // ******************* Inbox Set up and Grab L2 Network *******************
  addDefaultLocalNetwork(); // allows local network configuration via sDK, runs script on local node
  const l2Network = await getL2Network(arbitrumSepolia.id);
  // In this case the client is functioning as the l1Wallet
  const inboxSdk = new InboxTools(l1Signer, l2Network);
  console.log(inboxSdk);

  // ******************* Setting ArbSys Factory and Interface *******************
  const desiredAddress = address;
  const factoryConnection = ArbSys__factory.connect(desiredAddress, l2Provider);
  console.log(factoryConnection);
  const factoryInterface = factoryConnection.interface;

  // ******************* Preparing parameters and tranasction request *******************
  const desiredFunction = abi_function;
  const desiredParams = parameters;
  const desiredCallDataL2 = factoryInterface.encodeFunctionData(
    desiredFunction,
    desiredParams
  );
  const desiredValue = 1;

  const transactionl2Request = {
    data: desiredCallDataL2,
    to: desiredAddress,
    value: desiredValue,
  };
  console.log(transactionl2Request);

  // ******************* Presigning l2 tx and sending it via l1 *******************

  // try {
  //   // Switch to get the L2 version of Client
  //   await client.data.switchChain({ id: arbitrumSepolia.id });
  //   console.log(client.data);
  // } catch (error) {
  //   console.log(error);
  //   return { l1Tx: null, l2Tx: null, l2Status: 0 };
  // }

  const l2SignedTx = await signEth(transactionl2Request, l2Signer); /// this client is l2 signer
  console.log("Signed L2 tx: ", l2SignedTx);

  // const l2SignedTx = await inboxSdk.signL2Tx(transactionl2Request, l2Signer); /// this client is l2 signer
  // console.log("Signed L2 tx: ", l2SignedTx);

  const l2Txhash = ethers.utils.parseTransaction(l2SignedTx).hash; // extract hash to check if tx executed on l2 later
  console.log(
    `Signed this L2 tx hash but not broadcasted: https://sepolia.arbiscan.io/tx/${l2Txhash}`
  );

  // ******************* Sending the L2 Signed message through L1 Now *******************
  const l1Tx = await inboxSdk.sendL2SignedTx(l2SignedTx);
  console.log(`L1 tx hash created: ${l1Tx.hash}`);
  console.log("Waiting for this transaciton to settle on L1...");

  const inboxRec = await l1Tx.wait();
  console.log(
    `Settled on L1! Address here: 🙌  https://sepolia.etherscan.io/tx/${inboxRec.transactionHash}`
  );

  // ******************* Waiting for settlement on L2 *******************
  console.log(
    `Now we need to wait for tx to be finalized on L2: ${l2Txhash} to be included on l2 (may take 15 minutes) ....... `
  );
  // Don't need to wait because this will move to frontend move this secitop
  return { l1TxHash: inboxRec.transactionHash, l2TxHash: l2Txhash, status: 1 };
};

// ******************* Checking Transaction Completion *******************
export const checkTx = async (l2Txhash) => {
  const l2TxReceipt = await l2Provider.waitForTransaction(l2Txhash);
  const status = l2TxReceipt.status;
  if (status == true) {
    console.log(`L2 Txn Accepted!`);
  } else {
    console.log(`L2 Txn Failed...`);
  }

  return l2TxReceipt;
};
