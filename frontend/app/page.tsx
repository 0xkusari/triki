import { Account } from '../components/Account'
import { Connect } from '../components/Connect'
import { NetworkSwitcher } from '../components/NetworkSwitcher'

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl text-center font-semibold">triki</h1>
      <Connect />
      <h2>Network</h2>
      <NetworkSwitcher />
      <h2>Account</h2>
      <Account />
    </div>
  )
}
