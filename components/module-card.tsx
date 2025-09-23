"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Coins, Lock, Loader2 } from "lucide-react"
import { useLearnToEarn } from "@/hooks/use-learn-to-earn"
import { useState } from "react"

interface Module {
  id: number
  title: string
  description: string
  reward: number
  completed: boolean
  claimed: boolean
  difficulty: string
}

interface ModuleCardProps {
  module: Module
  isConnected: boolean
  userAddress: string
  onRewardClaimed?: () => void
}

export function ModuleCard({ module, isConnected, userAddress, onRewardClaimed }: ModuleCardProps) {
  const { claimReward, isClaimingReward, error } = useLearnToEarn()
  const [localClaimed, setLocalClaimed] = useState(module.claimed)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleClaimReward = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first")
      return
    }

    try {
      const txHash = await claimReward(module.id)
      setLocalClaimed(true)
      setIsSuccess(true)
      onRewardClaimed?.()

      // Show success message
      alert(`Successfully claimed ${module.reward} SUT tokens! Transaction: ${txHash}`)
    } catch (err: any) {
      console.error("Failed to claim reward:", err)
      alert(`Failed to claim reward: ${err.message}`)
    }
  }

  const getStatusIcon = () => {
    if (localClaimed || isSuccess) {
      return <CheckCircle className="h-5 w-5 text-success" />
    } else if (module.completed) {
      return <Coins className="h-5 w-5 text-primary" />
    } else {
      return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusText = () => {
    if (localClaimed || isSuccess) return "Reward Claimed"
    if (module.completed) return "Ready to Claim"
    return "In Progress"
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-success/10 text-success border-success/20"
      case "intermediate":
        return "bg-warning/10 text-warning border-warning/20"
      case "advanced":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const showClaimButton = module.completed && !localClaimed && !isSuccess

  return (
    <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{module.title}</CardTitle>
              {getStatusIcon()}
            </div>
            <CardDescription className="text-sm">{module.description}</CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Badge variant="outline" className={getDifficultyColor(module.difficulty)}>
            {module.difficulty}
          </Badge>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            {module.reward} SUT
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </div>

          {showClaimButton ? (
            <Button
              onClick={handleClaimReward}
              disabled={!isConnected || isClaimingReward}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isClaimingReward ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Claiming...
                </>
              ) : !isConnected ? (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Connect Wallet
                </>
              ) : (
                <>
                  <Coins className="h-4 w-4 mr-2" />
                  Claim {module.reward} SUT
                </>
              )}
            </Button>
          ) : localClaimed || isSuccess ? (
            <Button disabled variant="outline">
              <CheckCircle className="h-4 w-4 mr-2" />
              Claimed
            </Button>
          ) : (
            <Button disabled variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Complete Module
            </Button>
          )}
        </div>

        {error && <div className="mt-2 text-sm text-destructive">Error: {error}</div>}
      </CardContent>
    </Card>
  )
}
