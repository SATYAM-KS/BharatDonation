import React, { useState } from 'react';
import { Heart, Wallet, Menu, X, LogIn, LogOut, UserCircle, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthModal } from './AuthModal';
import type { User } from '../types';

interface Props {
  isConnected: boolean;
  address: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  user: User | null;
  onLogin: (email: string, password: string) => Promise<boolean>;
  onSignup: (email: string, password: string) => Promise<boolean>;
  onLogout: () => void;
  isAuthLoading: boolean;
  authError: string | null;
}

export function Navbar({ 
  isConnected, 
  address, 
  onConnect, 
  onDisconnect,
  user,
  onLogin,
  onSignup,
  onLogout,
  isAuthLoading,
  authError
}: Props) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [dropdownWidth, setDropdownWidth] = useState(300); // Increased default width

  const profileButtonRef = React.useRef<HTMLButtonElement>(null);

  // Update dropdown width based on button width
  React.useEffect(() => {
    if (profileButtonRef.current) {
      const buttonWidth = profileButtonRef.current.offsetWidth;
      setDropdownWidth(Math.max(buttonWidth, 300)); // Increased minimum width
    }
  }, [user?.email]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      navigate('/?section=campaigns');
    } else {
      scrollToSection('campaigns');
    }
  };

  React.useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Close profile dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const profileMenu = document.getElementById('profile-menu');
      if (profileMenu && !profileMenu.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <a href="/#campaigns" onClick={handleLogoClick} className="flex items-center gap-2 z-20">
              <Heart className="text-black w-5 h-5 md:w-6 md:h-6" />
              <span className="text-lg md:text-xl font-bold text-black">
                Bharat Donation
              </span>
            </a>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden z-50 text-black hover:text-black/80 transition-colors p-2 rounded-lg hover:bg-black/5"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => scrollToSection('campaigns')}
                className="text-black hover:text-black/80 transition-colors"
              >
                Campaigns
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-black hover:text-black/80 transition-colors"
              >
                How it Works
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-black hover:text-black/80 transition-colors"
              >
                About
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="relative" id="profile-menu">
                  <button
                    ref={profileButtonRef}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 bg-black/10 hover:bg-black/20 text-black px-6 py-2.5 rounded-full transition-colors border border-black/20"
                  >
                    <UserCircle size={20} />
                    <span>Profile</span>
                    <ChevronDown size={16} className={`transform transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isProfileOpen && (
                    <div 
                      className="absolute right-0 mt-3 bg-white rounded-xl shadow-lg border border-black/10"
                      style={{ width: `${dropdownWidth}px` }}
                    >
                      <div className="px-6 py-4 border-b border-black/10">
                        <div className="flex items-center gap-3 mb-2">
                          <UserCircle size={24} className="text-black/70" />
                          <p className="font-medium text-black break-words">{user.email}</p>
                        </div>
                        {user.isAdmin && (
                          <span className="inline-block bg-black text-[#cfab0c] text-xs px-3 py-1 rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                      <div className="px-3 py-2">
                        <button
                          onClick={() => {
                            onLogout();
                            setIsProfileOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-black hover:bg-black/5 rounded-lg flex items-center gap-3 transition-colors"
                        >
                          <LogOut size={18} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-2 bg-black text-[#cfab0c] px-4 py-2 rounded-full transition-colors hover:bg-black/80"
                >
                  <LogIn size={20} />
                  <span>Login</span>
                </button>
              )}

              {isConnected ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm bg-black/10 text-black px-4 py-2 rounded-full border border-black/20">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                  <button
                    onClick={onDisconnect}
                    className="bg-black/10 hover:bg-black/20 text-black px-4 py-2 rounded-full transition-colors border border-black/20"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={onConnect}
                  className="flex items-center gap-2 bg-black text-[#cfab0c] px-4 py-2 rounded-full transition-colors hover:bg-black/80"
                >
                  <Wallet size={20} />
                  <span>Connect Wallet</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile menu */}
      <div 
        className={`fixed inset-y-0 right-0 w-[80%] max-w-sm bg-white shadow-xl md:hidden transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } z-40`}
      >
        <div className="flex flex-col h-full pt-20 pb-6 px-6">
          <div className="flex-1 flex flex-col items-start space-y-6">
            <button 
              onClick={() => scrollToSection('campaigns')}
              className="text-black text-xl hover:text-black/80 transition-colors w-full text-left py-2"
            >
              Campaigns
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-black text-xl hover:text-black/80 transition-colors w-full text-left py-2"
            >
              How it Works
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-black text-xl hover:text-black/80 transition-colors w-full text-left py-2"
            >
              About
            </button>
          </div>
          
          <div className="pt-6 border-t border-black/10 space-y-4">
            {user ? (
              <div className="space-y-4">
                <div className="flex flex-col gap-2 p-6 bg-black/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <UserCircle size={24} className="text-black/70" />
                    <span className="font-medium break-words">{user.email}</span>
                  </div>
                  {user.isAdmin && (
                    <span className="inline-block bg-black text-[#cfab0c] text-xs px-3 py-1 rounded-full w-fit">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full bg-black/10 hover:bg-black/20 text-black px-6 py-3 rounded-full transition-colors"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full bg-black text-[#cfab0c] px-4 py-3 rounded-full transition-colors hover:bg-black/80"
              >
                <LogIn size={20} />
                Login
              </button>
            )}

            {isConnected ? (
              <div className="space-y-4">
                <span className="block text-sm bg-black/10 text-black px-4 py-3 rounded-full text-center">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <button
                  onClick={() => {
                    onDisconnect();
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-black/10 hover:bg-black/20 text-black px-4 py-3 rounded-full transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onConnect();
                  setIsMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full bg-black text-[#cfab0c] px-4 py-3 rounded-full transition-colors hover:bg-black/80"
              >
                <Wallet size={20} />
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={onLogin}
        onSignup={onSignup}
        isLoading={isAuthLoading}
        error={authError}
      />
    </>
  );
}