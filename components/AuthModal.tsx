import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<boolean>;
  onSignup: (email: string, password: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export function AuthModal({ isOpen, onClose, onLogin, onSignup, isLoading, error }: Props) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await (isLoginMode ? onLogin(email, password) : onSignup(email, password));
    if (success) {
      setEmail('');
      setPassword('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#fcf0be] rounded-2xl shadow-lg p-8 relative card-hover border border-black/10 w-full max-w-md mx-auto">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-black hover:text-black/80 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold mb-6 text-black">
          {isLoginMode ? 'Login' : 'Sign Up'}
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-black mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border-2 border-black/20 rounded-xl text-black placeholder-black/40 focus:ring-2 focus:ring-black focus:border-black transition-all"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-black mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border-2 border-black/20 rounded-xl text-black placeholder-black/40 focus:ring-2 focus:ring-black focus:border-black transition-all"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-[#cfab0c] py-4 px-6 rounded-xl hover:bg-black/80 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                {isLoginMode ? 'Logging in...' : 'Signing up...'}
              </>
            ) : (
              <>{isLoginMode ? 'Login' : 'Sign Up'}</>
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-black hover:text-black/80 transition-colors text-sm"
            >
              {isLoginMode 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}