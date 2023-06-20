'use client'

import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi'

export function MintNFTForm() {
  const [word1, setWord1] = useState('Ethereum');
  const [word2, setWord2] = useState('公園');
  const [word3, setWord3] = useState('コメダ珈琲');
  const [generatedText, setGeneratedText] = useState('');

  const textAreaRef = useRef(null);

  const handleWord1Change = (e) => setWord1(e.target.value);
  const handleWord2Change = (e) => setWord2(e.target.value);
  const handleWord3Change = (e) => setWord3(e.target.value);

  const handleTextareaChange = (e) => {
    setGeneratedText(e.target.value);

    // adjust the height of the textarea
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
  };

  useEffect(() => {
    // adjust the height of the textarea initially
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
  }, [generatedText]);
  
  const handleSubmit = async (e) => {
    console.log('OpenAIのAPIを呼び出す');
    e.preventDefault();
    
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word1,
          word2,
          word3
        }),
      });
      
      if (response.ok) {
        console.log('APIの呼び出しに成功');
        const data = await response.json();
        setGeneratedText(data.text);
      }
    } catch (err) {
      console.error(err);
    }
  };

  //const { config } = usePrepareContractWrite({
  //  address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
  //  abi: [
  //    {
  //      name: 'mint',
  //      type: 'function',
  //      stateMutability: 'nonpayable',
  //      inputs: [{ internalType: 'uint32', name: 'tokenId', type: 'uint32' }],
  //      outputs: [],
  //    },
  //  ],
  //  functionName: 'mint',
  //  args: ['nikki text'],
  //  enabled: Boolean(word1 && word2 && word3),
  //})
  //const { data, write } = useContractWrite(config)

  //const { isLoading, isSuccess } = useWaitForTransaction({
  //  hash: data?.hash,
  //})

  return (
    <form
      className="flex flex-col space-y-4"
      onSubmit={handleSubmit}
    >
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
        ref={textAreaRef}
        className="px-3 py-2 mt-4 border border-gray-300 rounded"
        value={generatedText}
        onChange={handleTextareaChange}
        style={{height: 'auto', overflow: 'auto'}}
      />
      <button 
        className={`px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-700`} 
      >
        日記を書く
      </button>
    </form>
  )
}
