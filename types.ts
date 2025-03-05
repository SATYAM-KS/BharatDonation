export interface Campaign {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  imageUrl: string;
  creator: string;
  contractAddress?: string;
  upiId?: string;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  amount: number;
  donor: string;
  timestamp: number;
  message?: string;
  txHash?: string;
  paymentMethod: 'crypto' | 'upi';
  upiReference?: string;
}

export interface Web3State {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  provider: any | null;
  signer: any | null;
}

export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}