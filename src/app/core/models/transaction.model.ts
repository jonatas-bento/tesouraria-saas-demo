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
  batchId?: string | null;
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

export type MemberStatus = 'active' | 'away' | 'visitor' | 'transferred';

export interface Member {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  status: MemberStatus;
  joinedAt: Date | null;
  observations: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateMemberPayload {
  name: string;
  phone?: string;
  email?: string;
  status?: MemberStatus;
  joinedAt?: string;
  observations?: string;
}

export interface UpdateMemberPayload {
  name?: string;
  phone?: string;
  email?: string;
  status?: MemberStatus;
  joinedAt?: string;
  observations?: string;
}

export interface DeleteMemberResponse {
  id: string;
  deleted: boolean;
}

export type CashBatchStatus = 'open' | 'checking' | 'validated' | 'divergent';

export interface CashBatch {
  id: string;
  date: Date;
  description: string;
  countedAmount: number;
  countedBy: string;
  status: CashBatchStatus;
  validatedBy: string | null;
  validatedAt: Date | null;
  notes: string | null;
  launchedAmount: number;
  difference: number;
  transactionsCount: number;
  transactions?: Transaction[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCashBatchPayload {
  date: string;
  description: string;
  countedAmount: number;
  countedBy: string;
  notes?: string;
}

export interface UpdateCashBatchPayload {
  date?: string;
  description?: string;
  countedAmount?: number;
  countedBy?: string;
  status?: CashBatchStatus;
  validatedBy?: string;
  notes?: string;
}

export interface DeleteCashBatchResponse {
  id: string;
  deleted: boolean;
}

export interface ValidateCashBatchPayload {
  validatedBy: string;
  notes?: string;
}

export interface DemoResetResponse {
  message: string;
  transactionsCount: number;
  membersCount?: number;
  cashBatchesCount?: number;
  transactions: Transaction[];
  members?: Member[];
  cashBatches?: CashBatch[];
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
