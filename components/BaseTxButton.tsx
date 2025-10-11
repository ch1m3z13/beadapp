'use client'
import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { base } from 'wagmi/chains'


const isValidAddress = (address: string): address is `0x${string}` => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

interface Props {
  project: string
}

export default function BaseTxButton({ project }: Props) {
  const { address, isConnected, isConnecting, connector } = useAccount()
  const [txHash, setTxHash] = useState<string | null>(null)
  const [connectError, setConnectError] = useState<string | null>(null)

  const { writeContract, data: hash, error } = useWriteContract()

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (hash && !txHash) setTxHash(hash as string) 
  }, [hash, txHash]) 

  const trackProject = async () => {
    if (!isConnected && connector) {
      try {
        await connector.connect({ chainId: base.id })
        setConnectError(null)
      } catch (e: any) {
        console.error('Wallet connect failed:', e.message)
        setConnectError('Failed to connect to wallet. Ensure it’s installed and on Base mainnet, or try again.')
        return
      }
    }
    if (!address) {
      setConnectError('No wallet address detected. Please connect a wallet.')
      return
    }
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xE620D6855B97C357C316b1c43E1BD805Dbf7660e'
    if (!isValidAddress(contractAddress)) {
      console.error('Invalid contract address:', contractAddress)
      setConnectError('Invalid contract address configured.')
      return
    }
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: [
        {
          name: 'trackProject',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [{ type: 'string', name: 'project' }],
          outputs: [],
        },
      ] as const,
      functionName: 'trackProject',
      args: [project],
      chain: base,
      account: address,
    })
  }

  
  useEffect(() => {
    if (isSuccess) setConnectError(null)
  }, [isSuccess])

  return (
    <div className="mt-4">
      <button
        onClick={trackProject}
        disabled={isLoading || isConnecting}
        className="w-full p-2 bg-purple-600 rounded text-sm md:text-base disabled:opacity-50"
      >
        {isConnecting ? 'Connecting...' : isLoading ? 'Tracking...' : isSuccess ? 'Tracked! Tx: ' + (txHash?.slice(0, 10) || '') + '...' : 'Track on Base'}
      </button>
      {connectError && <p className="text-red-400 mt-2 text-sm md:text-base">{connectError}</p>}
      {isSuccess && txHash && <p className="text-green-400 mt-2 text-sm md:text-base">Proof: {txHash}</p>}
    </div>
  )
}