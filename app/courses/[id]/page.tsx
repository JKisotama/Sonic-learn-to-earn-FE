"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Clock,
  Users,
  Star,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Coins,
  Trophy,
  Loader2,
} from "lucide-react"
import { useCourses } from "@/hooks/use-courses"
import { useStudentFunctions } from "@/hooks/use-student-functions"
import { WalletConnection } from "@/components/wallet-connection"
import { useWeb3 } from "@/hooks/use-web3"

export default function CourseDetailPage() {
  const { id } = useParams()
  const courseId = Number(id)

  const { courses, isLoading: isLoadingCourses, error: coursesError, refetch } = useCourses()
  const { claimReward, isClaiming, transactionHash, error: claimError } = useStudentFunctions()
  const { isConnected } = useWeb3()

  const course = courses.find((c) => c.id === courseId)

  const handleClaimReward = async () => {
    if (!course) return
    try {
      await claimReward(course.id)
      // Refetch course data to update status after successful claim
      refetch()
    } catch (err) {
      console.error("Failed to claim reward:", err)
    }
  }

  if (isLoadingCourses) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (coursesError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{coursesError}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!course || !course.isCreated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-2">Course Not Found</h1>
        <p className="text-muted-foreground mb-4">
          This course does not exist or has not been activated by the admin yet.
        </p>
        <Link href="/courses">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/courses" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course Catalog
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-3xl font-bold">{course.title}</CardTitle>
                  <Badge variant="outline" className="text-lg">
                    +{course.reward} SET
                  </Badge>
                </div>
                <CardDescription className="text-lg">{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-6 text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>
                      {course.enrolled}/{course.maxEnrollment} Enrolled
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    <span>{course.rating}</span>
                  </div>
                </div>
                <Separator className="my-6" />
                <div>
                  <h3 className="text-xl font-semibold mb-4">Course Content</h3>
                  <p className="text-muted-foreground">
                    (Placeholder for actual course content, videos, articles, etc.)
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor,
                    dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas
                    ligula massa, varius a, semper congue, euismod non, mi.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Status</CardTitle>
              </CardHeader>
              <CardContent>
                {!isConnected ? (
                  <div className="text-center">
                    <p className="mb-4 text-muted-foreground">Connect your wallet to interact with this course.</p>
                    <WalletConnection />
                  </div>
                ) : course.status === "claimable" ? (
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                      <Trophy className="h-6 w-6 mr-3 text-yellow-600" />
                      <div>
                        <h4 className="font-semibold">Congratulations!</h4>
                        <p className="text-sm text-muted-foreground">You have completed this course.</p>
                      </div>
                    </div>
                    <Button className="w-full" onClick={handleClaimReward} disabled={isClaiming}>
                      {isClaiming ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Claiming...
                        </>
                      ) : (
                        <>
                          <Coins className="h-4 w-4 mr-2" />
                          Claim {course.reward} SET Reward
                        </>
                      )}
                    </Button>
                  </div>
                ) : course.status === "completed" ? (
                  <div className="flex items-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-6 w-6 mr-3 text-green-600" />
                    <div>
                      <h4 className="font-semibold">Reward Claimed</h4>
                      <p className="text-sm text-muted-foreground">You have successfully claimed your reward.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <BookOpen className="h-6 w-6 mr-3 text-blue-600" />
                    <div>
                      <h4 className="font-semibold">In Progress</h4>
                      <p className="text-sm text-muted-foreground">
                        Complete the course and wait for admin approval.
                      </p>
                    </div>
                  </div>
                )}

                {claimError && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{claimError}</AlertDescription>
                  </Alert>
                )}
                {transactionHash && (
                  <Alert className="mt-4">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Transaction successful! Hash: {transactionHash.slice(0, 10)}...
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{course.instructor}</p>
                <p className="text-sm text-muted-foreground">Lead Blockchain Developer</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
