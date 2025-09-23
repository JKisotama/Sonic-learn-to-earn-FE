// Simplified Web3 configuration using ethers.js only
export const CONTRACT_ADDRESSES = {
  LEARN_TO_EARN: "0x0000000000000000000000000000000000000000",
  SUT_TOKEN: "0x0000000000000000000000000000000000000000",
}

// Contract ABIs (simplified for demo)
export const LEARN_TO_EARN_ABI = [
  "function claimReward(uint256 moduleId)",
  "function canClaimReward(address student, uint256 moduleId) view returns (bool)",
  "function getCompletedModules(address student, uint256[] moduleIds) view returns (bool[] completed, bool[] claimed)",
  "function moduleRewards(uint256 moduleId) view returns (uint256)",
  "event RewardClaimed(address indexed student, uint256 indexed moduleId, uint256 amount)",
]

export const SUT_TOKEN_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
]

// Network configurations
export const NETWORKS = {
  ethereum: {
    chainId: 1,
    name: "Ethereum Mainnet",
    rpcUrl: "https://eth.llamarpc.com",
  },
  sepolia: {
    chainId: 11155111,
    name: "Sepolia Testnet",
    rpcUrl: "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  },
  hardhat: {
    chainId: 31337,
    name: "Hardhat Local",
    rpcUrl: "http://127.0.0.1:8545",
  },
}
