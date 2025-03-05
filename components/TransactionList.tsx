import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, ExternalLink, ChevronRight } from 'lucide-react';
import type { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
}

const USD_TO_INR = 83;

export function TransactionList({ transactions }: Props) {
  const navigate = useNavigate();

  const formatTxHash = (hash: string) => {
    if (!hash) return '';
    return `${hash.slice(0, 4)}...${hash.slice(-4)}`;
  };

  const formatAmount = (amount: number, paymentMethod: 'crypto' | 'upi') => {
    const inrAmount = paymentMethod === 'crypto' ? amount * USD_TO_INR : amount;
    return inrAmount.toLocaleString('en-IN');
  };

  const displayedTransactions = transactions.slice(0, 3);

  return (
    <div className="bg-black/5 backdrop-blur-lg rounded-2xl shadow-lg p-6 card-hover border border-black/10">
      <h2 className="text-xl font-semibold mb-4 text-black">Recent Transactions</h2>
      <div className="space-y-4">
        {displayedTransactions.map((tx) => (
          <div 
            key={tx.id} 
            className="flex items-start gap-4 p-4 bg-black/5 rounded-lg transform hover:scale-[1.02] transition-transform duration-200 hover:shadow-md border border-black/10"
          >
            <div className="p-2 rounded-full bg-black/5">
              <IndianRupee size={20} className="text-black" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-black">
                    {tx.paymentMethod === 'crypto' 
                      ? formatTxHash(tx.donor)
                      : 'Anonymous'}
                  </p>
                  <p className="text-sm text-black/60">
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <p className="font-semibold text-black">
                  ₹{formatAmount(tx.amount, tx.paymentMethod)}
                </p>
              </div>
              {tx.message && (
                <p className="mt-2 text-sm text-black/80">{tx.message}</p>
              )}
              {tx.paymentMethod === 'crypto' && tx.txHash && (
                <a
                  href={`https://etherscan.io/tx/${tx.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-sm text-black hover:text-black/80 flex items-center gap-1"
                >
                  View on Etherscan
                  <ExternalLink size={14} />
                </a>
              )}
              {tx.paymentMethod === 'upi' && tx.upiReference && (
                <p className="mt-2 text-sm text-black/80">
                  UPI Ref: {tx.upiReference}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {transactions.length > 3 && (
        <button
          onClick={() => navigate('/transactions')}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-black text-[#cfab0c] py-3 px-4 rounded-xl hover:bg-black/80 transition-all duration-200 transform hover:scale-105 hover:shadow-lg font-bold"
        >
          View All
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}