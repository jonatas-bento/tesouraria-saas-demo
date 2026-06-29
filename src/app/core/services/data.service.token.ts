import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import {
  BalanceSheetItem,
  CashBatch,
  CreateCashBatchPayload,
  CreateMemberPayload,
  CreateTransactionPayload,
  DashboardSummary,
  DeleteCashBatchResponse,
  DeleteMemberResponse,
  DeleteTransactionResponse,
  DemoResetResponse,
  Member,
  Report,
  Transaction,
  UpdateCashBatchPayload,
  UpdateMemberPayload,
  UpdateTransactionPayload,
  ValidateCashBatchPayload,
} from '../models';

export interface IDataService {
  getDashboardSummary(): Observable<DashboardSummary>;

  getAllTransactions(): Observable<Transaction[]>;
  getIncomeTransactions(): Observable<Transaction[]>;
  getExpenseTransactions(): Observable<Transaction[]>;
  createTransaction(payload: CreateTransactionPayload): Observable<Transaction>;
  updateTransaction(
    id: string,
    payload: UpdateTransactionPayload
  ): Observable<Transaction>;
  deleteTransaction(id: string): Observable<DeleteTransactionResponse>;

  getMembers(): Observable<Member[]>;
  createMember(payload: CreateMemberPayload): Observable<Member>;
  updateMember(id: string, payload: UpdateMemberPayload): Observable<Member>;
  deleteMember(id: string): Observable<DeleteMemberResponse>;

  getCashBatches(): Observable<CashBatch[]>;
  getCashBatch(id: string): Observable<CashBatch>;
  createCashBatch(payload: CreateCashBatchPayload): Observable<CashBatch>;
  updateCashBatch(
    id: string,
    payload: UpdateCashBatchPayload
  ): Observable<CashBatch>;
  deleteCashBatch(id: string): Observable<DeleteCashBatchResponse>;
  getAvailableTransactionsForCashBatch(id: string): Observable<Transaction[]>;
  attachCashBatchTransactions(
    id: string,
    transactionIds: string[]
  ): Observable<CashBatch>;
  validateCashBatch(
    id: string,
    payload: ValidateCashBatchPayload
  ): Observable<CashBatch>;
  reopenCashBatch(id: string): Observable<CashBatch>;

  getBalanceSheet(): Observable<BalanceSheetItem[]>;
  getReports(): Observable<Report[]>;
  resetDemoData(): Observable<DemoResetResponse>;
}

export const DATA_SERVICE_TOKEN = new InjectionToken<IDataService>(
  'DataService'
);
