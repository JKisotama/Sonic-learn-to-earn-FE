"use client"

import type React from "react"

import { useState } from "react"
import { useAccount } from "wagmi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAdminFunctions } from "@/hooks/use-admin-functions"
import { WalletConnection } from "@/components/wallet-connection"
import { AlertCircle, Plus, CheckCircle, Coins, Shield } from "lucide-react"

export default function AdminPage() {
  const { address, isConnected } = useAccount()
  const {
    addCourse,
    markCompletion,
    isOwner,
    isLoading: isCheckingOwner,
    error,
    isAddingCourse,
    isMarkingComplete,
    transactionHash,
  } = useAdminFunctions()

  const [courseId, setCourseId] = useState("")
  const [rewardAmount, setRewardAmount] = useState("")
  const [studentAddress, setStudentAddress] = useState("")
  const [completionCourseId, setCompletionCourseId] = useState("")

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!courseId || !rewardAmount) return

    try {
      await addCourse(Number.parseInt(courseId), rewardAmount)
      setCourseId("")
      setRewardAmount("")
    } catch (err) {
      console.error("Failed to add course:", err)
    }
  }

  const handleMarkCompletion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentAddress || !completionCourseId) return

    try {
      await markCompletion(studentAddress, Number.parseInt(completionCourseId))
      setStudentAddress("")
      setCompletionCourseId("")
    } catch (err) {
      console.error("Failed to mark completion:", err)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
            <p className="text-muted-foreground mb-8">Connect your wallet to access admin functions</p>
            <WalletConnection />
          </div>
        </div>
      </div>
    )
  }

  if (isCheckingOwner) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p>Checking admin permissions...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
            <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-4">You don't have admin permissions for this contract.</p>
            <Badge variant="outline" className="mb-4">
              Connected: {address}
            </Badge>
            <p className="text-sm text-muted-foreground mb-4">Only the contract owner can access admin functions.</p>
            <div className="text-left bg-muted p-4 rounded-lg text-sm">
              <p className="font-medium mb-2">Debug Information:</p>
              <p>Contract Address: 0x77a18B3CaFe43f3FfF0a64599Cb642CC518bc90f</p>
              <p>Network: Sepolia Testnet (Chain ID: 11155111)</p>
              <p className="text-xs mt-2 text-muted-foreground">
                Check the browser console for detailed ownership verification logs.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <Badge variant="secondary" className="ml-auto">
                Owner Access
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Manage courses and student completions for the Learn-to-Earn platform
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {transactionHash && (
            <Alert className="mb-6">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Transaction successful! Hash: {transactionHash.slice(0, 10)}...</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Add Course Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Course
                </CardTitle>
                <CardDescription>Create a new course with SET token rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddCourse} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="courseId">Course ID</Label>
                    <Input
                      id="courseId"
                      type="number"
                      placeholder="Enter course ID (e.g., 1)"
                      value={courseId}
                      onChange={(e) => setCourseId(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rewardAmount">Reward Amount (SET)</Label>
                    <Input
                      id="rewardAmount"
                      type="number"
                      step="0.01"
                      placeholder="Enter reward amount (e.g., 100)"
                      value={rewardAmount}
                      onChange={(e) => setRewardAmount(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isAddingCourse || !courseId || !rewardAmount}>
                    {isAddingCourse ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Adding Course...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Course
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Mark Completion Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Mark Student Complete
                </CardTitle>
                <CardDescription>Mark a student as having completed a course</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleMarkCompletion} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentAddress">Student Wallet Address</Label>
                    <Input
                      id="studentAddress"
                      type="text"
                      placeholder="0x..."
                      value={studentAddress}
                      onChange={(e) => setStudentAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="completionCourseId">Course ID</Label>
                    <Input
                      id="completionCourseId"
                      type="number"
                      placeholder="Enter course ID"
                      value={completionCourseId}
                      onChange={(e) => setCompletionCourseId(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isMarkingComplete || !studentAddress || !completionCourseId}
                  >
                    {isMarkingComplete ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Marking Complete...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Complete
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-8" />

          {/* Info Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5" />
                Admin Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium">Connected Wallet</Label>
                  <p className="text-sm text-muted-foreground font-mono">{address}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Network</Label>
                  <p className="text-sm text-muted-foreground">Sepolia Testnet</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Available Functions:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Add new courses with SET token rewards</li>
                  <li>• Mark students as having completed courses</li>
                  <li>• Students can then claim their SET token rewards</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
