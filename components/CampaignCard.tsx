import React from 'react';
import { Heart, Share2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Campaign, User } from '../types';

interface Props {
  campaign: Campaign;
  onDonate: (campaignId: string) => void;
  user: User | null;
  onLoginRequired: () => void;
}

const USD_TO_INR = 83;

export function CampaignCard({ campaign, onDonate, user, onLoginRequired }: Props) {
  const progress = (campaign.raisedAmount / campaign.targetAmount) * 100;

  const formatAmount = (amount: number) => {
    return (amount * USD_TO_INR).toLocaleString('en-IN');
  };

  const handleDonateClick = () => {
    if (!user) {
      onLoginRequired();
      return;
    }
    onDonate(campaign.id);
  };

  return (
    <div className="bg-black/5 backdrop-blur-lg rounded-xl md:rounded-2xl shadow-lg overflow-hidden card-hover border border-black/10 h-full flex flex-col">
      <div className="relative h-48">
        <img 
          src={campaign.imageUrl} 
          alt={campaign.title}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
      </div>
      <div className="p-4 md:p-6 flex flex-col flex-1">
        <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-black line-clamp-2">{campaign.title}</h3>
        <p className="text-sm md:text-base text-black/80 mb-4 md:mb-6 line-clamp-2">{campaign.description}</p>
        
        <div className="mb-4 md:mb-6">
          <div className="flex justify-between text-xs md:text-sm mb-2">
            <span className="text-black/80">Progress</span>
            <span className="text-black">{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-black/10 rounded-full h-1.5 md:h-2 overflow-hidden">
            <div 
              className="bg-black h-1.5 md:h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center mb-4 md:mb-6">
          <div>
            <p className="text-xs md:text-sm text-black/80">Raised</p>
            <p className="text-sm md:text-base font-semibold text-black">
              ₹{formatAmount(campaign.raisedAmount)}
            </p>
          </div>
          <div>
            <p className="text-xs md:text-sm text-black/80">Goal</p>
            <p className="text-sm md:text-base font-semibold text-black">
              ₹{formatAmount(campaign.targetAmount)}
            </p>
          </div>
        </div>

        <div className="mt-auto">
          <div className="grid grid-cols-2 gap-2 md:gap-4">
            <button
              onClick={handleDonateClick}
              className="bg-black text-[#cfab0c] py-2 md:py-3 px-3 md:px-4 rounded-lg md:rounded-xl hover:bg-black/80 transition-all duration-200 transform hover:scale-105 hover:shadow-lg font-bold text-sm md:text-base"
            >
              {user ? 'Donate Now' : 'Login to Donate'}
            </button>
            <Link
              to={`/campaign/${campaign.id}`}
              className="flex items-center justify-center gap-2 text-black hover:text-black/80 transition-colors hover:bg-black/5 rounded-lg md:rounded-xl border-2 border-black/10 font-medium"
            >
              Know More
              <ArrowRight size={18} className="md:w-5 md:h-5" />
            </Link>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button className="p-2 text-black hover:text-black/80 transition-colors hover:bg-black/5 rounded-lg">
              <Heart size={18} className="md:w-5 md:h-5" />
            </button>
            <button className="p-2 text-black hover:text-black/80 transition-colors hover:bg-black/5 rounded-lg">
              <Share2 size={18} className="md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}