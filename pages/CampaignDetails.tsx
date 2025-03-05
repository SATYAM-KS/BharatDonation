import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, IndianRupee, Heart, Share2 } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useWeb3 } from '../hooks/useWeb3';
import { useAuth } from '../hooks/useAuth';
import type { Campaign } from '../types';

interface Props {
  campaigns: Campaign[];
  onDonate: (campaignId: string) => void;
  onLoginRequired: () => void;
}

const USD_TO_INR = 83;

export function CampaignDetails({ campaigns, onDonate, onLoginRequired }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isConnected, address, connectWallet, disconnectWallet } = useWeb3();
  const { user, isLoading, error, login, signup, logout } = useAuth();

  const campaign = campaigns.find(c => c.id === id);

  if (!campaign) {
    return <div>Campaign not found</div>;
  }

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
    <div className="min-h-screen bg-amber-50">
      <Navbar
        isConnected={isConnected}
        address={address}
        onConnect={connectWallet}
        onDisconnect={disconnectWallet}
        user={user}
        onLogin={login}
        onSignup={signup}
        onLogout={logout}
        isAuthLoading={isLoading}
        authError={error}
      />

      <main className="max-w-7xl mx-auto px-4 py-24">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-black hover:text-black/80 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to Campaigns</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="relative">
            <img
              src={campaign.imageUrl}
              alt={campaign.title}
              className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
            />
          </div>

          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-black">{campaign.title}</h1>
            
            <div className="bg-black/5 rounded-xl p-6 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-black/80">Progress</span>
                  <span className="text-black">{progress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-black/10 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-black h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-black/80">Raised</p>
                  <p className="text-xl font-semibold text-black">
                    ₹{formatAmount(campaign.raisedAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-black/80">Goal</p>
                  <p className="text-xl font-semibold text-black">
                    ₹{formatAmount(campaign.targetAmount)}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleDonateClick}
                  className="flex-1 bg-black text-[#cfab0c] py-3 px-6 rounded-xl hover:bg-black/80 transition-all duration-200 transform hover:scale-105 hover:shadow-xl font-bold text-lg"
                >
                  {user ? 'Donate Now' : 'Login to Donate'}
                </button>
                <button className="p-3 text-black hover:text-black/80 transition-colors hover:bg-black/5 rounded-xl">
                  <Heart size={24} />
                </button>
                <button className="p-3 text-black hover:text-black/80 transition-colors hover:bg-black/5 rounded-xl">
                  <Share2 size={24} />
                </button>
              </div>
            </div>

            <div className="prose prose-lg">
              <h2 className="text-2xl font-bold text-black mb-4">About this Campaign</h2>
              <p className="text-black/80 leading-relaxed">{campaign.description}</p>
            </div>

            <div className="bg-black/5 rounded-xl p-6">
              <h2 className="text-xl font-bold text-black mb-4">Payment Methods</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <IndianRupee size={24} className="text-black" />
                  <div>
                    <p className="font-medium text-black">UPI Payment</p>
                    <p className="text-sm text-black/80">UPI ID: {campaign.upiId}</p>
                  </div>
                </div>
                {campaign.contractAddress && (
                  <div>
                    <p className="font-medium text-black">Crypto Payment</p>
                    <p className="text-sm text-black/80">Contract: {campaign.contractAddress}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}