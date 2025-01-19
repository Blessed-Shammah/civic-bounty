// src/components/BuyMeCoffee.jsx
import React, { useState } from 'react';
import { useSendTransaction } from 'wagmi';
import { QRCodeSVG } from 'qrcode.react';
import { FaCoffee, FaTwitter } from 'react-icons/fa';
import { COFFEE_PRICES } from '../constants/addresses';
import './BuyMeCoffee.css';

const BuyMeCoffee = ({ recipientAddress }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showQR, setShowQR] = useState(false);
  const { sendTransaction } = useSendTransaction();

  // Convert ETH to Wei without using BigInt
  const ethToWei = (ethAmount) => {
    // Multiply by 10^18 and return as string
    return String(Number(ethAmount) * 1e18);
  };

  const buyCoffee = async (size) => {
    setIsLoading(true);
    try {
      const weiValue = ethToWei(COFFEE_PRICES[size]);
      
      const tx = await sendTransaction({
        to: recipientAddress,
        value: weiValue,
      });
      
      setMessage(`Thanks for the ${size} coffee! ☕ Transaction: ${tx.hash.slice(0, 6)}...`);
      shareOnTwitter(size);
    } catch (error) {
      setMessage('Transaction failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const shareOnTwitter = (size) => {
    const text = `Just bought @YourTwitterHandle a ${size} coffee using their Civic Web3 Wallet app! ☕`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
  };

  return (
    <div className="buy-coffee-container glass-effect">
      <h2><FaCoffee /> Buy Me a Coffee</h2>
      
      <div className="coffee-options">
        <button 
          className="coffee-button"
          onClick={() => buyCoffee('small')}
          disabled={isLoading}
        >
          <span>Small Coffee</span>
          <span>{COFFEE_PRICES.small} ETH</span>
        </button>
        <button 
          className="coffee-button"
          onClick={() => buyCoffee('medium')}
          disabled={isLoading}
        >
          <span>Medium Coffee</span>
          <span>{COFFEE_PRICES.medium} ETH</span>
        </button>
        <button 
          className="coffee-button"
          onClick={() => buyCoffee('large')}
          disabled={isLoading}
        >
          <span>Large Coffee</span>
          <span>{COFFEE_PRICES.large} ETH</span>
        </button>
      </div>

      <button 
        className="qr-toggle-button"
        onClick={() => setShowQR(!showQR)}
      >
        {showQR ? 'Hide QR Code' : 'Show QR Code'}
      </button>

      {showQR && (
        <div className="coffee-qr">
          <QRCodeSVG 
            value={`ethereum:${recipientAddress}?value=${ethToWei(COFFEE_PRICES.medium)}`}
            size={128}
            level="H"
            includeMargin={true}
          />
          <p>Scan to buy me a coffee!</p>
        </div>
      )}

      {message && (
        <div className={`message ${message.includes('failed') ? 'error' : 'success'}`}>
          {message}
          {!message.includes('failed') && (
            <button 
              className="share-button"
              onClick={() => shareOnTwitter('medium')}
            >
              <FaTwitter /> Share
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BuyMeCoffee;