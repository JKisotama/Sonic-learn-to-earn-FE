import { createConfig, http } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"
import { getDefaultConfig } from "connectkit"

export const config = createConfig(
  getDefaultConfig({
    chains: [sepolia, mainnet],
    transports: {
      // RPC URL for each chain
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },

    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",

    // Required App Info
    appName: "Sonic University - Learn to Earn",
    appDescription: "Complete blockchain courses and earn SET tokens for your achievements",
    appUrl: "https://learn-to-earn.vercel.app",
    appIcon: "https://learn-to-earn.vercel.app/favicon.ico",
  }),
)
