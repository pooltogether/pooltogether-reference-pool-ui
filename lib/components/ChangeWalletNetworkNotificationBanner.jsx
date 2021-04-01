import React, { useContext } from 'react'

import { ETHEREUM_NETWORKS, WALLETS } from 'lib/constants'
import { useNetwork } from 'lib/hooks/useNetwork'
import { useAddNetworkToMetamask } from 'lib/hooks/useAddNetworkToMetamask'
import { Button } from 'lib/components/Button'
import { WalletContext } from 'lib/components/WalletContextProvider'
import { NotificationBanner } from 'lib/components/NotificationBanners'
import { NETWORK } from 'lib/utils/networks'
// import { ButtonLink } from 'lib/components/ButtonLink'

export const ChangeWalletNetworkNotificationBanner = (props) => {
  const { walletConnected, walletMatchesNetwork, walletNetwork, name, chainId } = useNetwork()

  if (!walletConnected || walletMatchesNetwork) return null

  return (
    <NotificationBanner className='bg-teal'>
      <ChangeWalletNetworkNotification
        chainId={chainId}
        walletNetwork={walletNetwork}
        poolChainName={name}
      />
    </NotificationBanner>
  )
}

// TODO: Blocked on a guide for network changing
const ChangeWalletNetworkNotification = (props) => {
  const { chainId, walletNetwork, poolChainName } = props

  const wallet = useContext(WalletContext)
  const addNetwork = useAddNetworkToMetamask(chainId)

  const walletName = wallet?.state?.wallet?.name
  const { name: walletChainName } = walletNetwork
  const walletIsMetaMask = [WALLETS.metamask].includes(walletName)

  const isSupportedEthereumNetwork = ETHEREUM_NETWORKS.includes(chainId)

  const connectableNetwork = [
    NETWORK.matic,
    NETWORK.mumbai,
    NETWORK.xdai,
    NETWORK.bsc,
    NETWORK['bsc-testnet'],
    NETWORK.poa,
    NETWORK['poa-sokol']
  ]
  const isConnectableNetwork = connectableNetwork.includes(chainId)

  const showConnectButton = walletIsMetaMask && isConnectableNetwork
  const showBadWalletMessage = !walletIsMetaMask && !isSupportedEthereumNetwork

  return (
    <div className='flex flex-col sm:flex-row justify-between items-center'>
      <span>
        👋 Your wallet is currently set to <b>{walletChainName}</b>. Please connect to{' '}
        <b>{poolChainName}</b> to participate in this pool.
        <br className='hidden xs:block' />
        {showBadWalletMessage && (
          <span>
            {' '}
            ⚠️ You will need to use{' '}
            <a href='https://metamask.io' className='underline hover:opacity-80'>
              <b>MetaMask</b>
            </a>{' '}
            to connect to this network.
          </span>
        )}
      </span>
      {showConnectButton ? (
        <Button
          size='xs'
          color='primary'
          onClick={() => addNetwork()}
          paddingClasses='py-1 px-4'
          className='mt-2 mx-auto sm:mr-0 sm:ml-2 sm:mt-0'
        >
          Connect to {poolChainName}
        </Button>
      ) : null}
    </div>
  )
}

// TODO: Render this in the false case once we have a link to an article
// (
//   <ButtonLink
//     size='xs'
//     color='primary'
//     paddingClasses='py-1 px-4'
//     className='mt-2 mx-auto sm:mx-0 sm:mt-0 mx'
//     href='https://www.google.com'
//     target='_blank'
//     rel='noopener noreferrer'
//   >
//     More info
//   </ButtonLink>
// )
