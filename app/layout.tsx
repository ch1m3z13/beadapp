import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '../components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Web3 Wingman MVP',
  description: 'Track Web3 projects via X & post on Farcaster',
  openGraph: {
    images: ['/og-image.png'],  
    locale: 'en_US',
    type: 'website',
  },
  other: {

    'fc:frame': 'vNext',
    'fc:frame:button:1': 'Get Update',
    'fc:frame:button:2': 'Gen Post Idea',
    'fc:frame:button:3': 'Track on Base',
    'fc:frame:input:text': 'Enter project handle (e.g., @MorphLayer)',
    'fc:frame:input:required': 'true',

  'fc:frame:post-url': 'https://bead-mvp.vercel.app/frame',
  'fc:frame:post-button-text': 'Cast Update',

    'fc:frame:image': '/og-image.png',
    'fc:frame:state-hash': 'web3-wingman-v1',  
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}