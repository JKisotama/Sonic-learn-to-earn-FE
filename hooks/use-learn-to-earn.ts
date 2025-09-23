"use client"

import { useState, useCallback, useEffect } from "react"
import { ethers } from "ethers"
import { useWeb3 } from "./use-web3"
import { useConfig } from "./use-config"
import { LEARN_TO_EARN_ABI, SUT_TOKEN_ABI } from "@/lib/web3-config"

export function useLearnToEarn() {
  const [isClaimingReward, setIsClaimingReward] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string>("")
  const [error, setError] = useState<string>("")

  const { signer, provider } = useWeb3()
  const { config } = useConfig()

  const claimReward = useCallback(
    async (moduleId: number) => {
      if (!signer || !config?.contracts.LEARN_TO_EARN) {
        throw new Error("Wallet not connected or contract address not available")
      }

      try {
        setIsClaimingReward(true)
        setError("")

        const network = await provider?.getNetwork()
        if (!network) {
          throw new Error("Unable to detect network")
        }

        // Check if we're on the correct network (Sepolia testnet)
        if (network.chainId !== 11155111n) {
          throw new Error("Please switch to Sepolia testnet to claim rewards")
        }

        const contract = new ethers.Contract(config.contracts.LEARN_TO_EARN, LEARN_TO_EARN_ABI, signer)

        const gasEstimate = await contract.claimReward.estimateGas(moduleId)
        const gasLimit = (gasEstimate * 120n) / 100n // Add 20% buffer

        const tx = await contract.claimReward(moduleId, { gasLimit })
        setTransactionHash(tx.hash)

        // Wait for transaction confirmation
        await tx.wait()

        return tx.hash
      } catch (err: any) {
        let errorMessage = "Transaction failed"

        if (err.message.includes("network changed")) {
          errorMessage = "Network changed during transaction. Please try again."
        } else if (err.message.includes("user rejected")) {
          errorMessage = "Transaction was rejected"
        } else if (err.message.includes("insufficient funds")) {
          errorMessage = "Insufficient funds for gas fees"
        } else if (err.reason) {
          errorMessage = err.reason
        } else if (err.message) {
          errorMessage = err.message
        }

        setError(errorMessage)
        console.log("[v0] Claim reward error:", errorMessage)
        throw new Error(errorMessage)
      } finally {
        setIsClaimingReward(false)
      }
    },
    [signer, provider, config],
  )

  const canClaimReward = useCallback(
    async (userAddress: string, moduleId: number) => {
      if (!provider || !config?.contracts.LEARN_TO_EARN) {
        return false
      }

      try {
        const contract = new ethers.Contract(config.contracts.LEARN_TO_EARN, LEARN_TO_EARN_ABI, provider)

        return await contract.canClaimReward(userAddress, moduleId)
      } catch (err) {
        console.error("Error checking claim status:", err)
        return false
      }
    },
    [provider, config],
  )

  const getTokenBalance = useCallback(
    async (userAddress: string) => {
      if (!provider || !config?.contracts.SUT_TOKEN) {
        return 0
      }

      try {
        const contract = new ethers.Contract(config.contracts.SUT_TOKEN, SUT_TOKEN_ABI, provider)

        const balance = await contract.balanceOf(userAddress)
        const decimals = await contract.decimals()

        return Number.parseFloat(ethers.formatUnits(balance, decimals))
      } catch (err) {
        console.error("Error getting token balance:", err)
        return 0
      }
    },
    [provider, config],
  )

  return {
    claimReward,
    canClaimReward,
    getTokenBalance,
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
  const { config } = useConfig()

  const refetch = useCallback(async () => {
    if (!provider || !config?.contracts.SUT_TOKEN || !userAddress) {
      setBalance(0)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const contract = new ethers.Contract(config.contracts.SUT_TOKEN, SUT_TOKEN_ABI, provider)
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
  }, [provider, config, userAddress])

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
  const { config } = useConfig()

  const refetch = useCallback(async () => {
    if (!provider || !config?.contracts.LEARN_TO_EARN || !userAddress || moduleIds.length === 0) {
      setModuleStatus(null)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const contract = new ethers.Contract(config.contracts.LEARN_TO_EARN, LEARN_TO_EARN_ABI, provider)
      const result = await contract.getCompletedModules(userAddress, moduleIds)

      setModuleStatus({
        completed: result[0],
        claimed: result[1],
      })
    } catch (err: any) {
      console.error("Error getting module status:", err)
      setError(err.message || "Failed to fetch module status")
      setModuleStatus(null)
    } finally {
      setIsLoading(false)
    }
  }, [provider, config, userAddress, moduleIds])

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

export function useCanClaimReward(userAddress: string, moduleId: number) {
  const [canClaim, setCanClaim] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { provider } = useWeb3()
  const { config } = useConfig()

  const refetch = useCallback(async () => {
    if (!provider || !config?.contracts.LEARN_TO_EARN || !userAddress || moduleId <= 0) {
      setCanClaim(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const contract = new ethers.Contract(config.contracts.LEARN_TO_EARN, LEARN_TO_EARN_ABI, provider)
      const result = await contract.canClaimReward(userAddress, moduleId)

      setCanClaim(result)
    } catch (err: any) {
      console.error("Error checking claim status:", err)
      setError(err.message || "Failed to check claim status")
      setCanClaim(false)
    } finally {
      setIsLoading(false)
    }
  }, [provider, config, userAddress, moduleId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return {
    canClaim,
    isLoading,
    error,
    refetch,
  }
}
