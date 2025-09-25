"use client"

import { useState, useCallback, useEffect } from "react"
import { ethers } from "ethers"
import { useWeb3 } from "./use-web3"
import { getChainContracts } from "@/lib/web3-config"

// Helper to get contracts for the current network
const useNetworkContracts = () => {
  const { provider } = useWeb3()
  const [contracts, setContracts] = useState<ReturnType<typeof getChainContracts> | null>(null)

  useEffect(() => {
    const fetchContracts = async () => {
      if (provider) {
        const network = await provider.getNetwork()
        setContracts(getChainContracts(Number(network.chainId)))
      } else {
        setContracts(null)
      }
    }
    fetchContracts()
  }, [provider])

  return contracts
}

export function useLearnToEarn() {
  const [isClaimingReward, setIsClaimingReward] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string>("")
  const [error, setError] = useState<string>("")

  const { signer, provider } = useWeb3()
  const contracts = useNetworkContracts()

  const claimReward = useCallback(
    async (courseId: number) => {
      if (!signer || !provider || !contracts?.courseCompletionTracker) {
        throw new Error("Wallet not connected or contract not available on this network")
      }

      try {
        setIsClaimingReward(true)
        setError("")
        console.log("[v1] Starting SET token claim process for course:", courseId)

        const network = await provider.getNetwork()
        if (!network) {
          throw new Error("Unable to detect network")
        }
        console.log("[v1] Current network:", network.chainId)

        if (network.chainId !== BigInt(11155111)) {
          throw new Error("Please switch to Sepolia testnet to claim SET tokens")
        }

        const { address, abi } = contracts.courseCompletionTracker
        const contract = new ethers.Contract(address, abi, signer)

        console.log("[v1] Estimating gas for SET token claim...")
        // Note: Smart contract function is claim_reward
        const gasEstimate = await contract.claim_reward.estimateGas(courseId)
        const gasLimit = (gasEstimate * BigInt(120)) / BigInt(100) // Add 20% buffer
        console.log("[v1] Gas estimate:", gasEstimate.toString(), "Gas limit:", gasLimit.toString())

        console.log("[v1] Executing SET token claim transaction...")
        const tx = await contract.claim_reward(courseId, { gasLimit })
        setTransactionHash(tx.hash)
        console.log("[v1] SET token claim transaction submitted:", tx.hash)

        console.log("[v1] Waiting for SET token claim confirmation...")
        const receipt = await tx.wait()
        console.log("[v1] SET token claim confirmed in block:", receipt.blockNumber)

        return tx.hash
      } catch (err: any) {
        let errorMessage = "SET token claim failed"

        if (err.message.includes("network changed")) {
          errorMessage = "Network changed during SET token claim. Please try again."
        } else if (err.message.includes("user rejected")) {
          errorMessage = "SET token claim was rejected by user"
        } else if (err.message.includes("insufficient funds")) {
          errorMessage = "Insufficient funds for gas fees to claim SET tokens"
        } else if (err.reason) {
          errorMessage = `SET token claim failed: ${err.reason}`
        } else if (err.message) {
          errorMessage = `SET token claim failed: ${err.message}`
        }

        setError(errorMessage)
        console.error("[v1] SET token claim error:", err)
        throw new Error(errorMessage)
      } finally {
        setIsClaimingReward(false)
      }
    },
    [signer, provider, contracts],
  )

  return {
    claimReward,
    isClaimingReward,
    transactionHash,
    error,
  }
}

export function useTokenBalance(userAddress: string) {
  const [balance, setBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { provider } = useWeb3()
  const contracts = useNetworkContracts()

  const refetch = useCallback(async () => {
    if (!provider || !contracts?.sonicEduToken || !userAddress) {
      setBalance(0)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const { address, abi } = contracts.sonicEduToken
      const contract = new ethers.Contract(address, abi, provider)
      const balanceResult = await contract.balanceOf(userAddress)
      const decimals = await contract.decimals()

      const formattedBalance = Number.parseFloat(ethers.formatUnits(balanceResult, decimals))
      setBalance(formattedBalance)
    } catch (err: any) {
      console.error("Error getting token balance:", err)
      setError(err.message || "Failed to fetch balance")
      setBalance(0)
    } finally {
      setIsLoading(false)
    }
  }, [provider, contracts, userAddress])

  useEffect(() => {
    refetch()
  }, [refetch])

  return {
    balance,
    isLoading,
    error,
    refetch,
  }
}

export function useModuleStatus(userAddress: string, moduleIds: number[]) {
  const [moduleStatus, setModuleStatus] = useState<{
    completed: boolean[]
    claimed: boolean[]
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { provider } = useWeb3()
  const contracts = useNetworkContracts()

  const refetch = useCallback(async () => {
    if (!provider || !contracts?.courseCompletionTracker || !userAddress || moduleIds.length === 0) {
      setModuleStatus(null)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const { address, abi } = contracts.courseCompletionTracker
      const contract = new ethers.Contract(address, abi, provider)

      // Call has_completed and has_claimed_reward for each module
      const completedPromises = moduleIds.map((id) => contract.has_completed(userAddress, id))
      const claimedPromises = moduleIds.map((id) => contract.has_claimed_reward(userAddress, id))

      const completedResults = await Promise.all(completedPromises)
      const claimedResults = await Promise.all(claimedPromises)

      setModuleStatus({
        completed: completedResults,
        claimed: claimedResults,
      })
    } catch (err: any) {
      console.error("Error getting module status:", err)
      setError(err.message || "Failed to fetch module status")
      setModuleStatus(null)
    } finally {
      setIsLoading(false)
    }
  }, [provider, contracts, userAddress, moduleIds])

  useEffect(() => {
    refetch()
  }, [refetch])

  return {
    moduleStatus,
    isLoading,
    error,
    refetch,
  }
}
