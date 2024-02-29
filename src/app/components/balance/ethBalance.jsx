import React from 'react'

import { useAccount, useBalance } from 'wagmi'

function EthBalance() {
    
    const { address } = useAccount()

  const { data, isError, isLoading } = useBalance({
    address,
  })

  if (isLoading) return <div>Fetching balance…</div>
  if (isError) return <div>Error fetching balance</div>
  return (
    <div>
      <span className="hidden pl-2 font-normal text-white sm:inline">
      Ξ {parseFloat(data?.formatted).toPrecision(4)}{" "}{data?.symbol}
    </span>
    </div>

    
  )
}

export default EthBalance;