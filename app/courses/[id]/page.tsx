"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Users,
  Star,
  Play,
  CheckCircle,
  Lock,
  Award,
  GraduationCap,
  FileText,
  Video,
  Loader2,
} from "lucide-react"
import { useWeb3 } from "@/hooks/use-web3"
import { useLearnToEarn, useModuleStatus } from "@/hooks/use-learn-to-earn"
import { Toaster, toast } from "sonner"

interface Module {
  id: number
  title: string
  description: string
  duration: string
  type: "video" | "reading" | "quiz" | "assignment"
  // `completed` and `locked` will now be determined by blockchain state
  locked: boolean
}

// Mock course data - in a real app, this would be fetched based on params.id
const course = {
  id: 1, // Assuming a static ID for now
  title: "Smart Contract Development",
  description:
    "Master the art of writing secure and efficient smart contracts using Solidity. Build real-world DApps and understand best practices for blockchain development.",
  instructor: "Prof. Michael Rodriguez",
  duration: "6 weeks",
  difficulty: "Intermediate",
  category: "Development",
  reward: 200,
  enrolled: 892,
  maxEnrollment: 1500,
  rating: 4.9,
  totalRatings: 234,
  prerequisites: ["Introduction to Blockchain"],
  learningOutcomes: [
    "Write secure smart contracts in Solidity",
    "Deploy contracts to Ethereum testnet and mainnet",
    "Implement common DeFi patterns and protocols",
    "Test and debug smart contracts effectively",
    "Understand gas optimization techniques",
  ],
  image: "/smart-contracts-development.jpg",
}

const modules: Module[] = [
  {
    id: 1,
    title: "Introduction to Solidity",
    description: "Learn the basics of Solidity programming language and development environment setup.",
    duration: "45 min",
    type: "video",
    locked: false,
  },
  {
    id: 2,
    title: "Smart Contract Structure",
    description: "Understand the anatomy of smart contracts, state variables, and functions.",
    duration: "30 min",
    type: "reading",
    locked: false,
  },
  {
    id: 3,
    title: "Data Types and Variables",
    description: "Explore Solidity data types, mappings, arrays, and storage vs memory.",
    duration: "60 min",
    type: "video",
    locked: false,
  },
  {
    id: 4,
    title: "Functions and Modifiers",
    description: "Learn about function visibility, modifiers, and access control patterns.",
    duration: "50 min",
    type: "video",
    locked: false,
  },
  {
    id: 5,
    title: "Quiz: Solidity Basics",
    description: "Test your understanding of basic Solidity concepts.",
    duration: "20 min",
    type: "quiz",
    locked: true,
  },
  {
    id: 6,
    title: "Building Your First DApp",
    description: "Create a complete decentralized application from scratch.",
    duration: "90 min",
    type: "assignment",
    locked: true,
  },
]

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const [enrollmentStatus, setEnrollmentStatus] = useState<"not_enrolled" | "enrolled" | "completed">("not_enrolled")
  const [claimingModuleId, setClaimingModuleId] = useState<number | null>(null)

  const { account: userAddress } = useWeb3()
  const { claimReward, isClaimingReward, error: claimError } = useLearnToEarn()
  const moduleIds = modules.map((m) => m.id)
  const { moduleStatus, isLoading: isLoadingStatus } = useModuleStatus(userAddress || "", moduleIds)

  const completedModulesCount = moduleStatus?.completed.filter(Boolean).length || 0
  const progressPercentage = (completedModulesCount / modules.length) * 100

  useEffect(() => {
    if (claimError) {
      toast.error(claimError)
    }
  }, [claimError])

  const handleEnrollment = () => {
    setEnrollmentStatus("enrolled")
  }

  const handleClaim = async (moduleId: number) => {
    if (!userAddress) {
      toast.error("Please connect your wallet to claim rewards.")
      return
    }
    setClaimingModuleId(moduleId)
    try {
      const txHash = await claimReward(moduleId)
      toast.success("Reward claimed successfully!", {
        description: `Transaction: ${txHash.slice(0, 10)}...${txHash.slice(-8)}`,
        action: {
          label: "View on Etherscan",
          onClick: () => window.open(`https://sepolia.etherscan.io/tx/${txHash}`, "_blank"),
        },
      })
    } catch (err) {
      // Error is already handled by the hook and displayed in a toast
    } finally {
      setClaimingModuleId(null)
    }
  }

  const getModuleIcon = (type: Module["type"]) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "reading":
        return <FileText className="h-4 w-4" />
      case "quiz":
        return <CheckCircle className="h-4 w-4" />
      case "assignment":
        return <Award className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const renderModuleStatus = (module: Module, index: number) => {
    if (isLoadingStatus) {
      return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    }

    const isCompleted = moduleStatus?.completed[index]
    const isClaimed = moduleStatus?.claimed[index]

    if (isCompleted) {
      if (isClaimed) {
        return (
          <Badge variant="secondary" className="cursor-default">
            <CheckCircle className="h-4 w-4 mr-1" />
            Claimed
          </Badge>
        )
      }
      return (
        <Button
          size="sm"
          onClick={() => handleClaim(module.id)}
          disabled={isClaimingReward && claimingModuleId === module.id}
        >
          {isClaimingReward && claimingModuleId === module.id ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Award className="h-4 w-4 mr-2" />
          )}
          Claim Reward
        </Button>
      )
    }

    if (module.locked) {
      return <Lock className="h-5 w-5 text-gray-400" />
    }

    return (
      <Button size="sm" variant="outline">
        Start
      </Button>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" richColors />
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/courses" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Courses
            </Link>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold">Sonic University</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Course Header */}
          <div className="mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{course.category}</Badge>
                        <Badge variant={course.difficulty === "Beginner" ? "secondary" : "default"}>
                          {course.difficulty}
                        </Badge>
                      </div>
                      <h1 className="text-3xl font-bold text-foreground mb-2">{course.title}</h1>
                      <p className="text-muted-foreground mb-4">{course.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {course.enrolled} enrolled
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-current text-yellow-500" />
                        {course.rating} ({course.totalRatings} reviews)
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Instructor: <span className="font-medium text-foreground">{course.instructor}</span>
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <div className="aspect-video bg-muted rounded-lg mb-4">
                      <img
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {enrollmentStatus === "not_enrolled" ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary mb-1">+{course.reward} SET</div>
                          <div className="text-sm text-muted-foreground">Reward for completion</div>
                        </div>
                        <Button onClick={handleEnrollment} className="w-full" size="lg">
                          Enroll Now
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{Math.round(progressPercentage)}%</span>
                          </div>
                          <Progress value={progressPercentage} />
                        </div>
                        <Button className="w-full" size="lg">
                          <Play className="h-4 w-4 mr-2" />
                          Continue Learning
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What You'll Learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {course.learningOutcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <span className="text-sm">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Prerequisites</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {course.prerequisites.length > 0 ? (
                      <ul className="space-y-2">
                        {course.prerequisites.map((prereq, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                            <span className="text-sm">{prereq}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No prerequisites required</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="curriculum" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Modules</CardTitle>
                  <CardDescription>
                    {modules.length} modules • {completedModulesCount} completed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {modules.map((module, index) => (
                      <div
                        key={module.id}
                        className={`flex items-center gap-4 p-4 border border-border rounded-lg ${
                          module.locked && !moduleStatus?.completed[index] ? "opacity-50" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="text-primary">{getModuleIcon(module.type)}</div>
                        </div>

                        <div className="flex-1">
                          <div className="font-medium">{module.title}</div>
                          <div className="text-sm text-muted-foreground">{module.description}</div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-sm text-muted-foreground">{module.duration}</div>
                          {renderModuleStatus(module, index)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="instructor" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About the Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <GraduationCap className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{course.instructor}</h3>
                      <p className="text-muted-foreground mb-4">
                        Professor of Computer Science and Blockchain Technology at Sonic University. Over 10 years of
                        experience in distributed systems and smart contract development.
                      </p>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <div>15 Courses</div>
                        <div>4.8 Rating</div>
                        <div>12,000+ Students</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Reviews</CardTitle>
                  <CardDescription>
                    {course.rating} out of 5 stars ({course.totalRatings} reviews)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Mock reviews */}
                    <div className="border-b border-border pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 fill-current text-yellow-500" />
                          ))}
                        </div>
                        <span className="font-medium">Sarah M.</span>
                        <span className="text-sm text-muted-foreground">2 weeks ago</span>
                      </div>
                      <p className="text-sm">
                        Excellent course! The instructor explains complex concepts clearly and the hands-on projects
                        really help solidify the learning.
                      </p>
                    </div>

                    <div className="border-b border-border pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${star <= 4 ? "fill-current text-yellow-500" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="font-medium">David L.</span>
                        <span className="text-sm text-muted-foreground">1 month ago</span>
                      </div>
                      <p className="text-sm">
                        Great practical examples and real-world applications. The SET token rewards are a nice bonus for
                        completing the modules.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
