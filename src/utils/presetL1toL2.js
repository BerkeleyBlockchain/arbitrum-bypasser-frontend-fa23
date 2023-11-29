const { providers, Wallet, ethers } = require("ethers");
const hre = require("hardhat");
const { arbLog, requireEnvVariables } = require("arb-shared-dependencies");
const {
  getL2Network,
  addDefaultLocalNetwork,
} = require("@arbitrum/sdk/dist/lib/dataEntities/networks");
const {
  ArbSys__factory,
} = require("@arbitrum/sdk/dist/lib/abi/factories/ArbSys__factory");
const { InboxTools } = require("@arbitrum/sdk");
requireEnvVariables(["DEVNET_PRIVKEY", "L2RPC", "L1RPC"]);

/**
 * Set up: instantiate L1 / L2 wallets connected to providers
 */
const walletPrivateKey =
  "0x0af43f1582c473359da6e4cb68e9e78047c3299e359e2c6a15cbce4b679362c4";

const l1Provider = new providers.JsonRpcProvider(
  "https://eth-goerli.g.alchemy.com/v2/L5s9838qOYy-EynxkD7bDvhs8khd_1-z"
);
const l2Provider = new providers.JsonRpcProvider(
  "https://arb-goerli.g.alchemy.com/v2/8loe5yJ750okSTjFb7WS3bWXrMD8I1FA"
);

const l1Wallet = new Wallet(walletPrivateKey, l1Provider);
const l2Wallet = new Wallet(walletPrivateKey, l2Provider);

const main = async () => {
  await arbLog("DelayedInbox normal contract call (L2MSG_signedTx)");

  /**
   * Add the default local network configuration to the SDK
   * to allow this script to run on a local node
   */
  addDefaultLocalNetwork();
  const l2Network = await getL2Network(await l2Wallet.getChainId());
  const inboxSdk = new InboxTools(l1Wallet, l2Network);

  /**
   * We deploy greeter to L2, to see if delayed inbox tx can be executed as we thought
   */
  const L2Greeter = await (
    await hre.ethers.getContractFactory("Greeter")
  ).connect(l2Wallet);

  console.log("Deploying Greeter on L2 👋👋");

  const l2Greeter = await L2Greeter.deploy("Hello world");
  await l2Greeter.deployed();
  console.log(`deployed to ${l2Greeter.address}`);

  /**
   * Let's log the L2 greeting string
   */
  const currentL2Greeting = await l2Greeter.greet();
  console.log(`Current L2 greeting: "${currentL2Greeting}"`);

  console.log(
    `Now we send a l2 tx through l1 delayed inbox (Please don't send any tx on l2 using ${l2Wallet.address} during this time):`
  );

  /**
   * Here we have a new greeting message that we want to set as the L2 greeting; we'll be setting it by sending it as a message from delayed inbox!!!
   */
  // const newGreeting = "Greeting from delayedInbox";

  const GreeterIface = l2Greeter.interface;

  const desiredAddress = l2Greeter.address;
  const factoryConnection = ArbSys__factory.connect(desiredAddress, l2Provider);
  const factoryInterface = factoryConnection.interface;

  const desiredFunction = "setGreeting";
  const desiredParams = [];
  const desiredCallDataL2 = factoryInterface.encodeFunctionData(
    desiredFunction,
    desiredParams
  );
  const desiredValue = 0;
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

  /**
   * Now when we call greet again, we should see our new string on L2!
   */
  const newGreetingL2 = await l2Greeter.greet();
  console.log(`Updated L2 greeting: "${newGreetingL2}"`);
  console.log("✌️");
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
