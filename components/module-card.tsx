"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Coins, Loader2, Wallet } from "lucide-react"
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
      alert("Please connect your wallet first to claim SET tokens")
      return
    }

    try {
      console.log("[v0] Starting SET token claim for module:", module.id)
      const txHash = await claimReward(module.id)
      console.log("[v0] SET token claim successful:", txHash)

      setLocalClaimed(true)
      setIsSuccess(true)
      onRewardClaimed?.()

      // Show success message
      alert(`🎉 Successfully claimed ${module.reward} SET tokens! Transaction: ${txHash}`)
    } catch (err: any) {
      console.error("[v0] Failed to claim SET tokens:", err)
      alert(`❌ Failed to claim SET tokens: ${err.message}`)
    }
  }

  const getStatusIcon = () => {
    if (localClaimed || isSuccess) {
      return <CheckCircle className="h-5 w-5 text-success" />
    } else if (module.completed) {
      return <Coins className="h-5 w-5 text-primary animate-pulse" />
    } else {
      return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusText = () => {
    if (localClaimed || isSuccess) return "SET Tokens Claimed"
    if (module.completed) return "Ready to Claim SET"
    return "Complete to Earn SET"
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
    <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-lg border-l-4 border-l-primary/20">
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
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-semibold">
            <Coins className="h-3 w-3 mr-1" />
            {module.reward} SET
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {getStatusIcon()}
            <span className="font-medium">{getStatusText()}</span>
          </div>

          {showClaimButton ? (
            <Button
              onClick={handleClaimReward}
              disabled={!isConnected || isClaimingReward}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all"
            >
              {isClaimingReward ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Claiming SET...
                </>
              ) : !isConnected ? (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect to Claim
                </>
              ) : (
                <>
                  <Coins className="h-4 w-4 mr-2" />
                  Claim {module.reward} SET
                </>
              )}
            </Button>
          ) : localClaimed || isSuccess ? (
            <Button disabled variant="outline" className="bg-success/10 text-success border-success/20">
              <CheckCircle className="h-4 w-4 mr-2" />
              SET Claimed
            </Button>
          ) : (
            <Button disabled variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Complete Module
            </Button>
          )}
        </div>

        {error && (
          <div className="mt-3 p-2 rounded-md bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive font-medium">SET Claim Error:</p>
            <p className="text-xs text-destructive/80">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
