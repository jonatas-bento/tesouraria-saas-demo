/**
 * Transaction Model
 * 
 * Representa uma transação financeira (entrada ou despesa).
 * Usado em: Dashboard, Entradas, Despesas
 * API Endpoint: GET /api/transactions, GET /api/transactions/:id
 */
export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  status: 'pending' | 'completed' | 'cancelled';
}

/**
 * Dashboard Summary Model
 * 
 * Resumo financeiro para o dashboard.
 * Usado em: Dashboard
 * API Endpoint: GET /api/dashboard/summary
 */
export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  pendingTransactions: number;
}

/**
 * Balance Sheet Item Model
 * 
 * Item do balancete de verificação.
 * Usado em: Balancete
 * API Endpoint: GET /api/balance-sheet
 */
export interface BalanceSheetItem {
  account: string;
  debit: number;
  credit: number;
  balance: number;
}

/**
 * Report Model
 * 
 * Representa um relatório financeiro.
 * Usado em: Relatórios
 * API Endpoint: GET /api/reports, GET /api/reports/:id
 */
export interface Report {
  id: string;
  name: string;
  type: 'monthly' | 'quarterly' | 'annual';
  period: string;
  generatedAt: Date;
}

/**
 * API Response Wrapper
 * 
 * Envelope padrão para respostas da API.
 * Usado em: Todos os endpoints
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Pagination Metadata
 * 
 * Metadados de paginação para listas.
 * Usado em: Endpoints com paginação
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Paginated Response
 * 
 * Resposta paginada da API.
 * Usado em: GET /api/transactions, GET /api/reports
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  success: boolean;
}
