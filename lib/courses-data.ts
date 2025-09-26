export interface Course {
  id: number
  title: string
  description: string
  instructor: string
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  category: string
  reward: number // This will be supplemented by on-chain data
  enrolled: number
  maxEnrollment: number
  rating: number
  status: "available" | "enrolled" | "completed" | "locked"
  prerequisites?: string[]
  image: string
}

export const coursesData: Omit<Course, "status" | "reward">[] = [
  {
    id: 1,
    title: "Introduction to Blockchain",
    description:
      "Learn the fundamentals of blockchain technology, including how it works, its applications, and its potential impact on various industries.",
    instructor: "Dr. Sarah Chen",
    duration: "4 weeks",
    difficulty: "Beginner",
    category: "Blockchain",
    enrolled: 1247,
    maxEnrollment: 2000,
    rating: 4.8,
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
    enrolled: 892,
    maxEnrollment: 1500,
    rating: 4.9,
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
    enrolled: 456,
    maxEnrollment: 800,
    rating: 4.7,
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
    enrolled: 634,
    maxEnrollment: 1200,
    rating: 4.6,
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
    enrolled: 789,
    maxEnrollment: 1000,
    rating: 4.8,
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
    enrolled: 1156,
    maxEnrollment: 1800,
    rating: 4.5,
    image: "/cryptocurrency-trading.png",
  },
]
