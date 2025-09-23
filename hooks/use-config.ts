"use client"

import { useState, useEffect } from "react"

interface ContractConfig {
  LEARN_TO_EARN: string
  SUT_TOKEN: string
}

interface WalletConnectConfig {
  projectId: string
}

interface AppConfig {
  contracts: ContractConfig
  walletConnect: WalletConnectConfig
}

export function useConfig() {
  const [config, setConfig] = useState<AppConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/config")
        if (!response.ok) {
          throw new Error("Failed to fetch configuration")
        }
        const data = await response.json()
        setConfig(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setIsLoading(false)
      }
    }

    fetchConfig()
  }, [])

  return { config, isLoading, error }
}
