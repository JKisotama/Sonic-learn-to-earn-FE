import CourseTrackerCompletionABI from "../abi/CourseTrackerCompletionABI.json"
import SonicEduTokenABI from "../abi/SonicEduTokenABI.json"

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
    rpcUrl: "https://eth-sepolia.g.alchemy.com/v2/pomEuJpkfXQWZTQY9wUrZ",
  },
  foundry: {
    chainId: 31337,
    name: "Foundry Local",
    rpcUrl: "http://127.0.0.1:8545",
  },
}

const contracts = {
  courseCompletionTracker: {
    abi: CourseTrackerCompletionABI,
    addresses: {
      [NETWORKS.sepolia.chainId]: "0x0F750c6490697e7eb1c39b9CF57e63e7730E6C57",
      [NETWORKS.foundry.chainId]: "0x0000000000000000000000000000000000000000", 
    },
  },
  sonicEduToken: {
    abi: SonicEduTokenABI,
    addresses: {
      [NETWORKS.sepolia.chainId]: "0xB01BDF2cd806ef5538294bdef9f2510c1bBb2A0e",
      [NETWORKS.foundry.chainId]: "0x0000000000000000000000000000000000000000", 
    },
  },
} as const

type ContractName = keyof typeof contracts

export const getChainContracts = (chainId: number) => {
  const result: Record<ContractName, { address: string; abi: any }> = {} as any

  for (const name in contracts) {
    const contractName = name as ContractName
    const contract = contracts[contractName]
    const address = contract.addresses[chainId]

    if (address) {
      result[contractName] = {
        address,
        abi: contract.abi,
      }
    }
  }

  return result
}
