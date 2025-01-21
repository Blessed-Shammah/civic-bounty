// src/components/BuyMeCoffee.jsx
import React, { useState } from 'react';
import { 
  useConnect, 
  useAccount, 
  useDisconnect,
  useSendTransaction, 
  useWaitForTransactionReceipt 
} from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';
import { QRCodeSVG } from 'qrcode.react';
import { 
  FaCoffee, 
  FaTwitter, 
  FaSpinner, 
  FaCopy, 
  FaWallet, 
  FaQrcode,
  FaSignOutAlt
} from 'react-icons/fa';
import { COFFEE_PRICES } from '../constants/addresses';
import './BuyMeCoffee.css';

const BuyMeCoffee = ({ recipientAddress }) => {
  const [message, setMessage] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [txHash, setTxHash] = useState('');

  // Wagmi hooks
  const { connect, isLoading: isConnecting } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { sendTransactionAsync } = useSendTransaction();
  const { isLoading: isTransactionPending } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const ethToWei = (ethAmount) => {
    try {
      return String(Number(ethAmount) * 1e18);
    } catch (err) {
      console.error('Conversion error:', err);
      return '0';
    }
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(recipientAddress);
      setMessage('Address copied to clipboard! 📋');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to copy address');
    }
  };

  const connectWallet = async (connector) => {
    try {
      await connect({ connector });
    } catch (error) {
      setMessage('Failed to connect wallet: ' + error.message);
    }
  };

  const buyCoffee = async (size) => {
    if (!isConnected) {
      setMessage('Please connect your wallet first');
      return;
    }

    if (!recipientAddress) {
      setMessage('Recipient address not found');
      return;
    }

    setMessage('');

    try {
      const weiValue = ethToWei(COFFEE_PRICES[size]);
      
      const { hash } = await sendTransactionAsync({
        to: recipientAddress,
        value: weiValue,
      });

      setTxHash(hash);
      setMessage(`Thanks for the ${size} coffee! ☕ Transaction: ${hash.slice(0, 6)}...${hash.slice(-4)}`);
    } catch (error) {
      console.error('Transaction error:', error);
      setMessage('Transaction failed: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <div className="buy-coffee-container glass-effect">
      <h2><FaCoffee /> Buy Me a Coffee</h2>

      {/* Wallet Connection Status */}
      <div className="wallet-status">
        {isConnected ? (
          <div className="connected-status">
            <span>Connected: {address.slice(0, 6)}...{address.slice(-4)}</span>
            <button onClick={() => disconnect()} className="disconnect-button">
              <FaSignOutAlt /> Disconnect
            </button>
          </div>
        ) : (
          <div className="connect-wallet-options">
            <button 
              onClick={() => connectWallet(injected())} 
              className="wallet-button"
              disabled={isConnecting}
            >
              <FaWallet /> Connect MetaMask
            </button>
            <button 
              onClick={() => connectWallet(walletConnect())} 
              className="wallet-button"
              disabled={isConnecting}
            >
              <FaWallet /> WalletConnect
            </button>
          </div>
        )}
      </div>

      <div className="wallet-address-section">
        <h3>Send ETH to this address:</h3>
        <div className="address-display">
          <code>{recipientAddress}</code>
          <button onClick={copyAddress} className="icon-button" title="Copy Address">
            <FaCopy />
          </button>
        </div>
      </div>

      {/* QR Code Section */}
      <button 
        className="option-button"
        onClick={() => setShowQR(!showQR)}
      >
        <FaQrcode /> {showQR ? 'Hide QR' : 'Show QR'}
      </button>

      {showQR && (
        <div className="coffee-qr">
          <QRCodeSVG 
            value={`ethereum:${recipientAddress}?value=${ethToWei(COFFEE_PRICES.medium)}`}
            size={128}
            level="H"
            includeMargin={true}
          />
          <p>Scan to send ETH</p>
          <div className="qr-prices">
            <p>Suggested amounts:</p>
            {Object.entries(COFFEE_PRICES).map(([size, price]) => (
              <span key={size}>{size}: {price} ETH</span>
            ))}
          </div>
        </div>
      )}

      {/* Coffee Purchase Options */}
      <div className="coffee-options">
        {Object.entries(COFFEE_PRICES).map(([size, price]) => (
          <button 
            key={size}
            className="coffee-button"
            onClick={() => buyCoffee(size)}
            disabled={!isConnected || isTransactionPending}
          >
            <span>{size.charAt(0).toUpperCase() + size.slice(1)} Coffee</span>
            <span>{price} ETH</span>
            {isTransactionPending && <FaSpinner className="icon-spin" />}
          </button>
        ))}
      </div>

      {/* Messages and Transaction Status */}
      {message && (
        <div className={`message ${message.includes('failed') ? 'error' : 'success'}`}>
          {message}
          {txHash && !message.includes('failed') && (
            <div className="transaction-actions">
              <a 
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="view-transaction"
              >
                View Transaction
              </a>
              <button 
                className="share-button"
                onClick={() => {
                  const text = `Just bought a coffee using Web3! ☕`;
                  const url = window.location.href;
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
                }}
              >
                <FaTwitter /> Share
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BuyMeCoffee;