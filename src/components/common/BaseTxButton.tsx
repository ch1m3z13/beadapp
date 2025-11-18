'use client';

import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

interface BaseTxButtonProps {
  project: string;
}

const BaseTxButton: React.FC<BaseTxButtonProps> = ({ project }) => {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, isError, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const [autoAddEnabled, setAutoAddEnabled] = useState(true);

  // Simple contract address for tracking (replace with your actual contract)
  const TRACKING_CONTRACT = '' + process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xe620d6855b97c357c316b1c43e1bd805dbf7660e';

  const handleTrackOnChain = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      // Example: Call a simple contract function or send a minimal transaction
      // This is a placeholder - replace with your actual contract interaction
      writeContract({
        address: TRACKING_CONTRACT as `0x${string}`,
        abi: [
          {
            name: 'trackProject',
            type: 'function',
            stateMutability: 'payable',
            inputs: [{ name: 'projectName', type: 'string' }],
            outputs: [],
          },
        ],
        functionName: 'trackProject',
        args: [project],
        value: parseEther('0.0001'), // Small amount for gas
      });

      // If auto-add is enabled, add to watchlist after successful tx
      if (autoAddEnabled && isSuccess) {
        // This would trigger the add to watchlist logic
        console.log('Auto-adding to watchlist:', project);
      }
    } catch (err) {
      console.error('Transaction error:', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Button */}
      <button
        onClick={handleTrackOnChain}
        disabled={!isConnected || isPending || isConfirming}
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-4 rounded-xl font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {!isConnected ? (
          '🔒 Connect Wallet First'
        ) : isPending ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Confirm in Wallet...
          </div>
        ) : isConfirming ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing Transaction...
          </div>
        ) : isSuccess ? (
          '✅ Tracked On-Chain!'
        ) : (
          '⛓️ Track on Base'
        )}
      </button>

      {/* Auto-add Toggle */}
      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
        <div>
          <p className="text-sm font-semibold text-foreground">Auto-add to Watchlist</p>
          <p className="text-xs text-muted-foreground">Automatically track after on-chain confirmation</p>
        </div>
        <button
          onClick={() => setAutoAddEnabled(!autoAddEnabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            autoAddEnabled ? 'bg-success' : 'bg-muted-foreground/30'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              autoAddEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Transaction Status */}
      {hash && (
        <div className="bg-muted rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">Transaction Hash:</p>
          <a
            href={`https://basescan.org/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline font-mono break-all"
          >
            {hash}
          </a>
        </div>
      )}

      {/* Success Message */}
      {isSuccess && (
        <div className="bg-success/10 border border-success rounded-lg p-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-success">Successfully Tracked!</p>
              <p className="text-xs text-muted-foreground">
                Your tracking activity has been recorded on Base blockchain
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {isError && (
        <div className="bg-error/10 border border-error rounded-lg p-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-error">Transaction Failed</p>
              <p className="text-xs text-muted-foreground">
                {error?.message || 'Please try again'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">About On-Chain Tracking</p>
            <p className="text-xs text-muted-foreground">
              This creates a permanent, verifiable record of your project research on the Base blockchain.
              A small gas fee (~$0.01) is required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseTxButton;