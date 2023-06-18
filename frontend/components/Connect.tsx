'use client'

import { BaseError } from 'viem'
import { useAccount, useConnect, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

export function Connect() {
  const { address, connector, isConnected } = useAccount()
  const { data: ensAvatar } = useEnsAvatar({ address })
  const { data: ensName } = useEnsName({ address })
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div className="flex items-center space-x-4">
        <img className="w-10 h-10 rounded-full" src={ensAvatar} alt="ENS Avatar" />
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={disconnect}>Disconnect</button>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-2">
      {connectors.map((connector) => (
        <button
          className={`px-4 py-2 rounded text-white ${connector.ready ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} `}
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {connector.name}
          {!connector.ready && ' (unsupported)'}
          {isLoading &&
            connector.id === pendingConnector?.id &&
            ' (connecting)'}
        </button>
      ))}
      {error && <div className="text-red-500">{error.message}</div>}
    </div>
  )
}

