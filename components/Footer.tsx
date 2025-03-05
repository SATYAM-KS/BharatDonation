import React from 'react';
import { Heart, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-black">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Heart className="text-[#cfab0c] w-5 h-5 md:w-6 md:h-6" />
              <span className="text-lg md:text-xl font-bold text-[#cfab0c]">
                Bharat Donation
              </span>
            </Link>
            <p className="text-[#cfab0c]/80 text-sm md:text-base">
              Empowering change through transparent and secure blockchain-powered donations across India.
            </p>
          </div>

          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4 text-[#cfab0c]">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('campaigns')}
                  className="text-[#cfab0c]/80 hover:text-[#cfab0c] transition-colors text-sm md:text-base"
                >
                  Browse Campaigns
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-[#cfab0c]/80 hover:text-[#cfab0c] transition-colors text-sm md:text-base"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-[#cfab0c]/80 hover:text-[#cfab0c] transition-colors text-sm md:text-base"
                >
                  About Us
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4 text-[#cfab0c]">Resources</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-[#cfab0c]/80 text-sm md:text-base">FAQ</span>
              </li>
              <li>
                <span className="text-[#cfab0c]/80 text-sm md:text-base">Terms of Service</span>
              </li>
              <li>
                <span className="text-[#cfab0c]/80 text-sm md:text-base">Privacy Policy</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base md:text-lg font-semibold mb-4 text-[#cfab0c]">Connect With Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/bharatdonation"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#cfab0c]/80 hover:text-[#cfab0c] transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} className="md:w-6 md:h-6" />
              </a>
              <a
                href="https://github.com/bharatdonation"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#cfab0c]/80 hover:text-[#cfab0c] transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} className="md:w-6 md:h-6" />
              </a>
              <a
                href="https://linkedin.com/company/bharatdonation"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#cfab0c]/80 hover:text-[#cfab0c] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} className="md:w-6 md:h-6" />
              </a>
            </div>
            <div className="mt-4">
              <p className="text-[#cfab0c]/80 text-sm md:text-base">Subscribe to our newsletter</p>
              <form onSubmit={(e) => e.preventDefault()} className="mt-2 flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-[#cfab0c]/10 text-[#cfab0c] px-3 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#cfab0c] text-sm md:text-base w-full md:w-auto"
                />
                <button 
                  type="submit"
                  className="bg-[#cfab0c] text-black px-4 py-2 rounded-r-lg hover:bg-[#cfab0c]/80 transition-colors text-sm md:text-base whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-[#cfab0c]/20">
          <p className="text-center text-[#cfab0c]/80 text-sm md:text-base">
            © {new Date().getFullYear()} Bharat Donation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}