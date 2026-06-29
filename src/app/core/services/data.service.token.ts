import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
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

export interface IDataService {
  getDashboardSummary(): Observable<DashboardSummary>;
  getIncomeTransactions(): Observable<Transaction[]>;
  getExpenseTransactions(): Observable<Transaction[]>;
  getBalanceSheet(): Observable<BalanceSheetItem[]>;
  getReports(): Observable<Report[]>;
  getAllTransactions(): Observable<Transaction[]>;

  createTransaction(payload: CreateTransactionPayload): Observable<Transaction>;
  updateTransaction(
    id: string,
    payload: UpdateTransactionPayload
  ): Observable<Transaction>;
  deleteTransaction(id: string): Observable<DeleteTransactionResponse>;
  resetDemoData(): Observable<DemoResetResponse>;
}

export const DATA_SERVICE_TOKEN = new InjectionToken<IDataService>(
  'DataService'
);
