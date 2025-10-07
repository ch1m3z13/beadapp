'use client'
import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { base } from 'wagmi/chains' 

interface Props {
  project: string
}

export default function BaseTxButton({ project }: Props) {
  const { address, isConnected } = useAccount()
  const [txHash, setTxHash] = useState<string | null>(null)

  const { writeContract, data: hash } = useWriteContract()

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const trackProject = () => {
    if (!address) return
    writeContract({
  // use the Base chain object (Base chain id is 8453)
  chain: base,
      account: address,
      address: '0xE620D6855B97C357C316b1c43E1BD805Dbf7660e',  
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
    })
  }

  if (hash) setTxHash(hash as string)

  return (
    <div className="mt-4">
      <button
        onClick={trackProject}
        disabled={!isConnected || isLoading}
        className="w-full p-2 bg-purple-600 rounded disabled:opacity-50"
      >
        {isLoading ? 'Tracking...' : isSuccess ? 'Tracked! Tx: ' + txHash?.slice(0, 10) + '...' : 'Track on Base'}
      </button>
      {isSuccess && <p className="text-green-400 mt-2">Proof: {txHash}</p>}
    </div>
  )
}