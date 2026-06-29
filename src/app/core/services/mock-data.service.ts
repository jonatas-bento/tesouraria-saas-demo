import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  BalanceSheetItem,
  CreateTransactionPayload,
  DashboardSummary,
  DeleteTransactionResponse,
  DemoResetResponse,
  Report,
  Transaction,
  UpdateTransactionPayload,
} from '../models';
import {
  MOCK_BALANCE_SHEET,
  MOCK_REPORTS,
  MOCK_TRANSACTIONS,
} from '../mocks/transaction.mock';

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  private mockTransactions: Transaction[] = MOCK_TRANSACTIONS.map((item) => ({
    ...item,
    date: new Date(item.date),
  }));

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

  getAllTransactions(): Observable<Transaction[]> {
    return of(this.mockTransactions.slice());
  }

  createTransaction(
    payload: CreateTransactionPayload
  ): Observable<Transaction> {
    const now = new Date();

    const transaction: Transaction = {
      id: this.createId(),
      date: new Date(payload.date),
      description: payload.description,
      amount: payload.amount,
      category: payload.category,
      type: payload.type,
      status: payload.status,
      createdAt: now,
      updatedAt: now,
    };

    this.mockTransactions = [transaction, ...this.mockTransactions];

    return of(transaction);
  }

  updateTransaction(
    id: string,
    payload: UpdateTransactionPayload
  ): Observable<Transaction> {
    const index = this.mockTransactions.findIndex((item) => item.id === id);

    if (index < 0) {
      throw new Error('Transação não encontrada no mock.');
    }

    const current = this.mockTransactions[index];

    const updated: Transaction = {
      ...current,
      ...payload,
      date: payload.date ? new Date(payload.date) : current.date,
      updatedAt: new Date(),
    };

    this.mockTransactions[index] = updated;

    return of(updated);
  }

  deleteTransaction(id: string): Observable<DeleteTransactionResponse> {
    this.mockTransactions = this.mockTransactions.filter(
      (item) => item.id !== id
    );

    return of({
      id,
      deleted: true,
    });
  }

  resetDemoData(): Observable<DemoResetResponse> {
    this.mockTransactions = MOCK_TRANSACTIONS.map((item) => ({
      ...item,
      date: new Date(item.date),
    }));

    return of({
      message: 'Dados demonstrativos restaurados com sucesso.',
      transactionsCount: this.mockTransactions.length,
      transactions: this.mockTransactions.slice(),
    });
  }

  getBalanceSheet(): Observable<BalanceSheetItem[]> {
    return of(this.mockBalanceSheet.slice());
  }

  getReports(): Observable<Report[]> {
    return of(this.mockReports.slice());
  }

  private createId(): string {
    return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`;
  }
}
