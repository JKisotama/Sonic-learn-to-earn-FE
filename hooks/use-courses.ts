"use client"

import { useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"
import { useWeb3 } from "./use-web3"
import { getChainContracts } from "@/lib/web3-config"
import { coursesData, Course } from "@/lib/courses-data"

// Define the combined course type
export interface CombinedCourse extends Omit<Course, "status" | "reward"> {
  reward: number
  isCreated: boolean
  hasCompleted: boolean
  hasClaimed: boolean
  status: "available" | "completed" | "claimable"
}

export function useCourses() {
  const { provider, account } = useWeb3()
  const [combinedCourses, setCombinedCourses] = useState<CombinedCourse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCourseData = useCallback(async () => {
    if (!provider) {
      // If provider is not available, just show the static data without on-chain info
      const staticCourses = coursesData.map((course) => ({
        ...course,
        reward: 0,
        isCreated: false,
        hasCompleted: false,
        hasClaimed: false,
        status: "available" as const,
      }))
      setCombinedCourses(staticCourses)
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

      const coursePromises = coursesData.map(async (course) => {
        try {
          const onChainCourse = await contract.courses(course.id)
          const isCreated = onChainCourse.is_created

          let hasCompleted = false
          let hasClaimed = false

          if (isCreated && account) {
            hasCompleted = await contract.has_completed(account, course.id)
            hasClaimed = await contract.has_claimed_reward(account, course.id)
          }

          const reward = isCreated ? Number(ethers.formatEther(onChainCourse.reward_amount)) : 0

          let status: "available" | "completed" | "claimable" = "available"
          if (hasCompleted && hasClaimed) {
            status = "completed"
          } else if (hasCompleted && !hasClaimed) {
            status = "claimable"
          }

          return {
            ...course,
            reward,
            isCreated,
            hasCompleted,
            hasClaimed,
            status,
          }
        } catch (err) {
          console.error(`Failed to fetch on-chain data for course ${course.id}:`, err)
          // Return static data with defaults if on-chain call fails
          return {
            ...course,
            reward: 0,
            isCreated: false,
            hasCompleted: false,
            hasClaimed: false,
            status: "available" as const,
          }
        }
      })

      const allCourses = await Promise.all(coursePromises)
      setCombinedCourses(allCourses)
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

  return { courses: combinedCourses, isLoading, error, refetch: fetchCourseData }
}
