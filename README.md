## ArbPasser - Execute transactions on Arbitrum L2 using your ETH account

### Description

ArbPasser is a groundbreaking tool in the blockchain space, designed as part of the Blockchain at Berkeley Fall 2023 consulting project with Arbitrum. This innovative application provides an alternative method for users to interact with Arbitrum through execution on a Layer 1 network like Ethereum. By enabling users to execute and sign their transactions with their MetaMask wallet while remaining on the Ethereum network, ArbPasser offers a unique approach to blockchain interactions.

In the blockchain domain, network reliability and trust in nodes are significant concerns. Issues like censorship by an RPC node or sequencer downtime can inhibit transactions during bridging or switching between chain-specific applications. ArbPasser addresses these challenges by:

- **Transaction Inclusion**: Allowing users to send their presigned Layer 2 (L2) transactions to a contract on Ethereum, which then bridges these transactions to a delayed inbox on Arbitrum One.
- **Transaction Submission**: Providing users with the option to force include their transaction, thus bypassing potential barriers.

ArbPasser is currently deployed and hosted at [Arbitrum Bypasser](https://arbitrum-bypasser.vercel.app) on Vercel.

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
