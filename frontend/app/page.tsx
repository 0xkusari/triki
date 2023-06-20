import { Account } from '../components/Account'
import { Connect } from '../components/Connect'
import { NetworkSwitcher } from '../components/NetworkSwitcher'
import { MintNFTForm } from '../components/MintNFTForm'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full fixed top-0 flex justify-between items-center px-8 py-4 bg-white">
        <h1 className="text-4xl text-center font-semibold">triki</h1>
        <Connect />
        <NetworkSwitcher />
        <Account />
      </div>
      <MintNFTForm className="mt-8" />
    </div>
  )
}
