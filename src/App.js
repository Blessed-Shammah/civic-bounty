// src/App.js
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia } from "wagmi/chains";
import { embeddedWallet } from '@civic/auth-web3';
import { injected, walletConnect } from 'wagmi/connectors';
import { CivicAuthProvider, UserButton } from '@civic/auth-web3/react';
import WalletComponent from './components/WalletComponent';
import './styles/App.css';

// Create wagmi config with multiple connectors
const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    embeddedWallet(),
    injected(), // MetaMask and other injected wallets
    walletConnect({
      projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID, // Get this from WalletConnect
    }),
  ],
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <CivicAuthProvider clientId={process.env.REACT_APP_CIVIC_CLIENT_ID}>
          <div className="app-container">
            <div className="app-header">
              <h1>Crypto Wallet</h1>
              <div className="header-buttons">
                <UserButton />
              </div>
            </div>
            <main className="app-main">
              <WalletComponent 
                recipientAddress={process.env.REACT_APP_RECIPIENT_ADDRESS} 
              />
            </main>
            <footer className="app-footer">
              <p>Powered by Civic Auth</p>
              <p className="network-info">
                Network: {process.env.NODE_ENV === 'production' ? 'Mainnet' : 'Sepolia Testnet'}
              </p>
            </footer>
          </div>
        </CivicAuthProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

export default App;