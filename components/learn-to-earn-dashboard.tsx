"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletConnection } from "@/components/wallet-connection"
import { ModuleCard } from "@/components/module-card"
import { GraduationCap, Trophy, Coins, BookOpen, User, ArrowRight } from "lucide-react"
import { useAccount } from "wagmi"
import Link from "next/link"

const mockModules = [
  {
    id: 1,
    title: "Blockchain Fundamentals",
    description: "Learn the basics of blockchain technology and decentralized systems",
    reward: 100,
    completed: true,
    claimed: false,
    difficulty: "Beginner",
  },
  {
    id: 2,
    title: "Smart Contract Development",
    description: "Build and deploy your first smart contracts on Ethereum",
    reward: 250,
    completed: true,
    claimed: true,
    difficulty: "Intermediate",
  },
  {
    id: 3,
    title: "DeFi Protocols",
    description: "Understand decentralized finance and yield farming strategies",
    reward: 200,
    completed: false,
    claimed: false,
    difficulty: "Advanced",
  },
  {
    id: 4,
    title: "NFT Marketplace Creation",
    description: "Create your own NFT marketplace with minting capabilities",
    reward: 300,
    completed: false,
    claimed: false,
    difficulty: "Advanced",
  },
]

export function LearnToEarnDashboard() {
  const { address, isConnected } = useAccount()
  const [modules, setModules] = useState(mockModules)
  const [tokenBalance, setTokenBalance] = useState(0)

  const totalEarned = modules.filter((module) => module.claimed).reduce((sum, module) => sum + module.reward, 0)
  const availableRewards = modules
    .filter((module) => module.completed && !module.claimed)
    .reduce((sum, module) => sum + module.reward, 0)

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 py-16 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="p-3 rounded-full bg-primary/10">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <span className="text-2xl font-semibold text-foreground">Sonic University</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
              Learn Blockchain Technology,
              <br />
              Earn SET Tokens
            </h1>

            <p className="text-lg text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              Complete course modules, master blockchain development, and earn SonicEduToken (SET) rewards for your
              achievements.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!isConnected && <WalletConnection />}
              <Link href="/courses">
                <Button variant="outline" size="lg">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Courses
                </Button>
              </Link>
              {!isConnected && (
                <Link href="/register">
                  <Button size="lg">
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              )}
            </div>

            {isConnected && (
              <div className="mt-12 max-w-md mx-auto">
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-foreground">Your Progress</h3>
                      <Link href="/profile">
                        <Button variant="ghost" size="sm">
                          <User className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-foreground">{totalEarned}</div>
                        <div className="text-sm text-muted-foreground">SET Earned</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">
                          {modules.filter((m) => m.completed).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Completed</div>
                      </div>
                    </div>

                    {availableRewards > 0 && (
                      <div className="mt-4 p-3 bg-success/10 rounded-lg border border-success/20">
                        <div className="flex items-center gap-2 justify-center">
                          <Coins className="h-4 w-4 text-success" />
                          <span className="text-sm font-medium text-success">
                            {availableRewards} SET ready to claim
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalEarned} SET</div>
                <p className="text-xs text-muted-foreground">
                  From {modules.filter((m) => m.claimed).length} completed modules
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Rewards</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{availableRewards} SET</div>
                <p className="text-xs text-muted-foreground">Ready to claim</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Progress</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {modules.filter((m) => m.completed).length}/{modules.length}
                </div>
                <p className="text-xs text-muted-foreground">Modules completed</p>
              </CardContent>
            </Card>
          </div>

          {/* Course Modules */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Featured Modules</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                Complete modules to earn SET tokens and advance your blockchain knowledge
              </p>
              <Link href="/courses">
                <Button variant="outline">
                  View All Courses
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  isConnected={isConnected}
                  userAddress={address || ""}
                  onRewardClaimed={() => {}}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
