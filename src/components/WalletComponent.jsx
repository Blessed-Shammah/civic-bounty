// src/components/WalletComponent.jsx
import React, { useState } from 'react';
import { useUser } from '@civic/auth-web3/react';
import { userHasWallet } from '@civic/auth-web3';
import { useAccount, useBalance, useSendTransaction, useDisconnect } from 'wagmi';
import { QRCodeSVG } from 'qrcode.react';
import { 
  FaCopy, 
  FaQrcode, 
  FaWallet, 
  FaEthereum, 
  FaPaperPlane, 
  FaSpinner,
  FaSignOutAlt 
} from 'react-icons/fa';
import './WalletComponent.css';
import BuyMeCoffee from './BuyMeCoffee';
import { OWNER_ADDRESS } from '../constants/addresses';
import WalletDetector from './WalletDetector';

function WalletComponent() {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showWalletDetector, setShowWalletDetector] = useState(false);

  const userContext = useUser();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { sendTransaction } = useSendTransaction();
  
  const balance = useBalance({
    address: userHasWallet(userContext) ? userContext.walletAddress : undefined,
  });

  const copyAddress = () => {
    if (userContext.walletAddress) {
      navigator.clipboard.writeText(userContext.walletAddress);
      setSuccess('Address copied to clipboard! 📋');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleSendTransaction = async (e) => {
    e.preventDefault();
    if (!recipient.startsWith('0x') || recipient.length !== 42) {
      setError('Invalid Ethereum address format');
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const weiValue = String(Number(amount) * 1e18);
      const tx = await sendTransaction({
        to: recipient,
        value: weiValue,
      });

      setSuccess(`Transaction sent! 🎉 Hash: ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}`);
      setAmount('');
      setRecipient('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userContext.user) {
    return (
      <div className="wallet-container glass-effect">
        <div className="login-prompt">
          <FaWallet className="wallet-icon" />
          <h2>Welcome to Crypto Wallet</h2>
          <p>Please log in to access your wallet</p>
        </div>
      </div>
    );
  }

  if (!userHasWallet(userContext)) {
    return (
      <div className="wallet-container glass-effect">
        <div className="create-wallet-prompt">
          <FaWallet className="wallet-icon" />
          <h2>Create Your Wallet</h2>
          <p>You need to create a wallet to continue</p>
          <button 
            onClick={() => userContext.createWallet()}
            className="create-wallet-button"
          >
            <FaWallet className="button-icon" /> Create Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-container">
      <div className="notifications">
        {error && (
          <div className="error-message animate-slide-in">
            <p>{error}</p>
            <button className="close-button" onClick={() => setError('')}>×</button>
          </div>
        )}

        {success && (
          <div className="success-message animate-slide-in">
            <p>{success}</p>
          </div>
        )}
      </div>

      <div className="wallet-card">
        {/* Connection Status */}
        <div className="connection-status">
          {isConnected ? (
            <div className="connected-info">
              <span>Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
              <button onClick={() => disconnect()} className="disconnect-button">
                <FaSignOutAlt /> Disconnect
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowWalletDetector(!showWalletDetector)} 
              className="connect-wallet-button"
            >
              <FaWallet /> Connect Wallet
            </button>
          )}
        </div>

        {showWalletDetector && !isConnected && <WalletDetector />}

        <div className="wallet-header">
          <h3><FaWallet className="icon" /> Wallet Details</h3>
          <div className="address-actions">
            <button onClick={copyAddress} className="action-button">
              <FaCopy /> Copy
            </button>
            <button onClick={() => setShowQR(!showQR)} className="action-button">
              <FaQrcode /> {showQR ? 'Hide QR' : 'Show QR'}
            </button>
          </div>
        </div>

        <div className="address-container glass-effect">
          <code>{userContext.walletAddress}</code>
        </div>

        {showQR && (
          <div className="qr-container animate-fade-in">
            <QRCodeSVG 
              value={userContext.walletAddress || ''} 
              size={128}
              level="H"
              includeMargin={true}
              className="qr-code"
            />
          </div>
        )}

        <div className="balance-card glass-effect">
          <h3><FaEthereum className="icon" /> Balance</h3>
          <p className="balance-amount">
            {balance.data ? 
              `${Number(balance.data?.formatted).toFixed(4)} ${balance.data?.symbol}` 
              : <FaSpinner className="icon-spin" />}
          </p>
        </div>

        {isConnected && (
          <BuyMeCoffee recipientAddress={OWNER_ADDRESS} />
        )}

        {isConnected && (
          <div className="send-form glass-effect">
            <h3><FaPaperPlane className="icon" /> Send ETH</h3>
            <form onSubmit={handleSendTransaction}>
              <div className="form-group">
                <label>Recipient Address</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="0x..."
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label>Amount (ETH)</label>
                <div className="amount-input">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    step="0.0001"
                    min="0"
                    className="input-field"
                  />
                  <span className="eth-symbol">ETH</span>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isLoading || !recipient || !amount}
                className={`submit-button ${isLoading ? 'loading' : ''}`}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="icon-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane /> Send ETH
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default WalletComponent;