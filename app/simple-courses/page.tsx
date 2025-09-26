"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useOnChainCourses } from "@/hooks/use-on-chain-courses"
import { useStudentFunctions } from "@/hooks/use-student-functions"
import { WalletConnection } from "@/components/wallet-connection"
import { useWeb3 } from "@/hooks/use-web3"
import { Loader2, RefreshCw, AlertCircle, Coins, CheckCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function SimpleCoursesPage() {
  const { courses, isLoading, error, refetch } = useOnChainCourses()
  const { claimReward, isClaiming, error: claimError } = useStudentFunctions()
  const { isConnected } = useWeb3()
  const [claimingId, setClaimingId] = useState<number | null>(null)

  const handleClaimReward = async (courseId: number) => {
    setClaimingId(courseId)
    try {
      await claimReward(courseId)
      refetch()
    } catch (err) {
      console.error(`Failed to claim reward for course ${courseId}:`, err)
    } finally {
      setClaimingId(null)
    }
  }

  const getStatusBadge = (status: "available" | "completed" | "claimable") => {
    switch (status) {
      case "completed":
        return <Badge variant="secondary">Claimed</Badge>
      case "claimable":
        return <Badge variant="default">Ready to Claim</Badge>
      default:
        return <Badge variant="outline">Available</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>On-Chain Courses</CardTitle>
              <CardDescription>A simple list of all courses active on the blockchain.</CardDescription>
            </div>
            <Button variant="outline" onClick={refetch} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              <span className="ml-2 hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <div className="text-center py-12">
              <p className="mb-4 text-muted-foreground">Connect your wallet to see course status and claim rewards.</p>
              <WalletConnection />
            </div>
          ) : isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div>
              {/* Header Row */}
              <div className="flex items-center p-4 font-medium text-muted-foreground bg-muted rounded-t-lg">
                <div className="w-1/6">ID</div>
                <div className="w-2/6">Title</div>
                <div className="w-1/6">Reward (SET)</div>
                <div className="w-1/6">Your Status</div>
                <div className="w-1/6 text-right">Action</div>
              </div>
              <Separator />
              {/* Data Rows */}
              {courses.length > 0 ? (
                courses.map((course) => (
                  <div key={course.id} className="flex items-center p-4 border-b">
                    <div className="w-1/6 font-mono text-sm">{course.id}</div>
                    <div className="w-2/6 font-medium">{course.title}</div>
                    <div className="w-1/6">{course.reward}</div>
                    <div className="w-1/6">{getStatusBadge(course.status)}</div>
                    <div className="w-1/6 text-right">
                      {course.status === "claimable" ? (
                        <Button
                          size="sm"
                          onClick={() => handleClaimReward(course.id)}
                          disabled={isClaiming && claimingId === course.id}
                        >
                          {isClaiming && claimingId === course.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Coins className="h-4 w-4" />
                          )}
                          <span className="ml-2">Claim</span>
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          <CheckCircle className="h-4 w-4" />
                          <span className="ml-2">
                            {course.status === "completed" ? "Claimed" : "Unavailable"}
                          </span>
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center h-24 p-4">No active courses found on the blockchain.</div>
              )}
            </div>
          )}
          {claimError && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{claimError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
