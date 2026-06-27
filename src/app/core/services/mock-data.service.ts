import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  Transaction,
  DashboardSummary,
  BalanceSheetItem,
  Report,
} from '../models';
import {
  MOCK_TRANSACTIONS,
  MOCK_BALANCE_SHEET,
  MOCK_REPORTS,
} from '../mocks/transaction.mock';

/**
 * Mock Data Service
 * 
 * Serviço de dados mockados para demonstração.
 * 
 * IMPORTANTE: Este serviço é usado apenas em modo demonstração.
 * Em produção, será substituído por um serviço real que faz chamadas HTTP.
 * 
 * Modo: SOMENTE LEITURA
 * - Não implementa operações de escrita (POST, PUT, DELETE)
 * - Retorna dados mockados locais
 * - Simula comportamento assíncrono com Observables
 * 
 * Para integração futura com API:
 * 1. Criar um TreasuryApiService que implementa a mesma interface
 * 2. Usar HttpClient para fazer chamadas reais
 * 3. Substituir este serviço no app.config.ts ou via providers
 */
@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  private readonly mockTransactions: Transaction[] = MOCK_TRANSACTIONS;
  private readonly mockBalanceSheet: BalanceSheetItem[] = MOCK_BALANCE_SHEET;
  private readonly mockReports: Report[] = MOCK_REPORTS;

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
