## ArbPasser - Execute transactions on Arbitrum L2 using your ETH account
ArbPasser is currently deployed and hosted at [Arbitrum Bypasser](https://arbitrum-bypasser.vercel.app) on Vercel. 

Publication:
- [Arbitrum Tweet](https://x.com/arbitrum/status/1765642536985805241?s=20)
- [CalBlockchain Tweet](https://x.com/CalBlockchain/status/1765558030207516875?s=20)
- [Arbitrum Forum Proposal](https://forum.arbitrum.foundation/t/proposal-front-end-interface-to-force-transaction-inclusion-during-sequencer-downtime/21247/12?u=hkalodner)


<img width="1548" alt="arbpasser-landing" src="https://github.com/BerkeleyBlockchain/arbitrum-bypasser-frontend-fa23/assets/47396265/6d9bc994-b5eb-4708-812f-d07e62d9460a">
<img width="1567" alt="arbpasser-swap" src="https://github.com/BerkeleyBlockchain/arbitrum-bypasser-frontend-fa23/assets/47396265/b79cf75a-9e3a-48db-bcb3-5af2a44cebcf">
<img width="1551" alt="arbbpasser-transactions" src="https://github.com/BerkeleyBlockchain/arbitrum-bypasser-frontend-fa23/assets/47396265/f706f320-358c-47d6-b1db-0df7a625e07d">

### Description

ArbPasser is a groundbreaking tool in the blockchain space, designed as part of the Blockchain at Berkeley Fall 2023 consulting project with Arbitrum. This innovative application provides an alternative method for users to interact with Arbitrum through execution on a Layer 1 network like Ethereum. By enabling users to execute and sign their transactions with their MetaMask wallet while remaining on the Ethereum network, ArbPasser offers a unique approach to blockchain interactions.

![arb-sequencer](https://github.com/BerkeleyBlockchain/arbitrum-bypasser-frontend-fa23/assets/47396265/d697bd7a-620f-4713-bf86-14e24582c7b8)

In the blockchain domain, network reliability and trust in nodes are significant concerns. Issues like censorship by an RPC node or sequencer downtime can inhibit transactions during bridging or switching between chain-specific applications. ArbPasser addresses these challenges by:

- **Transaction Inclusion**: Allowing users to send their presigned Layer 2 (L2) transactions to a contract on Ethereum, which then bridges these transactions to a delayed inbox on Arbitrum One.
- **Transaction Submission**: Providing users with the option to force include their transaction, thus bypassing potential barriers.
![implementaiton-diagram](https://github.com/BerkeleyBlockchain/arbitrum-bypasser-frontend-fa23/assets/47396265/0300a0f0-e95a-4a95-99ac-8b2388f1f8b3)

![tech-arch](https://github.com/BerkeleyBlockchain/arbitrum-bypasser-frontend-fa23/assets/47396265/1a31df04-bb16-4c09-acd1-76dac968cddc)

### Installation and Setup

#### Prerequisites

Ensure you have `npm` installed on your machine. For installation instructions, visit [npm's official site](https://www.npmjs.com/get-npm).

#### Steps

1. **Clone the repository**:

   ```
   git clone https://github.com/your-organization/arb-passer.git
   cd arb-passer
   ```

2. **Install dependencies**:

   ```
   npm install
   ```

3. **Set up environment variables**:

   - Copy the `.env.example` file to a new file named `.env`.
   - Contact Tommy or Jay for the secret keys and fill them in the `.env` file.

4. **Start the application locally**:

   ```
   npm start
   ```

   The application should now be running on `localhost:3000`.

### Contributors

Key contributors to ArbPasser include Mehdi, Hunter, Fred, Dhruv, Arjun, Rishi, Jessica, and Vardhan. Their collective efforts and expertise have been instrumental in bringing this innovative solution to the blockchain community.

### Notes

- ArbPasser is part of a collaborative effort with Blockchain at Berkeley and Arbitrum for their Fall 2023 consulting project.
- For any further queries or contributions, feel free to contact the project maintainers.

---

This README provides a basic overview of ArbPasser. For more detailed documentation, refer to the project wiki or contact the project maintainers.
