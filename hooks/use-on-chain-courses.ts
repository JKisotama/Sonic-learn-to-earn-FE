"use client"

import { useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"
import { useWeb3 } from "./use-web3"
import { getChainContracts } from "@/lib/web3-config"
import { coursesData } from "@/lib/courses-data"

export interface OnChainCourse {
  id: number
  reward: number
  isCreated: boolean
  hasCompleted: boolean
  hasClaimed: boolean
  status: "available" | "completed" | "claimable"
  title: string
}

export function useOnChainCourses() {
  const { provider, account } = useWeb3()
  const [onChainCourses, setOnChainCourses] = useState<OnChainCourse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCourseData = useCallback(async () => {
    if (!provider) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const network = await provider.getNetwork()
      const contracts = getChainContracts(Number(network.chainId))

      if (!contracts?.courseCompletionTracker) {
        throw new Error("CourseTrackerCompletion contract not found for the current network.")
      }

      const { address, abi } = contracts.courseCompletionTracker
      const contract = new ethers.Contract(address, abi, provider)

      // Attempt to discover courses by iterating.
      const potentialIds = Array.from({ length: 20 }, (_, i) => i + 1) // Check IDs 1-20 for now

      const coursePromises = potentialIds.map(async (courseId) => {
        try {
          const onChainCourse = await contract.courses(courseId)
          if (!onChainCourse.is_created) {
            return null
          }

          let hasCompleted = false
          let hasClaimed = false

          if (account) {
            hasCompleted = await contract.has_completed(account, courseId)
            hasClaimed = await contract.has_claimed_reward(account, courseId)
          }

          const reward = Number(ethers.formatEther(onChainCourse.reward_amount))

          let status: "available" | "completed" | "claimable" = "available"
          if (hasCompleted && hasClaimed) {
            status = "completed"
          } else if (hasCompleted && !hasClaimed) {
            status = "claimable"
          }

          const staticCourse = coursesData.find((c) => c.id === courseId)

          return {
            id: courseId,
            reward,
            isCreated: true,
            hasCompleted,
            hasClaimed,
            status,
            title: staticCourse ? staticCourse.title : `Course #${courseId}`,
          }
        } catch (err) {
          console.error(`Failed to fetch on-chain data for course ${courseId}:`, err)
          return null
        }
      })

      const allCourses = (await Promise.all(coursePromises)).filter((c): c is OnChainCourse => c !== null)
      setOnChainCourses(allCourses)
    } catch (err: any) {
      console.error("Failed to fetch course data:", err)
      setError(err.message || "An unknown error occurred.")
    } finally {
      setIsLoading(false)
    }
  }, [provider, account])

  useEffect(() => {
    fetchCourseData()
  }, [fetchCourseData])

  return { courses: onChainCourses, isLoading, error, refetch: fetchCourseData }
}
