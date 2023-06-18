'use client'

import { useAccount, useEnsName } from 'wagmi'

export function Account() {
  const { address } = useAccount()
  const { data: ensName } = useEnsName({ address })

  return (
    <div className="text-lg font-semibold text-gray-800">
      {ensName ?? address}
      {ensName ? <span className="text-sm text-gray-600"> ({address})</span> : null}
    </div>
  )
}

