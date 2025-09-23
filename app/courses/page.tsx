"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, BookOpen, Clock, Users, Star, Search, GraduationCap, Play, CheckCircle, Lock } from "lucide-react"

interface Course {
  id: number
  title: string
  description: string
  instructor: string
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  category: string
  reward: number
  enrolled: number
  maxEnrollment: number
  rating: number
  status: "available" | "enrolled" | "completed" | "locked"
  prerequisites?: string[]
  image: string
}

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")

  const courses: Course[] = [
    {
      id: 1,
      title: "Introduction to Blockchain",
      description:
        "Learn the fundamentals of blockchain technology, including how it works, its applications, and its potential impact on various industries.",
      instructor: "Dr. Sarah Chen",
      duration: "4 weeks",
      difficulty: "Beginner",
      category: "Blockchain",
      reward: 100,
      enrolled: 1247,
      maxEnrollment: 2000,
      rating: 4.8,
      status: "completed",
      image: "/blockchain-network.png",
    },
    {
      id: 2,
      title: "Smart Contract Development",
      description:
        "Master the art of writing secure and efficient smart contracts using Solidity. Build real-world DApps and understand best practices.",
      instructor: "Prof. Michael Rodriguez",
      duration: "6 weeks",
      difficulty: "Intermediate",
      category: "Development",
      reward: 200,
      enrolled: 892,
      maxEnrollment: 1500,
      rating: 4.9,
      status: "enrolled",
      prerequisites: ["Introduction to Blockchain"],
      image: "/smart-contracts-coding.jpg",
    },
    {
      id: 3,
      title: "DeFi Protocol Design",
      description:
        "Explore decentralized finance protocols, yield farming, liquidity pools, and advanced DeFi mechanisms.",
      instructor: "Dr. Emily Watson",
      duration: "8 weeks",
      difficulty: "Advanced",
      category: "DeFi",
      reward: 300,
      enrolled: 456,
      maxEnrollment: 800,
      rating: 4.7,
      status: "locked",
      prerequisites: ["Smart Contract Development", "Financial Markets"],
      image: "/defi-protocol-design.jpg",
    },
    {
      id: 4,
      title: "NFT Creation and Marketplace",
      description:
        "Learn how to create, mint, and trade NFTs. Build your own NFT marketplace and understand the digital art economy.",
      instructor: "Alex Thompson",
      duration: "5 weeks",
      difficulty: "Intermediate",
      category: "NFT",
      reward: 175,
      enrolled: 634,
      maxEnrollment: 1200,
      rating: 4.6,
      status: "available",
      image: "/nft-digital-art.jpg",
    },
    {
      id: 5,
      title: "Web3 Frontend Development",
      description:
        "Build modern Web3 applications using React, ethers.js, and popular Web3 libraries. Connect to blockchain networks.",
      instructor: "Jordan Kim",
      duration: "7 weeks",
      difficulty: "Intermediate",
      category: "Development",
      reward: 225,
      enrolled: 789,
      maxEnrollment: 1000,
      rating: 4.8,
      status: "available",
      prerequisites: ["Introduction to Blockchain"],
      image: "/web3-frontend.png",
    },
    {
      id: 6,
      title: "Cryptocurrency Trading Fundamentals",
      description:
        "Understand market analysis, trading strategies, risk management, and the psychology of cryptocurrency trading.",
      instructor: "Maria Gonzalez",
      duration: "4 weeks",
      difficulty: "Beginner",
      category: "Trading",
      reward: 125,
      enrolled: 1156,
      maxEnrollment: 1800,
      rating: 4.5,
      status: "available",
      image: "/cryptocurrency-trading.png",
    },
  ]

  const categories = ["all", "Blockchain", "Development", "DeFi", "NFT", "Trading"]
  const difficulties = ["all", "Beginner", "Intermediate", "Advanced"]

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || course.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const getStatusIcon = (status: Course["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "enrolled":
        return <Play className="h-4 w-4 text-blue-600" />
      case "locked":
        return <Lock className="h-4 w-4 text-gray-400" />
      default:
        return <BookOpen className="h-4 w-4 text-primary" />
    }
  }

  const getStatusText = (status: Course["status"]) => {
    switch (status) {
      case "completed":
        return "Completed"
      case "enrolled":
        return "Continue Learning"
      case "locked":
        return "Prerequisites Required"
      default:
        return "Enroll Now"
    }
  }

  const getStatusVariant = (status: Course["status"]) => {
    switch (status) {
      case "completed":
        return "secondary" as const
      case "enrolled":
        return "default" as const
      case "locked":
        return "outline" as const
      default:
        return "default" as const
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
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
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Course Catalog</h1>
            <p className="text-muted-foreground">
              Explore our comprehensive blockchain and Web3 courses. Earn SET tokens by completing modules and
              assessments.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category === "all" ? "All Categories" : category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map((difficulty) => (
                          <SelectItem key={difficulty} value={difficulty}>
                            {difficulty === "all" ? "All Levels" : difficulty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                    <Badge variant="outline" className="shrink-0">
                      +{course.reward} SET
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-3">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Course Info */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {course.enrolled}/{course.maxEnrollment}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-current text-yellow-500" />
                        {course.rating}
                      </div>
                    </div>

                    {/* Instructor and Difficulty */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">by {course.instructor}</span>
                      <Badge
                        variant={
                          course.difficulty === "Beginner"
                            ? "secondary"
                            : course.difficulty === "Intermediate"
                              ? "default"
                              : "destructive"
                        }
                      >
                        {course.difficulty}
                      </Badge>
                    </div>

                    {/* Prerequisites */}
                    {course.prerequisites && course.prerequisites.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Prerequisites: {course.prerequisites.join(", ")}
                      </div>
                    )}

                    {/* Action Button */}
                    <Link href={`/courses/${course.id}`}>
                      <Button
                        className="w-full"
                        variant={getStatusVariant(course.status)}
                        disabled={course.status === "locked"}
                      >
                        <div className="flex items-center gap-2">
                          {getStatusIcon(course.status)}
                          {getStatusText(course.status)}
                        </div>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No courses found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or browse all available courses.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
