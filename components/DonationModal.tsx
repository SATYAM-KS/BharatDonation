import React, { useState } from 'react';
import { X, Wallet, IndianRupee } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDonate: (amount: number, message: string, paymentMethod: 'crypto' | 'upi', upiId?: string) => void;
  upiId?: string;
}

export function DonationModal({ isOpen, onClose, onDonate, upiId }: Props) {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'upi'>('crypto');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      onDonate(numAmount, message, paymentMethod, upiId);
      setAmount('');
      setMessage('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-[#fcf0be] rounded-2xl shadow-lg p-6 relative card-hover border border-black/10">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-black hover:text-black/80 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-black mb-6">Make a Donation</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-black mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('crypto')}
                className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'crypto'
                    ? 'border-black bg-black text-[#cfab0c] shadow-md'
                    : 'border-black/20 text-black hover:border-black hover:bg-black/5'
                }`}
              >
                <Wallet size={24} />
                <span className="font-medium">Crypto</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-black bg-black text-[#cfab0c] shadow-md'
                    : 'border-black/20 text-black hover:border-black hover:bg-black/5'
                }`}
              >
                <IndianRupee size={24} />
                <span className="font-medium">UPI</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold text-black mb-2">
              Amount ({paymentMethod === 'crypto' ? 'USD' : 'INR'})
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/60">
                {paymentMethod === 'crypto' ? '$' : '₹'}
              </span>
              <input
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-white/50 border-2 border-black/20 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-black text-lg placeholder-black/40"
                placeholder="Enter amount"
                required
              />
            </div>
          </div>

          {paymentMethod === 'upi' && upiId && (
            <div className="p-4 bg-white/50 rounded-lg border-2 border-black/20">
              <h3 className="text-lg font-semibold text-black mb-2">UPI Payment Details</h3>
              <p className="text-black font-medium">UPI ID: {upiId}</p>
              <p className="text-black/80 mt-2 text-sm">
                Please make the payment to this UPI ID and enter the UPI reference number below.
              </p>
            </div>
          )}

          <div>
            <label className="block text-lg font-semibold text-black mb-2">
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border-2 border-black/20 rounded-lg focus:ring-2 focus:ring-black focus:border-black text-black placeholder-black/40"
              placeholder="Leave a message of support..."
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-[#cfab0c] py-3 px-6 rounded-lg hover:bg-black/80 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl text-lg font-semibold"
          >
            Confirm Donation
          </button>
        </form>
      </div>
    </div>
  );
}