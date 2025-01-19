// src/App.js
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia } from "wagmi/chains";
import { embeddedWallet } from '@civic/auth-web3';
import { CivicAuthProvider, UserButton } from '@civic/auth-web3/react';
import WalletComponent from './components/WalletComponent';
import './styles/App.css';

const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    embeddedWallet(),
  ],
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <CivicAuthProvider clientId={process.env.REACT_APP_CIVIC_CLIENT_ID}>
          <div className="app-container">
            <div className="app-header">
              <h1>Civic Web3 Wallet Demo</h1>
              <UserButton />
            </div>
            <WalletComponent />
            <footer className="app-footer">
              <p>Powered by Civic Auth</p>
            </footer>
          </div>
        </CivicAuthProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

export default App;