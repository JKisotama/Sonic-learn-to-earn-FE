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

interface UseAdminFunctionsProps {
  onTransactionSuccess?: () => void
}

export function useAdminFunctions({ onTransactionSuccess }: UseAdminFunctionsProps = {}) {
  const [isOwner, setIsOwner] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingCourse, setIsAddingCourse] = useState(false)
  const [isMarkingComplete, setIsMarkingComplete] = useState(false)
  const [isRemovingCourse, setIsRemovingCourse] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string>("")
  const [error, setError] = useState<string>("")

  const { signer, provider, account } = useWeb3()
  const contracts = useNetworkContracts()

  // Check if current user is the contract owner
  const checkOwnership = useCallback(async () => {
    if (!provider || !contracts?.courseCompletionTracker || !account) {
      console.log("[v0] Missing dependencies for ownership check:", {
        hasProvider: !!provider,
        hasContract: !!contracts?.courseCompletionTracker,
        hasAddress: !!account,
      })
      setIsOwner(false)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const { address: contractAddress, abi } = contracts.courseCompletionTracker
      const contract = new ethers.Contract(contractAddress, abi, provider)

      console.log("[v0] Checking ownership for:", {
        userAddress: account,
        contractAddress: contractAddress,
      })

      const ownerAddress = await contract.owner()
      console.log("[v0] Contract owner address:", ownerAddress)
      console.log("[v0] User address:", account)
      console.log("[v0] Addresses match:", ownerAddress.toLowerCase() === account.toLowerCase())

      setIsOwner(ownerAddress.toLowerCase() === account.toLowerCase())
    } catch (err: any) {
      console.error("[v0] Error checking ownership:", err)
      setError(`Failed to check ownership: ${err.message}`)
      setIsOwner(false)
    } finally {
      setIsLoading(false)
    }
  }, [provider, contracts, account])

  // Add a new course
  const addCourse = useCallback(
    async (courseId: number, rewardAmount: string) => {
      if (!signer || !provider || !contracts?.courseCompletionTracker) {
        throw new Error("Wallet not connected or contract not available")
      }

      if (!isOwner) {
        throw new Error("Only the contract owner can add courses")
      }

      try {
        setIsAddingCourse(true)
        setError("")
        console.log("[v0] Adding course:", courseId, "with reward:", rewardAmount)

        const network = await provider.getNetwork()
        if (network.chainId !== BigInt(11155111)) {
          throw new Error("Please switch to Sepolia testnet")
        }

        const { address, abi } = contracts.courseCompletionTracker
        const contract = new ethers.Contract(address, abi, signer)

        // Convert reward amount to wei (assuming 18 decimals)
        const rewardAmountWei = ethers.parseEther(rewardAmount)

        console.log("[v0] Estimating gas for add_course...")
        const gasEstimate = await contract.add_course.estimateGas(courseId, rewardAmountWei)
        const gasLimit = (gasEstimate * BigInt(120)) / BigInt(100) // Add 20% buffer

        console.log("[v0] Executing add_course transaction...")
        const tx = await contract.add_course(courseId, rewardAmountWei, { gasLimit })
        setTransactionHash(tx.hash)
        console.log("[v0] Add course transaction submitted:", tx.hash)

        console.log("[v0] Waiting for confirmation...")
        const receipt = await tx.wait()
        console.log("[v0] Course added successfully in block:", receipt.blockNumber)

        onTransactionSuccess?.()
        return tx.hash
      } catch (err: any) {
        let errorMessage = "Failed to add course"

        if (err.message.includes("user rejected")) {
          errorMessage = "Transaction was rejected by user"
        } else if (err.message.includes("insufficient funds")) {
          errorMessage = "Insufficient funds for gas fees"
        } else if (err.reason) {
          errorMessage = `Failed to add course: ${err.reason}`
        } else if (err.message) {
          errorMessage = `Failed to add course: ${err.message}`
        }

        setError(errorMessage)
        console.error("[v0] Add course error:", err)
        throw new Error(errorMessage)
      } finally {
        setIsAddingCourse(false)
      }
    },
    [signer, provider, contracts, isOwner],
  )

  // Mark a student as having completed a course
  const markCompletion = useCallback(
    async (studentAddress: string, courseId: number) => {
      if (!signer || !provider || !contracts?.courseCompletionTracker) {
        throw new Error("Wallet not connected or contract not available")
      }

      if (!isOwner) {
        throw new Error("Only the contract owner can mark completions")
      }

      try {
        setIsMarkingComplete(true)
        setError("")
        console.log("[v0] Marking completion for student:", studentAddress, "course:", courseId)

        const network = await provider.getNetwork()
        if (network.chainId !== BigInt(11155111)) {
          throw new Error("Please switch to Sepolia testnet")
        }

        const { address, abi } = contracts.courseCompletionTracker
        const contract = new ethers.Contract(address, abi, signer)

        // Validate student address
        if (!ethers.isAddress(studentAddress)) {
          throw new Error("Invalid student wallet address")
        }

        console.log("[v0] Estimating gas for mark_completion...")
        const gasEstimate = await contract.mark_completion.estimateGas(studentAddress, courseId)
        const gasLimit = (gasEstimate * BigInt(120)) / BigInt(100) // Add 20% buffer

        console.log("[v0] Executing mark_completion transaction...")
        const tx = await contract.mark_completion(studentAddress, courseId, { gasLimit })
        setTransactionHash(tx.hash)
        console.log("[v0] Mark completion transaction submitted:", tx.hash)

        console.log("[v0] Waiting for confirmation...")
        const receipt = await tx.wait()
        console.log("[v0] Completion marked successfully in block:", receipt.blockNumber)

        onTransactionSuccess?.()
        return tx.hash
      } catch (err: any) {
        let errorMessage = "Failed to mark completion"

        if (err.message.includes("user rejected")) {
          errorMessage = "Transaction was rejected by user"
        } else if (err.message.includes("insufficient funds")) {
          errorMessage = "Insufficient funds for gas fees"
        } else if (err.message.includes("Invalid student")) {
          errorMessage = "Invalid student wallet address"
        } else if (err.reason) {
          errorMessage = `Failed to mark completion: ${err.reason}`
        } else if (err.message) {
          errorMessage = `Failed to mark completion: ${err.message}`
        }

        setError(errorMessage)
        console.error("[v0] Mark completion error:", err)
        throw new Error(errorMessage)
      } finally {
        setIsMarkingComplete(false)
      }
    },
    [signer, provider, contracts, isOwner],
  )

  // Remove a course
  const removeCourse = useCallback(
    async (courseId: number) => {
      if (!signer || !provider || !contracts?.courseCompletionTracker) {
        throw new Error("Wallet not connected or contract not available")
      }

      if (!isOwner) {
        throw new Error("Only the contract owner can remove courses")
      }

      try {
        setIsRemovingCourse(true)
        setError("")
        console.log("[v0] Removing course:", courseId)

        const network = await provider.getNetwork()
        if (network.chainId !== BigInt(11155111)) {
          throw new Error("Please switch to Sepolia testnet")
        }

        const { address, abi } = contracts.courseCompletionTracker
        const contract = new ethers.Contract(address, abi, signer)

        console.log("[v0] Estimating gas for delete_course...")
        const gasEstimate = await contract.delete_course.estimateGas(courseId)
        const gasLimit = (gasEstimate * BigInt(120)) / BigInt(100) // Add 20% buffer

        console.log("[v0] Executing delete_course transaction...")
        const tx = await contract.delete_course(courseId, { gasLimit })
        setTransactionHash(tx.hash)
        console.log("[v0] Remove course transaction submitted:", tx.hash)

        console.log("[v0] Waiting for confirmation...")
        const receipt = await tx.wait()
        console.log("[v0] Course removed successfully in block:", receipt.blockNumber)

        onTransactionSuccess?.()
        return tx.hash
      } catch (err: any) {
        let errorMessage = "Failed to remove course"

        if (err.message.includes("user rejected")) {
          errorMessage = "Transaction was rejected by user"
        } else if (err.reason) {
          errorMessage = `Failed to remove course: ${err.reason}`
        } else if (err.message) {
          errorMessage = `Failed to remove course: ${err.message}`
        }

        setError(errorMessage)
        console.error("[v0] Remove course error:", err)
        throw new Error(errorMessage)
      } finally {
        setIsRemovingCourse(false)
      }
    },
    [signer, provider, contracts, isOwner],
  )

  // Check ownership when dependencies change
  useEffect(() => {
    checkOwnership()
  }, [checkOwnership])

  return {
    addCourse,
    markCompletion,
    removeCourse,
    isOwner,
    isLoading,
    isAddingCourse,
    isMarkingComplete,
    isRemovingCourse,
    transactionHash,
    error,
  }
}
