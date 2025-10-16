import { MiniAppProvider } from '@neynar/react';

export default function Home() {
  return (
    <MiniAppProvider>
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold">Web3 Wingman MVP</h1>
        <p>Check /frame for the Farcaster Frame!</p>
      </main>
    </MiniAppProvider>
  )
}