const setup = async () => {
    const signers = await ethers.getSigners()
    const signer = signers[0]
    const provider = signer.provider

    const arbitrumOne = await getL2Network(42161)

    const sequencerInbox = SequencerInbox__factory.connect(
      arbitrumOne.ethBridge.sequencerInbox,
      provider
    )

    const bridge = Bridge__factory.connect(
      arbitrumOne.ethBridge.bridge,
      provider
    )

    return {
      l1Signer: signer,
      l1Provider: provider,
      l2Network: arbitrumOne,
      sequencerInbox,
      bridge,
    }
  }