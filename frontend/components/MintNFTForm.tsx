'use client'

import * as React from 'react'
import { useState } from 'react'
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { useDebounce } from '../hooks/useDebounce'

export function MintNFTForm() {
  const [tokenId, setTokenId] = React.useState('')
  const debouncedTokenId = useDebounce(tokenId, 500)

  const { config } = usePrepareContractWrite({
    address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
    abi: [
      {
        name: 'mint',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [{ internalType: 'uint32', name: 'tokenId', type: 'uint32' }],
        outputs: [],
      },
    ],
    functionName: 'mint',
    args: [parseInt(debouncedTokenId)],
    enabled: Boolean(debouncedTokenId),
  })
  const { data, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  return (
    <form
      className="flex flex-col space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        write?.()
      }}
    >
      <label for="tokenId" className="text-lg font-semibold text-gray-800">Token ID</label>
      <input
        id="tokenId"
        className="px-3 py-2 border border-gray-300 rounded"
        placeholder="420"
        onChange={(e) => setTokenId(e.target.value)}
        value={tokenId}
      />
      <button 
        className={`px-4 py-2 rounded text-white ${write && !isLoading ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`} 
        disabled={!write || isLoading}>
        {isLoading ? 'Minting...' : '日記を書く'}
      </button>
      {isSuccess && (
        <div className="text-green-500">
          Successfully minted your NFT!
          <div>
            <a className="text-blue-500 hover:underline" href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
          </div>
        </div>
      )}
    </form>
  )
}
