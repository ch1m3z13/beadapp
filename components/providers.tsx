'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { farcasterFrame, farcasterMiniApp } from '@farcaster/frame-wagmi-connector'
import { metaMask, injected, walletConnect } from 'wagmi/connectors'
import { useState, useEffect } from 'react'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id'


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, 
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {

    const wagmiConfig = createConfig({
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
    
    setConfig(wagmiConfig)
    setMounted(true)
  }, [])


  if (!mounted || !config) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-400">Loading Web3 Wingman...</p>
        </div>
      </div>
    )
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}