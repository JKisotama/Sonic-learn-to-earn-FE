"use client"

import type { ReactNode } from "react"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConnectKitProvider } from "connectkit"
import { config } from "@/lib/wagmi-config"

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          theme="minimal"
          mode="light"
          customTheme={{
            "--ck-font-family": "ui-sans-serif, system-ui, sans-serif",
            "--ck-border-radius": "6px",
            "--ck-primary-button-background": "rgb(102, 102, 102)",
            "--ck-primary-button-hover-background": "rgb(82, 82, 82)",
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
