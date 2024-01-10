import { React } from "react";
const { ethers } = require("ethers");
const {
  getL2Network,
} = require("@arbitrum/sdk/dist/lib/dataEntities/networks");
const { arbitrum, arbitrumSepolia } = require("wagmi/chains");
const { InboxTools } = require("@arbitrum/sdk");
const { BigNumber } = require("ethers");

// ******************* Static Constants *******************
const DELAY_PERIOD = 24 * 60 * 60;

export async function isBlockEligibleForForceInclusion(blockNumber, livenet) {
  // ******************* Grabbing Signer on Sepolia  *******************
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: livenet ? "0x1" : "0xaa36a7" }], // REPLACE with sepolia
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const l1Signer = provider.getSigner();

    // ******************* Eligibility Check Logic *******************
    const block = await l1Signer.getBlock(blockNumber);
    const currentTime = Math.floor(Date.now() / 1000);
    const timeElapsed = currentTime - block.timestamp;
    return timeElapsed > DELAY_PERIOD;
  } catch (err) {
    console.log("Error Creating InboxTools with Ethers Signer: ", err);
    return;
  }
}

export const forceInclude = async (blockNumber, livenet) => {
  console.log(`Checking force inclusion for block ${blockNumber}`);

  // ******************* Check Eligibility of Block  *******************
  const isEligible = await isBlockEligibleForForceInclusion(blockNumber);
  if (!isEligible) {
    console.log("Block is not eligible for force inclusion.");
    return;
  }

  // ******************* Grabbing Signer on Sepolia  *******************
  let inboxSdk;
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: livenet ? "0x1" : "0xaa36a7" }], // REPLACE with sepolia
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const l1Signer = provider.getSigner();
    const l2Network = await getL2Network(
      livenet ? arbitrum.id : arbitrumSepolia.id
    );

    inboxSdk = new InboxTools(l1Signer, l2Network);
  } catch (err) {
    console.log("Error Creating InboxTools with Ethers Signer: ", err);
    return;
  }

  // ******************* Calling Force Include  *******************
  const forceInclusionTx = await inboxSdk.forceInclude({
    blockNumber: BigNumber.from(blockNumber),
  });

  if (!forceInclusionTx) {
    console.log("No eligible messages for force inclusion.");
    return;
  }

  console.log(`Force including messages up to block ${blockNumber}`);
  return forceInclusionTx;
  // await forceInclusionTx.wait();

  // the submission time
  // find status
  // compare to time rn
  // if less than 24 hours exit, otherwise proceed

  // ******************* Execute force include *******************
  //const forceInclusionTx = await inboxTools.forceInclude()

  //expect(forceInclusionTx, 'Null force inclusion').to.not.be.null
  //await forceInclusionTx!.wait()

  // UNCOMMENT LATER
  // const messagesReadAfter = await sequencerInbox.totalDelayedMessagesRead();

  //expect(messagesReadAfter.toNumber(), 'Message not read').to.eq(
  //startInboxLength.add(1).toNumber()
};
