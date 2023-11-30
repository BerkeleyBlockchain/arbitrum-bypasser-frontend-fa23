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

const { BigNumber } = require("ethers");

// Add these constants at the top of your file
const DELAY_PERIOD = 24 * 60 * 60; // 24 hours in seconds

/**
 * Check if a block is eligible for force inclusion.
 * @param {number} blockNumber - The block number to check.
 * @returns {boolean} True if the block is eligible for force inclusion, false otherwise.
 */
async function isBlockEligibleForForceInclusion(blockNumber) {
  const block = await l1Provider.getBlock(blockNumber);
  const currentTime = Math.floor(Date.now() / 1000); 
  const timeElapsed = currentTime - block.timestamp;
  return timeElapsed > DELAY_PERIOD;
}
async function main() {
  // The third element in process.argv is your first command-line argument
  const blockHash = process.argv[2];

  if (!blockHash) {
      console.error("Please provide a block hash.");
      process.exit(1);
  }

  // Call your forceInclude function here with the blockHash
  try {
      await forceInclude(blockHash);
      console.log("Force include executed successfully.");
  } catch (error) {
      console.error("Error during force include:", error.message);
  }
}

// Execute the main function
main();

/**
 * Primary function to send a transaction to the delayed inbox in L2 via L1
 * @param {string} address ~ address of the contract
 * @param {string} abi_function ~ function name from abi dictionary
 * @param {array} parameters ~ [value, value, value, ...]
 */
const forceInclude = async (block) => {
  console.log(`Checking force inclusion for block ${blockNumber}`);

  // Check if the block is eligible for force inclusion
  const isEligible = await isBlockEligibleForForceInclusion(blockNumber);
  if (!isEligible) {
    console.log("Block is not eligible for force inclusion.");
    return;
  }

  // Initialize InboxTools
  const l2Network = await getL2Network(await l2Wallet.getChainId());
  const inboxSdk = new InboxTools(l1Wallet, l2Network);

  // Execute force include
  const forceInclusionTx = await inboxSdk.forceInclude({
    blockNumber: BigNumber.from(blockNumber)
  });

  if (!forceInclusionTx) {
    console.log("No eligible messages for force inclusion.");
    return;
  }

  console.log(`Force including messages up to block ${blockNumber}`);
  await forceInclusionTx.wait();

  // the submission time
  // find status
  // compare to time rn
  // if less than 24 hours exit, otherwise proceed

  // ******************* Execute force include *******************
  //const forceInclusionTx = await inboxTools.forceInclude()

  //expect(forceInclusionTx, 'Null force inclusion').to.not.be.null
  //await forceInclusionTx!.wait()

  const messagesReadAfter = await sequencerInbox.totalDelayedMessagesRead()

  //expect(messagesReadAfter.toNumber(), 'Message not read').to.eq(
    //startInboxLength.add(1).toNumber()
};
module.exports = { forceInclude };
