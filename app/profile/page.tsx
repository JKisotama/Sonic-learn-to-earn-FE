"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  ArrowLeft,
  User,
  Edit3,
  BookOpen,
  Trophy,
  Coins,
  GraduationCap,
  Calendar,
  Mail,
  School,
  Target,
  Award,
} from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: "Alex Johnson",
    email: "alex.johnson@university.edu",
    studentId: "SU2024001",
    institution: "Sonic University",
    major: "Computer Science",
    yearOfStudy: "Junior (3rd Year)",
    bio: "Passionate about blockchain technology and decentralized applications. Currently focusing on smart contract development and Web3 technologies.",
    interests: "Blockchain, AI, Web Development, Cybersecurity",
    joinDate: "September 2024",
  })

  // Mock data for learning progress
  const learningStats = {
    totalCourses: 12,
    completedCourses: 8,
    inProgressCourses: 3,
    totalSETTokens: 2450,
    currentStreak: 15,
    totalLearningHours: 127,
  }

  const completedCourses = [
    { id: 1, title: "Introduction to Blockchain", reward: 100, completedDate: "2024-01-15" },
    { id: 2, title: "Smart Contract Basics", reward: 150, completedDate: "2024-01-22" },
    { id: 3, title: "Web3 Development", reward: 200, completedDate: "2024-02-05" },
    { id: 4, title: "DeFi Fundamentals", reward: 175, completedDate: "2024-02-18" },
    { id: 5, title: "NFT Creation", reward: 125, completedDate: "2024-03-02" },
  ]

  const achievements = [
    { id: 1, title: "First Course Complete", description: "Completed your first course", icon: "🎯" },
    { id: 2, title: "Blockchain Explorer", description: "Completed 5 blockchain courses", icon: "⛓️" },
    { id: 3, title: "Learning Streak", description: "15 days learning streak", icon: "🔥" },
    { id: 4, title: "Token Collector", description: "Earned 2000+ SET tokens", icon: "💰" },
  ]

  const handleSaveProfile = () => {
    setIsEditing(false)
    // In a real app, this would save to backend
    console.log("Profile saved:", profileData)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
            >
              {isEditing ? (
                "Save Changes"
              ) : (
                <>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-foreground mb-2">{profileData.fullName}</h1>
                    <div className="flex flex-wrap gap-4 text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {profileData.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <School className="h-4 w-4" />
                        {profileData.institution}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Joined {profileData.joinDate}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{profileData.major}</Badge>
                      <Badge variant="secondary">{profileData.yearOfStudy}</Badge>
                      <Badge variant="outline">ID: {profileData.studentId}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{learningStats.totalSETTokens}</div>
                    <div className="text-sm text-muted-foreground">SET Tokens</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{learningStats.completedCourses}</div>
                    <div className="text-sm text-muted-foreground">Courses Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{learningStats.inProgressCourses}</div>
                    <div className="text-sm text-muted-foreground">In Progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{learningStats.currentStreak}</div>
                    <div className="text-sm text-muted-foreground">Day Streak</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Coins className="h-8 w-8 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{learningStats.totalLearningHours}</div>
                    <div className="text-sm text-muted-foreground">Learning Hours</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabbed Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Progress</CardTitle>
                    <CardDescription>Your overall course completion progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Course Completion</span>
                          <span>
                            {Math.round((learningStats.completedCourses / learningStats.totalCourses) * 100)}%
                          </span>
                        </div>
                        <Progress value={(learningStats.completedCourses / learningStats.totalCourses) * 100} />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {learningStats.completedCourses} of {learningStats.totalCourses} courses completed
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                    <CardDescription>Your learning profile and interests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={profileData.bio}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="interests">Interests</Label>
                          <Input
                            id="interests"
                            value={profileData.interests}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, interests: e.target.value }))}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm">{profileData.bio}</p>
                        <div>
                          <div className="text-sm font-medium mb-2">Interests</div>
                          <div className="flex flex-wrap gap-2">
                            {profileData.interests.split(", ").map((interest, index) => (
                              <Badge key={index} variant="outline">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="courses" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Completed Courses</CardTitle>
                  <CardDescription>Courses you've successfully completed and rewards earned</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {completedCourses.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{course.title}</div>
                            <div className="text-sm text-muted-foreground">
                              Completed on {new Date(course.completedDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">+{course.reward} SET</div>
                          <Badge variant="secondary">Completed</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Achievements</CardTitle>
                  <CardDescription>Milestones and badges you've earned</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <div className="font-medium">{achievement.title}</div>
                          <div className="text-sm text-muted-foreground">{achievement.description}</div>
                        </div>
                        <Award className="h-5 w-5 text-primary ml-auto" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Update your personal and academic information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={profileData.fullName}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, fullName: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="institution">Institution</Label>
                        <Input
                          id="institution"
                          value={profileData.institution}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, institution: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="major">Major</Label>
                        <Input
                          id="major"
                          value={profileData.major}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, major: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
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
