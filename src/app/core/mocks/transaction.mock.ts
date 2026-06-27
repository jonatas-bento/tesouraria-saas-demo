/**
 * Transaction Mock Data
 * 
 * Dados mockados para demonstração.
 * Este arquivo contém dados fictícios que simulam respostas da API.
 * 
 * IMPORTANTE: Este arquivo é usado apenas em modo demonstração.
 * Em produção, os dados virão de chamadas HTTP reais para a API.
 */

import { Transaction, BalanceSheetItem, Report } from '../models';

/**
 * Mock Transactions
 * Simula: GET /api/transactions
 */
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    date: new Date('2026-06-01'),
    description: 'Recebimento de Cliente A',
    amount: 15000,
    category: 'Vendas',
    type: 'income',
    status: 'completed',
  },
  {
    id: '2',
    date: new Date('2026-06-05'),
    description: 'Recebimento de Cliente B',
    amount: 8500,
    category: 'Vendas',
    type: 'income',
    status: 'completed',
  },
  {
    id: '3',
    date: new Date('2026-06-10'),
    description: 'Prestação de Serviços',
    amount: 12000,
    category: 'Serviços',
    type: 'income',
    status: 'pending',
  },
  {
    id: '4',
    date: new Date('2026-06-03'),
    description: 'Pagamento de Fornecedor X',
    amount: 5000,
    category: 'Fornecedores',
    type: 'expense',
    status: 'completed',
  },
  {
    id: '5',
    date: new Date('2026-06-07'),
    description: 'Folha de Pagamento',
    amount: 18000,
    category: 'Pessoal',
    type: 'expense',
    status: 'completed',
  },
  {
    id: '6',
    date: new Date('2026-06-12'),
    description: 'Aluguel',
    amount: 3500,
    category: 'Despesas Fixas',
    type: 'expense',
    status: 'pending',
  },
  {
    id: '7',
    date: new Date('2026-06-15'),
    description: 'Energia Elétrica',
    amount: 850,
    category: 'Despesas Fixas',
    type: 'expense',
    status: 'completed',
  },
  {
    id: '8',
    date: new Date('2026-06-18'),
    description: 'Material de Escritório',
    amount: 420,
    category: 'Despesas Operacionais',
    type: 'expense',
    status: 'completed',
  },
];

/**
 * Mock Balance Sheet
 * Simula: GET /api/balance-sheet
 */
export const MOCK_BALANCE_SHEET: BalanceSheetItem[] = [
  { account: 'Caixa', debit: 25000, credit: 0, balance: 25000 },
  { account: 'Bancos', debit: 45000, credit: 0, balance: 45000 },
  { account: 'Contas a Receber', debit: 12000, credit: 0, balance: 12000 },
  { account: 'Fornecedores', debit: 0, credit: 5000, balance: -5000 },
  { account: 'Salários a Pagar', debit: 0, credit: 18000, balance: -18000 },
  { account: 'Contas a Pagar', debit: 0, credit: 3500, balance: -3500 },
];

/**
 * Mock Reports
 * Simula: GET /api/reports
 */
export const MOCK_REPORTS: Report[] = [
  {
    id: '1',
    name: 'Relatório Mensal - Junho 2026',
    type: 'monthly',
    period: 'Junho/2026',
    generatedAt: new Date('2026-06-26'),
  },
  {
    id: '2',
    name: 'Relatório Trimestral - Q2 2026',
    type: 'quarterly',
    period: 'Abr-Jun/2026',
    generatedAt: new Date('2026-06-25'),
  },
  {
    id: '3',
    name: 'Relatório Anual - 2025',
    type: 'annual',
    period: '2025',
    generatedAt: new Date('2026-01-15'),
  },
];
