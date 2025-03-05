import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, ExternalLink, ArrowLeft } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useWeb3 } from '../hooks/useWeb3';
import type { Transaction } from '../types';

const USD_TO_INR = 83;

interface Props {
  transactions: Transaction[];
}

export function TransactionsPage({ transactions }: Props) {
  const navigate = useNavigate();
  const { isConnected, address, connectWallet, disconnectWallet } = useWeb3();

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/?section=campaigns');
  };

  const formatTxHash = (hash: string) => {
    if (!hash) return '';
    return `${hash.slice(0, 4)}...${hash.slice(-4)}`;
  };

  const formatAmount = (amount: number, paymentMethod: 'crypto' | 'upi') => {
    const inrAmount = paymentMethod === 'crypto' ? amount * USD_TO_INR : amount;
    return inrAmount.toLocaleString('en-IN');
  };

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar
        isConnected={isConnected}
        address={address}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
      />

      <main className="max-w-7xl mx-auto px-4 py-24">
        <div className="mb-8">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-black hover:text-black/80 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="bg-black/5 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-black/10">
          <h1 className="text-3xl font-bold text-black mb-8">All Transactions</h1>
          
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div 
                key={tx.id} 
                className="flex items-start gap-4 p-6 bg-black/5 rounded-xl transform hover:scale-[1.02] transition-transform duration-200 hover:shadow-md border border-black/10"
              >
                <div className="p-2 rounded-full bg-black/5">
                  <IndianRupee size={24} className="text-black" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-black text-lg">
                        {tx.paymentMethod === 'crypto' 
                          ? formatTxHash(tx.donor)
                          : 'Anonymous'}
                      </p>
                      <p className="text-black/60">
                        {new Date(tx.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <p className="font-semibold text-black text-xl">
                      ₹{formatAmount(tx.amount, tx.paymentMethod)}
                    </p>
                  </div>
                  {tx.message && (
                    <p className="mt-3 text-black/80">{tx.message}</p>
                  )}
                  {tx.paymentMethod === 'crypto' && tx.txHash && (
                    <a
                      href={`https://etherscan.io/tx/${tx.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 text-black hover:text-black/80 flex items-center gap-1"
                    >
                      View on Etherscan
                      <ExternalLink size={16} />
                    </a>
                  )}
                  {tx.paymentMethod === 'upi' && tx.upiReference && (
                    <p className="mt-2 text-black/80">
                      UPI Ref: {tx.upiReference}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}