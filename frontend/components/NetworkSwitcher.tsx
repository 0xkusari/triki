'use client'

import { useNetwork, useSwitchNetwork } from 'wagmi'

export function NetworkSwitcher() {
  const { chain } = useNetwork()
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork()

  return (
    <div className="flex flex-col space-y-4">
      <div className="text-lg font-semibold text-gray-800">
        Connected to {chain?.name ?? chain?.id}
        {chain?.unsupported && ' (unsupported)'}
      </div>
      {switchNetwork && (
        <div className="flex flex-wrap items-center">
          <span className="mr-2">Switch to:</span>
          {chains.map((x) =>
            x.id === chain?.id ? null : (
              <button className="px-4 py-2 mr-2 rounded text-white bg-blue-500 hover:bg-blue-700"
                key={x.id} 
                onClick={() => switchNetwork(x.id)}>
                {x.name}
                {isLoading && x.id === pendingChainId && ' (switching)'}
              </button>
            ),
          )}
        </div>
      )}
      {error && <div className="text-red-500">{error.message}</div>}
    </div>
  )
}
