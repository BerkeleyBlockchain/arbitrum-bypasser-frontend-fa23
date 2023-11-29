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
  "0x0af43f1582c473359da6e4cb68e9e78047c3299e359e2c6a15cbce4b679362c4";

// alchemy nodes for testing
const l1Provider = new providers.JsonRpcProvider(
  "https://eth-goerli.g.alchemy.com/v2/L5s9838qOYy-EynxkD7bDvhs8khd_1-z"
);
const l2Provider = new providers.JsonRpcProvider(
  "https://arb-goerli.g.alchemy.com/v2/8loe5yJ750okSTjFb7WS3bWXrMD8I1FA"
);

const l1Wallet = new Wallet(walletPrivateKey, l1Provider);
const l2Wallet = new Wallet(walletPrivateKey, l2Provider);

/**
 * Main Function Testing
 */
const main = async (address, abi_function, parameters) => {
  await arbLog("DelayedInbox normal contract call (L2MSG_signedTx)");

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

  /**
   * We need extract l2's tx hash first so we can check if this tx executed on l2 later.
   */
  const l2SignedTx = await inboxSdk.signL2Tx(transactionl2Request, l2Wallet);

  const l2Txhash = ethers.utils.parseTransaction(l2SignedTx).hash;

  const l1Tx = await inboxSdk.sendL2SignedTx(l2SignedTx);

  const inboxRec = await l1Tx.wait();

  console.log(
    `TXN to send to delayed inbox confirmed on L1! 🙌 ${inboxRec.transactionHash}`
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
};

main("0x0000000000000000000000000000000000000064", "withdrawEth", [
  l1Wallet.address,
])
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
