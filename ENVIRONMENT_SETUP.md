# Environment Variables Setup

This Learn-to-Earn DApp requires specific environment variables to function properly. Here's how to set them up:

## Required Environment Variables

### 1. Smart Contract Addresses (Required)
These are now server-side only for security:

\`\`\`env
LEARN_TO_EARN_CONTRACT=0x1234567890123456789012345678901234567890
SUT_TOKEN_CONTRACT=0x0987654321098765432109876543210987654321
\`\`\`

**Note:** These do NOT have the `NEXT_PUBLIC_` prefix anymore for security.

### 2. WalletConnect Project ID (Optional)
Server-side only:

\`\`\`env
WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
\`\`\`

## Setting Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables" in the sidebar
4. Add each variable with its name and value (without NEXT_PUBLIC_ prefix)
5. Make sure to select the appropriate environments (Production, Preview, Development)

## Local Development

For local development, create a `.env.local` file in your project root:

\`\`\`env
LEARN_TO_EARN_CONTRACT=0x1234567890123456789012345678901234567890
SUT_TOKEN_CONTRACT=0x0987654321098765432109876543210987654321
WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
\`\`\`

## Security Improvements

- Contract addresses are now fetched from server-side API routes
- No sensitive information is exposed to the client
- Configuration is loaded dynamically when the app starts

## API Endpoint

The app now uses `/api/config` to fetch contract addresses and configuration securely from the server.
