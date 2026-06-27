import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  Transaction,
  DashboardSummary,
  BalanceSheetItem,
  Report,
} from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  private readonly mockTransactions: Transaction[] = [
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

  private readonly mockBalanceSheet: BalanceSheetItem[] = [
    { account: 'Caixa', debit: 25000, credit: 0, balance: 25000 },
    { account: 'Bancos', debit: 45000, credit: 0, balance: 45000 },
    { account: 'Contas a Receber', debit: 12000, credit: 0, balance: 12000 },
    { account: 'Fornecedores', debit: 0, credit: 5000, balance: -5000 },
    { account: 'Salários a Pagar', debit: 0, credit: 18000, balance: -18000 },
    { account: 'Contas a Pagar', debit: 0, credit: 3500, balance: -3500 },
  ];

  private readonly mockReports: Report[] = [
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

  getDashboardSummary(): Observable<DashboardSummary> {
    const totalIncome = this.mockTransactions
      .filter((t) => t.type === 'income' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = this.mockTransactions
      .filter((t) => t.type === 'expense' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingTransactions = this.mockTransactions.filter(
      (t) => t.status === 'pending'
    ).length;

    return of({
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      pendingTransactions,
    });
  }

  getIncomeTransactions(): Observable<Transaction[]> {
    return of(
      this.mockTransactions.filter((t) => t.type === 'income').slice()
    );
  }

  getExpenseTransactions(): Observable<Transaction[]> {
    return of(
      this.mockTransactions.filter((t) => t.type === 'expense').slice()
    );
  }

  getBalanceSheet(): Observable<BalanceSheetItem[]> {
    return of(this.mockBalanceSheet.slice());
  }

  getReports(): Observable<Report[]> {
    return of(this.mockReports.slice());
  }

  getAllTransactions(): Observable<Transaction[]> {
    return of(this.mockTransactions.slice());
  }
}
