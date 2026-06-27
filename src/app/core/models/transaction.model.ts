export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  status: 'pending' | 'completed' | 'cancelled';
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  pendingTransactions: number;
}

export interface BalanceSheetItem {
  account: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface Report {
  id: string;
  name: string;
  type: 'monthly' | 'quarterly' | 'annual';
  period: string;
  generatedAt: Date;
}
