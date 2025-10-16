import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '../components/providers'
import { Analytics } from '@vercel/analytics/next'
import { MiniAppProvider } from '@neynar/react';


export const metadata: Metadata = {
  title: 'Web3 Wingman MVP',
  description: 'Track Web3 projects via X & post on Farcaster',
  openGraph: {
    images: ['/icon.png'],  
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
    'fc:frame:image': '/hero.png',
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
      <head>
        <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
        />
      </head>
      <body suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}