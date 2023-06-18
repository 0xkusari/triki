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
  const [word1, setWord1] = useState('Ethereum');
  const [word2, setWord2] = useState('公園');
  const [word3, setWord3] = useState('コメダ珈琲');
  const [generatedText, setGeneratedText] = useState('');

  const handleWord1Change = (e) => setWord1(e.target.value);
  const handleWord2Change = (e) => setWord2(e.target.value);
  const handleWord3Change = (e) => setWord3(e.target.value);

  const handleTextareaChange = (e) => setTextareaValue(e.target.value);
  
  const handleSubmit = async (e) => {
    console.log('OpenAIのAPIを呼び出す');
    e.preventDefault();
    //write?.();
    
    // OpenAIのAPIを呼び出す
    try {
      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          prompt: `「${word1}」「${word2}」「${word3}」の3つのキーワードを含む形で、3段落程度の短い日記の文章を作成してください。それぞれのキーワードについてなんのことかわかる場合はそれを加味した文章にしてほしいですし、知らないキーワードの場合は固有名詞だと思って扱ってください。`,
          model: 'text-davinci-003',
          max_tokens: 1000,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
          setGeneratedText(data.choices[0].text);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

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
      onSubmit={handleSubmit}
    >
      <label for="tokenId" className="text-lg font-semibold text-gray-800">Token ID</label>
      <input
        id="tokenId"
        className="px-3 py-2 border border-gray-300 rounded"
        placeholder="420"
        onChange={(e) => setTokenId(e.target.value)}
        value={tokenId}
      />
      <label for="word1" className="text-lg font-semibold text-gray-800">word 1</label>
      <input
        id="word1"
        className="px-3 py-2 border border-gray-300 rounded"
        placeholder="420"
        value={word1}
        onChange={handleWord1Change}
      />
      <label for="word2" className="text-lg font-semibold text-gray-800">word 2</label>
      <input
        id="word2"
        className="px-3 py-2 border border-gray-300 rounded"
        placeholder="420"
        value={word2}
        onChange={handleWord2Change}
      />
      <label for="word3" className="text-lg font-semibold text-gray-800">word 3</label>
      <input
        id="word3"
        className="px-3 py-2 border border-gray-300 rounded"
        placeholder="420"
        value={word3}
        onChange={handleWord3Change}
      />
      <textarea
        className="px-3 py-2 mt-4 border border-gray-300 rounded"
        value={generatedText}
      />
      <button 
        className={`px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-700`} 
      >
        {isLoading ? 'Minting...' : '日記を書く'}
      </button>
      {isSuccess && (
        <div className="text-green-500">
          Successfully minted your NFT!
          <div>
            <a className="text-blue-500 hover:underline" href={`https://mumbai.polygonscan.com/tx/${data?.hash}`}>polygonscan</a>
          </div>
        </div>
      )}
    </form>
  )
}
