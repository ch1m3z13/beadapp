'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { farcasterFrame, farcasterMiniApp } from '@farcaster/frame-wagmi-connector'
import { metaMask, injected, walletConnect } from 'wagmi/connectors' 

const queryClient = new QueryClient()

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id' 

const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [
    farcasterMiniApp(),
    metaMask(), 
    injected({ target: 'okxWallet' }),
    walletConnect({ projectId }),
  ],
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}