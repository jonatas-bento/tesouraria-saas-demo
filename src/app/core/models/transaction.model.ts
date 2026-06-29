export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'pending' | 'completed' | 'cancelled';

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  type: TransactionType;
  status: TransactionStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTransactionPayload {
  date: string;
  description: string;
  amount: number;
  category: string;
  type: TransactionType;
  status: TransactionStatus;
}

export interface UpdateTransactionPayload {
  date?: string;
  description?: string;
  amount?: number;
  category?: string;
  type?: TransactionType;
  status?: TransactionStatus;
}

export interface DeleteTransactionResponse {
  id: string;
  deleted: boolean;
}

export interface DemoResetResponse {
  message: string;
  transactionsCount: number;
  transactions: Transaction[];
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

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  success: boolean;
}
