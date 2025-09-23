import { NextResponse } from "next/server"
import { getContractAddresses, getWalletConnectConfig } from "@/lib/server-config"

export async function GET() {
  try {
    const contractAddresses = getContractAddresses()
    const walletConnectConfig = getWalletConnectConfig()

    return NextResponse.json({
      contracts: contractAddresses,
      walletConnect: walletConnectConfig,
    })
  } catch (error) {
    console.error("Error fetching config:", error)
    return NextResponse.json({ error: "Failed to fetch configuration" }, { status: 500 })
  }
}
