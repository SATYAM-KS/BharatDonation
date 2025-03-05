import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreateCampaign: (campaign: {
    title: string;
    description: string;
    targetAmount: number;
    imageUrl: string;
    upiId: string;
  }) => void;
}

export function CreateCampaignModal({ isOpen, onClose, onCreateCampaign }: Props) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    imageUrl: '',
    upiId: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateCampaign({
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
    });
    setFormData({
      title: '',
      description: '',
      targetAmount: '',
      imageUrl: '',
      upiId: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#fcf0be] rounded-2xl shadow-lg p-8 relative card-hover border border-black/10 w-full max-w-3xl mx-auto">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-black hover:text-black/80 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold mb-8 text-black">
          Create New Campaign
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-black mb-2">
              Campaign Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 bg-white/50 border-2 border-black/20 rounded-xl text-black placeholder-black/40 focus:ring-2 focus:ring-black focus:border-black transition-all"
              placeholder="Enter campaign title"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-black mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 bg-white/50 border-2 border-black/20 rounded-xl text-black placeholder-black/40 focus:ring-2 focus:ring-black focus:border-black transition-all"
              placeholder="Describe your campaign"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-black mb-2">
              Target Amount (USD)
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={formData.targetAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
              className="w-full px-4 py-3 bg-white/50 border-2 border-black/20 rounded-xl text-black placeholder-black/40 focus:ring-2 focus:ring-black focus:border-black transition-all"
              placeholder="Enter target amount"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-black mb-2">
              Campaign Image URL
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              className="w-full px-4 py-3 bg-white/50 border-2 border-black/20 rounded-xl text-black placeholder-black/40 focus:ring-2 focus:ring-black focus:border-black transition-all"
              placeholder="Enter image URL (e.g., from Unsplash)"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-black mb-2">
              UPI ID
            </label>
            <input
              type="text"
              value={formData.upiId}
              onChange={(e) => setFormData(prev => ({ ...prev, upiId: e.target.value }))}
              className="w-full px-4 py-3 bg-white/50 border-2 border-black/20 rounded-xl text-black placeholder-black/40 focus:ring-2 focus:ring-black focus:border-black transition-all"
              placeholder="Enter your UPI ID (e.g., name@upi)"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-[#cfab0c] py-4 px-6 rounded-xl hover:bg-black/80 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl mt-8 font-bold text-lg"
          >
            Create Campaign
          </button>
        </form>
      </div>
    </div>
  );
}