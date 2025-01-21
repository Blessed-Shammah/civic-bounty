// src/components/WalletDetector.jsx
import React, { useEffect, useState } from 'react';
import { useConnect } from 'wagmi';
import { 
  FaEthereum, 
  FaWallet, 
  FaExclamationCircle,
  FaSpinner 
} from 'react-icons/fa';
import './WalletDetector.css';

const WalletDetector = () => {
  const [detectedWallets, setDetectedWallets] = useState([]);
  const [isScanning, setIsScanning] = useState(true);
  const { connect, connectors } = useConnect();

  useEffect(() => {
    detectWallets();
  }, []);

  const detectWallets = async () => {
    setIsScanning(true);
    const detected = [];

    // Check for MetaMask
    if (typeof window.ethereum !== 'undefined') {
      if (window.ethereum.isMetaMask) {
        detected.push({
          name: 'MetaMask',
          icon: <FaEthereum />,
          type: 'metamask',
          installed: true
        });
      }
    }

    // Check for Coinbase Wallet
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isCoinbaseWallet) {
      detected.push({
        name: 'Coinbase Wallet',
        icon: <FaWallet />,
        type: 'coinbase',
        installed: true
      });
    }

    // Check for Trust Wallet
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isTrust) {
      detected.push({
        name: 'Trust Wallet',
        icon: <FaWallet />,
        type: 'trust',
        installed: true
      });
    }

    // Add WalletConnect as an option regardless of installation
    detected.push({
      name: 'WalletConnect',
      icon: <FaWallet />,
      type: 'walletconnect',
      installed: true // Always available as it doesn't require installation
    });

    setDetectedWallets(detected);
    setIsScanning(false);
  };

  const connectWallet = async (walletType) => {
    const connector = connectors.find(c => {
      if (walletType === 'metamask' && c.id === 'injected') return true;
      if (walletType === 'walletconnect' && c.id === 'walletConnect') return true;
      return false;
    });

    if (connector) {
      try {
        await connect({ connector });
      } catch (error) {
        console.error('Connection error:', error);
      }
    }
  };

  return (
    <div className="wallet-detector">
      <h3>Available Wallets</h3>
      
      {isScanning ? (
        <div className="scanning">
          <FaSpinner className="spin" />
          <p>Scanning for wallets...</p>
        </div>
      ) : detectedWallets.length > 0 ? (
        <div className="wallet-list">
          {detectedWallets.map((wallet, index) => (
            <button
              key={index}
              className="wallet-option"
              onClick={() => connectWallet(wallet.type)}
            >
              <span className="wallet-icon">{wallet.icon}</span>
              <span className="wallet-name">{wallet.name}</span>
              {wallet.installed && <span className="installed-badge">✓</span>}
            </button>
          ))}
        </div>
      ) : (
        <div className="no-wallets">
          <FaExclamationCircle />
          <p>No wallets detected. Install MetaMask or another Web3 wallet to continue.</p>
          <div className="wallet-links">
            <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer">
              Install MetaMask
            </a>
            <a href="https://trustwallet.com/browser-extension" target="_blank" rel="noopener noreferrer">
              Install Trust Wallet
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletDetector;