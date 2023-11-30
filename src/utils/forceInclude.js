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
export const forceInclude = async (block) => {
  console.log(`Force Include of just submitted block `);

  // the submission time
  // find status
  // compare to time rn
  // if less than 24 hours exit, otherwise proceed

  // ******************* Execute force include *******************
  const forceInclusionTx = await inboxTools.forceInclude()

  expect(forceInclusionTx, 'Null force inclusion').to.not.be.null
  await forceInclusionTx!.wait()

  const messagesReadAfter = await sequencerInbox.totalDelayedMessagesRead()

  expect(messagesReadAfter.toNumber(), 'Message not read').to.eq(
    startInboxLength.add(1).toNumber()
};
