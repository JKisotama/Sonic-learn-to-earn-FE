// Server-side configuration - these values are not exposed to the client
export const getContractAddresses = () => {
  return {
    LEARN_TO_EARN: process.env.LEARN_TO_EARN_CONTRACT || "0x0000000000000000000000000000000000000000",
    SUT_TOKEN: process.env.SUT_TOKEN_CONTRACT || "0x0000000000000000000000000000000000000000",
  }
}

export const getWalletConnectConfig = () => {
  return {
    projectId: process.env.WALLETCONNECT_PROJECT_ID || "",
  }
}
