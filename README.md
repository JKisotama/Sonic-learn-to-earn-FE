# Sonic University - Learn to Earn DApp

A decentralized learning platform where students can earn SUT (Sonic University Token) rewards for completing blockchain course modules.

## Features

- **Smart Contract Integration**: Built with Solidity smart contracts for transparent reward distribution
- **Wallet Connection**: Connect with MetaMask and other Web3 wallets using wagmi
- **Course Modules**: Complete blockchain courses and earn token rewards
- **Real-time Updates**: Live balance and progress tracking from the blockchain
- **Modern UI**: Beautiful, responsive interface inspired by leading fintech platforms

## Smart Contracts

### LearnToEarn Contract
- Manages course completion verification
- Handles token reward distribution
- Tracks student progress and claims

### SonicUniversityToken (SET)
- ERC-20 token for rewards
- Mintable by contract owner (university)
- Used for incentivizing learning

## Getting Started

1. **Install Dependencies**
\`\`\`bash
npm install
\`\`\`

2. **Set Environment Variables**
Create a `.env.local` file:
\`\`\`
NEXT_PUBLIC_LEARN_TO_EARN_CONTRACT=0x...
NEXT_PUBLIC_SUT_TOKEN_CONTRACT=0x...
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
\`\`\`

3. **Deploy Smart Contracts**
Deploy the contracts to your preferred network and update the contract addresses.

4. **Run Development Server**
\`\`\`bash
npm run dev
\`\`\`

## Usage

1. **Connect Wallet**: Click "Connect Wallet" to connect your Web3 wallet
2. **View Modules**: Browse available course modules and their rewards
3. **Complete Courses**: Complete course modules (marked by admin)
4. **Claim Rewards**: Click "Claim" to receive SET tokens for completed modules
5. **Track Progress**: Monitor your token balance and learning progress

## Architecture

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Web3 Integration**: wagmi + etherJS for Ethereum interactions
- **Smart Contracts**: Solidity with OpenZeppelin libraries
- **State Management**: React hooks with TanStack Query

## Contract Functions

### For Students
- `claimReward(moduleId)`: Claim tokens for completed modules
- `canClaimReward(student, moduleId)`: Check if reward can be claimed

### For Administrators
- `markModuleCompleted(student, moduleId)`: Mark student module as complete
- `setModuleReward(moduleId, amount)`: Set reward amount for modules
- `fundContract(amount)`: Add tokens to reward pool

## Security Features

- **ReentrancyGuard**: Prevents reentrancy attacks
- **Access Control**: Owner-only functions for admin operations
- **Input Validation**: Comprehensive checks for all operations
- **Event Logging**: All actions are logged for transparency
