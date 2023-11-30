const { providers, Wallet, ethers } = require("ethers");
const {
  getL2Network,
  addDefaultLocalNetwork,
} = require("@arbitrum/sdk/dist/lib/dataEntities/networks");
const {
  ArbSys__factory,
} = require("@arbitrum/sdk/dist/lib/abi/factories/ArbSys__factory");
const { InboxTools } = require("@arbitrum/sdk");

// ******************* Grab Custom Node RPCS for Eth and Goerli *******************
const l1Provider = new providers.JsonRpcProvider(process.env.REACT_APP_L1RPC);
const l2Provider = new providers.JsonRpcProvider(process.env.REACT_APP_L2RPC);

// ******************* instantiate L1 / L2 wallets connected to providers *******************
const walletPrivateKey = process.env.REACT_APP_DEVNET_PRIVKEY; // might need to change cuz no access to prviate key
const l1Wallet = new Wallet(walletPrivateKey, l1Provider);
const l2Wallet = new Wallet(walletPrivateKey, l2Provider);

/**
 * Primary function to send a transaction to the delayed inbox in L2 via L1
 * @param {string} address ~ address of the contract
 * @param {string} abi_function ~ function name from abi dictionary
 * @param {array} parameters ~ [value, value, value, ...]
 */
export const sendL1toL2 = async (address, abi_function, parameters) => {
  console.log(`Starting transaction from l1 to l2 for ${abi_function}...`);

  // ******************* Inbox Set up and Grab L2 Network *******************
  addDefaultLocalNetwork(); // allows local network configuration via sDK, runs script on local node
  const l2Network = await getL2Network(await l2Wallet.getChainId());
  const inboxSdk = new InboxTools(l1Wallet, l2Network);

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
  const l2SignedTx = await inboxSdk.signL2Tx(transactionl2Request, l2Wallet); // presigning l2 tx
  console.log("Signed L2 tx: ", l2SignedTx);

  const l2Txhash = ethers.utils.parseTransaction(l2SignedTx).hash; // extract hash to check if tx executed on l2 later
  console.log(`L2 tx hash: https://goerli.arbiscan.io/tx/${l2Txhash}`);

  const l1Tx = await inboxSdk.sendL2SignedTx(l2SignedTx);
  console.log(
    `Sent this hash to L1 delayed inbox! https://goerli.etherscan.io/tx/${l1Tx.hash}`
  );
  console.log("Waiting for this transaciton to settle on L1...");

  const inboxRec = await l1Tx.wait();
  console.log(
    `Settled on L1! Address here: 🙌  https://goerli.etherscan.io/tx/${inboxRec.transactionHash}`
  );

  // ******************* Waiting for settlement on L2 *******************
  console.log(
    `Now we need to wait for tx to be finalized on L2: ${l2Txhash} to be included on l2 (may take 15 minutes) ....... `
  );

  // TODO: Dont need to wait because this will move to frontend move this secitopn
  const l2TxReceipt = await l2Provider.waitForTransaction(l2Txhash);

  const status = l2TxReceipt.status;
  if (status === true) {
    console.log(`L2 txn executed!!! 🥳 `);
  } else {
    console.log(`L2 txn failed, see if your gas is enough?`);
    return;
  }

  return l2TxReceipt;
};
