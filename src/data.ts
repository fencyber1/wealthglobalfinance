import { Transfer, NotificationItem, CryptoAsset, Debt } from './types';

export const initialTransfers: Transfer[] = [
  {
    id: 't-1',
    type: 'local',
    status: 'Pending',
    routingNumber: '020208768',
    accountNumber: '0105050388403',
    accName: 'Christabel Burrell',
    amount: 1000.00,
    date: '2024-12-03',
    description: 'Services rendered'
  },
  {
    id: 't-2',
    type: 'local',
    status: 'Onhold',
    routingNumber: '821942',
    accountNumber: '7109000000009219',
    accName: 'Stefan Kruger',
    amount: 5000.00,
    date: '2024-11-14',
    description: 'Invoice #84729'
  },
  {
    id: 't-3',
    type: 'local',
    status: 'Pending',
    routingNumber: '32238828',
    accountNumber: '1001087826783',
    accName: 'EDMUND BECKER',
    amount: 5000.00,
    date: '2024-10-05',
    description: 'Family support'
  },
  {
    id: 't-4',
    type: 'local',
    status: 'Cancelled',
    routingNumber: '821942',
    accountNumber: '7109000000009219',
    accName: 'Stefan Kruger',
    amount: 10000.00,
    date: '2024-12-05',
    description: 'Vessel payment'
  },
  {
    id: 't-5',
    type: 'local',
    status: 'Cancelled',
    routingNumber: '821942',
    accountNumber: '7109000000009219',
    accName: 'Stefan Kruger',
    amount: 7000.00,
    date: '2024-09-05',
    description: 'Contract deposit'
  },
  {
    id: 't-6',
    type: 'international',
    status: 'Pending',
    accountNumber: '71090000000009219',
    accName: 'Stefan Kruger',
    bankName: 'Standard Chartered',
    bankSwiftCode: 'SCBLZAJJ',
    bankIbanCode: 'ZA10SCBL10020030040',
    bankCountry: 'South Africa',
    bankAddress: 'Johannesburg Main Branch',
    amount: 10000.00,
    date: '2024-08-24',
    description: 'Business wire transfer'
  },
  {
    id: 't-7',
    type: 'international',
    status: 'Cancelled',
    accountNumber: '5546785467',
    accName: 'Vanessa Watford',
    bankName: 'HSBC UK',
    bankSwiftCode: 'MIDLGB22',
    bankCountry: 'United Kingdom',
    amount: 500.00,
    date: '2024-05-18',
    description: 'Refund transaction'
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Holding Number Approved & Activated',
    message: 'Hello Edmund,\n\nWe Are Pleased To Inform You That Your Holding Number Has Been Approved And Your Account Has Now Been Successfully Activated.\n\nYou May Now Proceed With Withdrawals, Transfers, And Other Account Transactions As Applicable.\n\nPlease Feel Free To Reach Out If You Require Any Further Assistance.',
    date: '2024-02-02 - 11:36',
    type: 'success'
  },
  {
    id: 'n-2',
    title: 'Transfer On Hold',
    message: 'Hello Edmund, Your Pending Transfer Is Currently On ON HOLD. Provide Us With Your Anti-money Laundering Certificate To Proceed With Your Transfers. Thank You',
    date: '2024-07-21 - 14:53',
    type: 'info'
  },
  {
    id: 'n-3',
    title: 'Tax Payment Received',
    message: 'Hello, Your Tax Of 20,400 Cedis Have Been Received. Your Account Is Currently Under Review For 24 Hours. We Will Keep You Posted As Soon As Your Account Is Activated. Thank You',
    date: '2024-06-30 - 14:53',
    type: 'success'
  },
  {
    id: 'n-4',
    title: 'Verification Incomplete',
    message: 'Hello Customer,\n\n we Could Not Verify Your Information. Kindly Visit Our Branch To Complete The Verification Process To Get Your Account Activated.\n\nThank You',
    date: '2024-10-08 - 13:47',
    type: 'error'
  },
  {
    id: 'n-5',
    title: 'Account Inactive Alert',
    message: 'Hello Customer, Your Account Is Currently Inactive For Withdrawals And Transfers. A Tax Of 0.1% ($1,600) Is Needed To Be Paid To Get Your Account Active. Thank You For Banking With Us.',
    date: '2024-09-12 - 15:02',
    type: 'error'
  }
];

export const initialCryptos: CryptoAsset[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    holdings: 0,
    icon: 'BTC',
    color: '#F7931A'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    holdings: 0,
    icon: 'ETH',
    color: '#627EEA'
  },
  {
    id: 'tether',
    name: 'Tether',
    symbol: 'USDT',
    holdings: 0,
    icon: 'USDT',
    color: '#26A17B'
  },
  {
    id: 'bitcoin-cash',
    name: 'Bitcoin Cash',
    symbol: 'BCH',
    holdings: 0,
    icon: 'BCH',
    color: '#8DC351'
  }
];

export const initialDebts: Debt[] = [
  {
    id: 'd-1',
    creditorName: 'Chase Credit Services',
    debtType: 'credit-card',
    originalAmount: 15000,
    currentBalance: 8700,
    interestRate: 22.99,
    minimumPayment: 225,
    dueDate: '2024-12-15',
    status: 'active',
    notes: 'Business travel expenses card. Auto-pay enabled.',
    createdAt: '2024-03-10',
    payments: [
      { id: 'dp-1', date: '2024-04-15', amount: 500, remainingBalance: 8700 },
      { id: 'dp-2', date: '2024-05-15', amount: 500, remainingBalance: 8200 },
      { id: 'dp-3', date: '2024-06-15', amount: 500, remainingBalance: 7700 },
    ]
  },
  {
    id: 'd-2',
    creditorName: 'Wells Fargo Auto Loan',
    debtType: 'loan',
    originalAmount: 35000,
    currentBalance: 21400,
    interestRate: 6.49,
    minimumPayment: 675,
    dueDate: '2024-12-05',
    status: 'active',
    notes: '2024 Tesla Model 3 financing. 60-month term.',
    createdAt: '2024-08-01',
    payments: [
      { id: 'dp-4', date: '2024-04-05', amount: 675, remainingBalance: 21400 },
      { id: 'dp-5', date: '2024-05-05', amount: 675, remainingBalance: 20725 },
      { id: 'dp-6', date: '2024-06-05', amount: 675, remainingBalance: 20050 },
    ]
  },
  {
    id: 'd-3',
    creditorName: 'Student Loan Servicing Corp',
    debtType: 'loan',
    originalAmount: 45000,
    currentBalance: 18200,
    interestRate: 4.50,
    minimumPayment: 420,
    dueDate: '2024-12-22',
    status: 'active',
    notes: 'Consolidated federal student loans. Income-driven repayment plan.',
    createdAt: '2023-09-15',
    payments: [
      { id: 'dp-7', date: '2024-04-22', amount: 420, remainingBalance: 18200 },
      { id: 'dp-8', date: '2024-05-22', amount: 420, remainingBalance: 17780 },
      { id: 'dp-9', date: '2024-06-22', amount: 420, remainingBalance: 17360 },
    ]
  },
  {
    id: 'd-4',
    creditorName: 'Goldman Sachs Personal Loan',
    debtType: 'loan',
    originalAmount: 25000,
    currentBalance: 14800,
    interestRate: 7.99,
    minimumPayment: 520,
    dueDate: '2024-12-10',
    status: 'active',
    notes: 'Home renovation project loan. Fixed monthly payments.',
    createdAt: '2024-01-20',
    payments: [
      { id: 'dp-10', date: '2024-04-10', amount: 520, remainingBalance: 14800 },
      { id: 'dp-11', date: '2024-05-10', amount: 520, remainingBalance: 14280 },
      { id: 'dp-12', date: '2024-06-10', amount: 520, remainingBalance: 13760 },
    ]
  },
  {
    id: 'd-5',
    creditorName: 'Bank of America HELOC',
    debtType: 'other',
    originalAmount: 50000,
    currentBalance: 22500,
    interestRate: 8.25,
    minimumPayment: 450,
    dueDate: '2024-12-20',
    status: 'active',
    notes: 'Home equity line of credit. Draw period active.',
    createdAt: '2023-11-01',
    payments: [
      { id: 'dp-13', date: '2024-04-20', amount: 450, remainingBalance: 22500 },
      { id: 'dp-14', date: '2024-05-20', amount: 450, remainingBalance: 22050 },
      { id: 'dp-15', date: '2024-06-20', amount: 450, remainingBalance: 21600 },
    ]
  }
];

export let debtIdCounter = 6;
export let debtPaymentIdCounter = 10;

export const countriesList = [
  'United States', 'United Kingdom', 'Canada', 'South Africa', 'Germany', 
  'France', 'Australia', 'Ghana', 'Nigeria', 'Japan', 'Singapore', 'China', 
  'India', 'Brazil', 'Switzerland', 'United Arab Emirates', 'Kenya'
];
