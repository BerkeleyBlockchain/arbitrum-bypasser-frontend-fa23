const { providers, Wallet, ethers } = require("ethers");
const {
  getL2Network,
  addDefaultLocalNetwork,
} = require("@arbitrum/sdk/dist/lib/dataEntities/networks");
const {
  ArbSys__factory,
} = require("@arbitrum/sdk/dist/lib/abi/factories/ArbSys__factory");
const { InboxTools } = require("@arbitrum/sdk");

/**
 * Set up: instantiate L1 / L2 wallets connected to providers
 */
const walletPrivateKey =
  process.env.REACT_APP_DEVNET_PRIVKEY;

// alchemy nodes for testing
const l1Provider = new providers.JsonRpcProvider(
  process.env.REACT_APP_L1RPC
);
const l2Provider = new providers.JsonRpcProvider(
  process.env.REACT_APP_L2RPC
);

const l1Wallet = new Wallet(walletPrivateKey, l1Provider);
const l2Wallet = new Wallet(walletPrivateKey, l2Provider);

/**
 * Function to send a transaction to the delayed inbox in L2 via L1
 * @address string ~ address of the contract
 * @abi_function  string ~ function name from abi dictionary
 * @parameters array ~ [value, value, value, ...]
 */
export const sendL1toL2 = async (address, abi_function, parameters) => {
  const i = 
  console.log(i);
  console.log("DelayedInbox normal contract call (L2MSG_signedTx)");

  /**
   * Add the default local network configuration to the SDK
   * to allow this script to run on a local node
   */
  addDefaultLocalNetwork();
  const l2Network = await getL2Network(await l2Wallet.getChainId());
  const inboxSdk = new InboxTools(l1Wallet, l2Network);

  /**
   * Here we have a arbsys abi to withdraw our funds; we'll be setting it by sending it as a message from delayed inbox!!!
   */
  const desiredAddress = address;
  const factoryConnection = ArbSys__factory.connect(desiredAddress, l2Provider);
  console.log(factoryConnection);
  const factoryInterface = factoryConnection.interface;

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

  /**
   * We need extract l2's tx hash first so we can check if this tx executed on l2 later.
   */
  const l2SignedTx = await inboxSdk.signL2Tx(transactionl2Request, l2Wallet);
  console.log("Signed L2 tx: ", l2SignedTx);
  return;

  const l2Txhash = ethers.utils.parseTransaction(l2SignedTx).hash;
  console.log(`L2 tx hash: https://goerli.arbiscan.io/tx/${l2Txhash}`);

  const l1Tx = await inboxSdk.sendL2SignedTx(l2SignedTx);
  console.log(
    `Sent this hash to L1 delayed inbox! https://goerli.etherscan.io/tx/${l1Tx.hash}`
  );
  console.log("Waiting for this transaciton to settle on L1...")

  const inboxRec = await l1Tx.wait();
  console.log(
    `Settled on L1! Address here: 🙌  https://goerli.etherscan.io/tx/${inboxRec.transactionHash}`
  );

  /**
   * Now we successfully send the tx to l1 delayed inbox, then we need to wait the tx executed on l2
   */
  console.log(
    `Now we need to wait for tx to be finalized on L2: ${l2Txhash} to be included on l2 (may take 15 minutes) ....... `
  );

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
