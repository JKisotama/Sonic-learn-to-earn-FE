"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Users,
  Star,
  Search,
  GraduationCap,
  CheckCircle,
  Coins,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { useCourses, CombinedCourse } from "@/hooks/use-courses"
import { useStudentFunctions } from "@/hooks/use-student-functions"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [claimingId, setClaimingId] = useState<number | null>(null)

  const { courses, isLoading, error, refetch } = useCourses()
  const { claimReward, isClaiming } = useStudentFunctions()

  const categories = useMemo(() => ["all", ...Array.from(new Set(courses.map((c) => c.category)))], [courses])
  const difficulties = ["all", "Beginner", "Intermediate", "Advanced"]

  const filteredCourses = useMemo(
    () =>
      courses
        .filter((course) => course.isCreated) // Only show courses created by admin
        .filter((course) => {
          const matchesSearch =
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase())
          const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
          const matchesDifficulty = selectedDifficulty === "all" || course.difficulty === selectedDifficulty
          return matchesSearch && matchesCategory && matchesDifficulty
        }),
    [courses, searchTerm, selectedCategory, selectedDifficulty],
  )

  const getStatusIcon = (status: CombinedCourse["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "claimable":
        return <Coins className="h-4 w-4 text-yellow-500" />
      default:
        return <BookOpen className="h-4 w-4 text-primary" />
    }
  }

  const getStatusText = (status: CombinedCourse["status"]) => {
    switch (status) {
      case "completed":
        return "Reward Claimed"
      case "claimable":
        return "Claim Reward"
      default:
        return "View Course"
    }
  }

  const handleClaimReward = async (courseId: number) => {
    setClaimingId(courseId)
    try {
      await claimReward(courseId)
      refetch() // Refetch course data to update the status
    } catch (err) {
      console.error(`Failed to claim reward for course ${courseId}:`, err)
      // Error is already handled and displayed by the hook, but we can add more specific UI feedback here if needed
    } finally {
      setClaimingId(null)
    }
  }

  const getStatusVariant = (status: CombinedCourse["status"]) => {
    switch (status) {
      case "completed":
        return "secondary" as const
      case "claimable":
        return "default" as const
      default:
        return "outline" as const
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-white">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <span className="text-lg sm:text-xl font-semibold">
                <span className="hidden sm:inline">Sonic University</span>
                <span className="sm:hidden">Sonic</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Course Catalog</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Explore our comprehensive blockchain and Web3 courses. Earn SET tokens by completing modules and
              assessments.
            </p>
          </div>

          <div className="mb-6 sm:mb-8">
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex flex-col gap-4">
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
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full sm:w-40">
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
                      <SelectTrigger className="w-full sm:w-40">
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
                    <Button variant="outline" onClick={refetch} disabled={isLoading}>
                      <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                      <span className="ml-2 hidden sm:inline">Refresh</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p>Loading on-chain course data...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="course-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow card-interactive">
                    <div className="aspect-video bg-muted">
                      <img
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className="p-4 sm:p-6">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base sm:text-lg line-clamp-2">{course.title}</CardTitle>
                        <Badge variant="outline" className="shrink-0 text-xs">
                          +{course.reward} SET
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-3 text-sm">{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0">
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">{course.duration}</span>
                            <span className="sm:hidden">{course.duration.replace(" weeks", "w")}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">
                              {course.enrolled}/{course.maxEnrollment}
                            </span>
                            <span className="sm:hidden">{course.enrolled}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-current text-yellow-500" />
                            {course.rating}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm text-muted-foreground truncate">
                            by {course.instructor}
                          </span>
                          <Badge
                            variant={
                              course.difficulty === "Beginner"
                                ? "secondary"
                                : course.difficulty === "Intermediate"
                                  ? "default"
                                  : "destructive"
                            }
                            className="text-xs"
                          >
                            {course.difficulty}
                          </Badge>
                        </div>

                        {course.prerequisites && course.prerequisites.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            Prerequisites: {course.prerequisites.join(", ")}
                          </div>
                        )}

                        {course.status === "claimable" ? (
                          <Button
                            className="w-full"
                            variant={getStatusVariant(course.status)}
                            disabled={isClaiming && claimingId === course.id}
                            onClick={() => handleClaimReward(course.id)}
                          >
                            {isClaiming && claimingId === course.id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Claiming...
                              </>
                            ) : (
                              <div className="flex items-center gap-2">
                                {getStatusIcon(course.status)}
                                <span className="text-sm">{getStatusText(course.status)}</span>
                              </div>
                            )}
                          </Button>
                        ) : (
                          <Link href={`/courses/${course.id}`} className="w-full">
                            <Button className="w-full" variant={getStatusVariant(course.status)}>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(course.status)}
                                <span className="text-sm">{getStatusText(course.status)}</span>
                              </div>
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredCourses.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-medium text-foreground mb-2">No Active Courses Found</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    The admin may not have added any courses to the smart contract yet, or your filters match no
                    courses.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
