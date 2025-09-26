"use client"

import { useState, useCallback } from "react"
import { ethers } from "ethers"
import { useWeb3 } from "./use-web3"
import { getChainContracts } from "@/lib/web3-config"

export function useStudentFunctions() {
  const [isClaiming, setIsClaiming] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string>("")
  const [error, setError] = useState<string>("")

  const { signer, provider } = useWeb3()

  const claimReward = useCallback(
    async (courseId: number) => {
      if (!signer || !provider) {
        throw new Error("Wallet not connected")
      }

      try {
        setIsClaiming(true)
        setError("")
        setTransactionHash("")

        const network = await provider.getNetwork()
        const contracts = getChainContracts(Number(network.chainId))

        if (!contracts?.courseCompletionTracker) {
          throw new Error("Contract not available on this network.")
        }

        const { address, abi } = contracts.courseCompletionTracker
        const contract = new ethers.Contract(address, abi, signer)

        console.log(`[v0] Claiming reward for course: ${courseId}`)

        const gasEstimate = await contract.claim_reward.estimateGas(courseId)
        const gasLimit = (gasEstimate * BigInt(120)) / BigInt(100)

        const tx = await contract.claim_reward(courseId, { gasLimit })
        setTransactionHash(tx.hash)
        console.log(`[v0] Claim reward transaction submitted: ${tx.hash}`)

        await tx.wait()
        console.log(`[v0] Reward claimed successfully for course: ${courseId}`)

        return tx.hash
      } catch (err: any) {
        let errorMessage = "Failed to claim reward"
        if (err.reason) {
          errorMessage = `Failed to claim reward: ${err.reason}`
        } else if (err.message.includes("user rejected")) {
          errorMessage = "Transaction was rejected by user."
        }
        setError(errorMessage)
        console.error("[v0] Claim reward error:", err)
        throw new Error(errorMessage)
      } finally {
        setIsClaiming(false)
      }
    },
    [signer, provider],
  )

  return {
    claimReward,
    isClaiming,
    transactionHash,
    error,
  }
}
