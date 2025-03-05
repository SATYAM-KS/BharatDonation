import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PlusCircle, Heart } from 'lucide-react';
import { CampaignCard } from './components/CampaignCard';
import { DonationModal } from './components/DonationModal';
import { TransactionList } from './components/TransactionList';
import { CreateCampaignModal } from './components/CreateCampaignModal';
import { AuthModal } from './components/AuthModal';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { TransactionsPage } from './pages/Transactions';
import { CampaignDetails } from './pages/CampaignDetails';
import { useWeb3 } from './hooks/useWeb3';
import { useAuth } from './hooks/useAuth';
import type { Campaign } from './types';

const initialCampaigns: Campaign[] = [
  {
    id: '1',
    title: 'Support Rural Education in Bihar',
    description: 'Help us provide quality education to underprivileged children in rural Bihar. Your donation will fund digital tablets, textbooks, and basic infrastructure for village schools, ensuring that every child has access to modern educational tools and resources. Together, we can bridge the digital divide and create opportunities for rural students.',
    targetAmount: 500000,
    raisedAmount: 325000,
    imageUrl: 'https://images.unsplash.com/photo-1522661067900-ab829854a57f?auto=format&fit=crop&q=80',
    creator: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    contractAddress: '0x123...',
    upiId: 'bihareducation@upi',
    transactions: []
  },
  {
    id: '2',
    title: 'Empower Women Artisans of Rajasthan',
    description: 'Support traditional women artisans in rural Rajasthan. Your contribution will help provide raw materials, training, and market access for their handcrafted products. This initiative aims to preserve cultural heritage while creating sustainable livelihoods for women in rural communities.',
    targetAmount: 750000,
    raisedAmount: 450000,
    imageUrl: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&q=80',
    creator: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    contractAddress: '0x789...',
    upiId: 'rajasthancraft@upi',
    transactions: []
  }
];

function App() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isConnected, address, connectWallet, disconnectWallet } = useWeb3();
  const { user, isLoading, error, login, signup, logout } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const section = params.get('section');
    if (section) {
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  const handleDonateClick = (campaignId: string) => {
    setSelectedCampaign(campaignId);
    setIsModalOpen(true);
  };

  const handleLoginRequired = () => {
    setIsAuthModalOpen(true);
  };

  const handleCreateCampaignClick = () => {
    if (!user?.isAdmin) {
      alert('Only admin users can create campaigns');
      return;
    }
    setIsCreateModalOpen(true);
  };

  const handleDonation = async (
    amount: number,
    message: string,
    paymentMethod: 'crypto' | 'upi',
    upiId?: string
  ) => {
    if (!selectedCampaign) return;
    if (paymentMethod === 'crypto' && !isConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    try {
      let txHash: string | undefined;
      let upiReference: string | undefined;
      let donor: string;

      if (paymentMethod === 'crypto') {
        txHash = `0x${Math.random().toString(16).slice(2)}`;
        donor = address || '0x000';
      } else {
        upiReference = `UPI${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
        donor = 'Anonymous';
      }

      setCampaigns(prev => prev.map(campaign => {
        if (campaign.id === selectedCampaign) {
          return {
            ...campaign,
            raisedAmount: campaign.raisedAmount + amount,
            transactions: [
              {
                id: `t${Date.now()}`,
                amount,
                donor,
                timestamp: Date.now(),
                message,
                txHash,
                paymentMethod,
                upiReference
              },
              ...campaign.transactions
            ]
          };
        }
        return campaign;
      }));
    } catch (error) {
      console.error('Error processing donation:', error);
      alert('Failed to process donation. Please try again.');
    }
  };

  const handleCreateCampaign = async (campaignData: {
    title: string;
    description: string;
    targetAmount: number;
    imageUrl: string;
    upiId: string;
  }) => {
    if (!user?.isAdmin) {
      alert('Only admin users can create campaigns');
      return;
    }

    try {
      const contractAddress = `0x${Math.random().toString(16).slice(2, 42)}`;

      const newCampaign: Campaign = {
        id: `campaign-${Date.now()}`,
        ...campaignData,
        raisedAmount: 0,
        creator: address || '0x000',
        contractAddress,
        transactions: []
      };

      setCampaigns(prev => [...prev, newCampaign]);
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please try again.');
    }
  };

  const handleLoginSuccess = async (email: string, password: string) => {
    const success = await login(email, password);
    if (success) {
      setIsAuthModalOpen(false);
      if (selectedCampaign) {
        setIsModalOpen(true);
      }
    }
    return success;
  };

  const handleSignupSuccess = async (email: string, password: string) => {
    const success = await signup(email, password);
    if (success) {
      setIsAuthModalOpen(false);
      if (selectedCampaign) {
        setIsModalOpen(true);
      }
    }
    return success;
  };

  const selectedCampaignData = selectedCampaign
    ? campaigns.find(c => c.id === selectedCampaign)
    : null;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-amber-50">
              <Navbar
                isConnected={isConnected}
                address={address}
                onConnect={connectWallet}
                onDisconnect={disconnectWallet}
                user={user}
                onLogin={handleLoginSuccess}
                onSignup={handleSignupSuccess}
                onLogout={logout}
                isAuthLoading={isLoading}
                authError={error}
                isAuthModalOpen={isAuthModalOpen}
                onAuthModalClose={() => setIsAuthModalOpen(false)}
              />

              <div className="hero-gradient text-slate-900 pt-16 md:pt-20">
                <header className="max-w-7xl mx-auto px-4 py-12 md:py-24">
                  <div className="flex flex-col items-center text-center mb-12">
                    <div className="float-animation mb-6 md:mb-8">
                      <Heart size={40} className="text-amber-600 md:w-14 md:h-14" />
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 tracking-tight">
                      Empowering Change
                      <br />
                      Across Bharat
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto text-slate-700 mb-8 md:mb-12 leading-relaxed px-4">
                      Join us in making a difference through secure and transparent donations
                    </p>
                    {user?.isAdmin && (
                      <button
                        onClick={handleCreateCampaignClick}
                        className="flex items-center gap-2 md:gap-3 bg-slate-900 text-amber-50 px-6 md:px-10 py-3 md:py-5 rounded-full hover:bg-slate-800 transition-all shadow-lg transform hover:scale-105 duration-200 text-base md:text-lg font-bold"
                      >
                        <PlusCircle size={20} className="md:w-6 md:h-6" />
                        <span>Start a Campaign</span>
                      </button>
                    )}
                  </div>
                </header>
              </div>

              <section id="how-it-works" className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-12 md:mb-16">How It Works</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    <div className="text-center">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                        <span className="text-xl md:text-2xl font-bold text-amber-600">1</span>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3 md:mb-4">Create Campaign</h3>
                      <p className="text-slate-600">Start your fundraising journey by creating a campaign with a compelling story</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                        <span className="text-xl md:text-2xl font-bold text-amber-600">2</span>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3 md:mb-4">Share & Connect</h3>
                      <p className="text-slate-600">Share your campaign with your network and connect with donors</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                        <span className="text-xl md:text-2xl font-bold text-amber-600">3</span>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3 md:mb-4">Track Impact</h3>
                      <p className="text-slate-600">Monitor donations and see your impact grow in real-time</p>
                    </div>
                  </div>
                </div>
              </section>

              <main id="campaigns" className="max-w-7xl mx-auto px-4 py-16 md:py-24">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-12 md:mb-16">Active Campaigns</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                      {campaigns.map(campaign => (
                        <div key={campaign.id} className="float-animation" style={{ animationDelay: `${Math.random() * 2}s` }}>
                          <CampaignCard
                            campaign={campaign}
                            onDonate={handleDonateClick}
                            user={user}
                            onLoginRequired={handleLoginRequired}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-6 md:space-y-8">
                    <TransactionList 
                      transactions={campaigns.flatMap(c => c.transactions).sort((a, b) => b.timestamp - a.timestamp)}
                    />
                  </div>
                </div>
              </main>

              <section id="about" className="py-16 md:py-24 bg-amber-100">
                <div className="max-w-7xl mx-auto px-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-12 md:mb-16">About Us</h2>
                  <div className="max-w-3xl mx-auto text-center px-4">
                    <p className="text-lg md:text-xl text-slate-700 mb-6 md:mb-8 leading-relaxed">
                      Bharat Donation Platform is dedicated to fostering positive change across India. We combine blockchain technology with traditional payment methods to create a transparent, secure, and accessible donation platform.
                    </p>
                    <p className="text-lg md:text-xl text-slate-700 leading-relaxed">
                      Our mission is to connect compassionate donors with meaningful causes, ensuring that every contribution makes a real difference in the lives of those who need it most.
                    </p>
                  </div>
                </div>
              </section>

              <Footer />

              <DonationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onDonate={handleDonation}
                upiId={selectedCampaignData?.upiId}
              />

              <CreateCampaignModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreateCampaign={handleCreateCampaign}
              />

              <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onLogin={handleLoginSuccess}
                onSignup={handleSignupSuccess}
                isLoading={isLoading}
                error={error}
              />
            </div>
          }
        />
        <Route
          path="/campaign/:id"
          element={
            <CampaignDetails
              campaigns={campaigns}
              onDonate={handleDonateClick}
              onLoginRequired={handleLoginRequired}
            />
          }
        />
        <Route
          path="/transactions"
          element={
            <TransactionsPage
              transactions={campaigns.flatMap(c => c.transactions).sort((a, b) => b.timestamp - a.timestamp)}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;