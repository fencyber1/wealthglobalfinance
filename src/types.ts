export interface Transfer {
  id: string;
  type: 'local' | 'international';
  status: 'Pending' | 'Onhold' | 'Cancelled' | 'Completed';
  accountNumber: string;
  routingNumber?: string;
  accName: string;
  bankName?: string;
  bankSwiftCode?: string;
  bankIbanCode?: string;
  bankCountry?: string;
  bankAddress?: string;
  amount: number;
  date: string;
  description: string;
}

export interface CreditCard {
  id: string;
  type: 'debit' | 'credit';
  nameOnCard: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  status: 'active' | 'inactive';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  type?: 'info' | 'success' | 'error';
}

export interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  holdings: number;
  icon: string;
  color: string;
}

export type DebtType = 'credit-card' | 'loan' | 'mortgage' | 'other';
export type DebtStatus = 'active' | 'paid' | 'defaulted';

export interface DebtPayment {
  id: string;
  date: string;
  amount: number;
  remainingBalance: number;
}

export interface Debt {
  id: string;
  creditorName: string;
  debtType: DebtType;
  originalAmount: number;
  currentBalance: number;
  interestRate: number;
  minimumPayment: number;
  dueDate: string;
  status: DebtStatus;
  notes: string;
  createdAt: string;
  payments: DebtPayment[];
}
