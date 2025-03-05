import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import type { Web3State } from '../types';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const initialState: Web3State = {
  isConnected: false,
  address: null,
  chainId: null,
  provider: null,
  signer: null,
};

export function useWeb3() {
  const [web3State, setWeb3State] = useState<Web3State>(initialState);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask to use this feature!');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();

      setWeb3State({
        isConnected: true,
        address,
        chainId: network.chainId,
        provider,
        signer,
      });
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      alert('Failed to connect to MetaMask. Please try again.');
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWeb3State(initialState);
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        disconnectWallet();
      });
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [disconnectWallet]);

  return {
    ...web3State,
    connectWallet,
    disconnectWallet,
  };
}