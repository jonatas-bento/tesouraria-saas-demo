import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, defer, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
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
import { IDataService } from './data.service.token';
import { MockDataService } from './mock-data.service';

type DateLike = string | Date;

function parseDate(value: DateLike): Date {
  return value instanceof Date ? value : new Date(value);
}

@Injectable({
  providedIn: 'root',
})
export class TreasuryApiService implements IDataService {
  private readonly http = inject(HttpClient);
  private readonly mockService = inject(MockDataService);
  private readonly baseUrl = environment.apiUrl;
  private readonly useFallback = environment.useMockFallback;

  getDashboardSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.baseUrl}/dashboard`).pipe(
      this.withFallback('getDashboardSummary', () =>
        this.mockService.getDashboardSummary()
      )
    );
  }

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/transactions`).pipe(
      map((list) => list.map(this.normalizeTransaction)),
      this.withFallback('getAllTransactions', () =>
        this.mockService.getAllTransactions()
      )
    );
  }

  getIncomeTransactions(): Observable<Transaction[]> {
    return this.http
      .get<Transaction[]>(`${this.baseUrl}/transactions`, {
        params: { type: 'income' },
      })
      .pipe(
        map((list) => list.map(this.normalizeTransaction)),
        this.withFallback('getIncomeTransactions', () =>
          this.mockService.getIncomeTransactions()
        )
      );
  }

  getExpenseTransactions(): Observable<Transaction[]> {
    return this.http
      .get<Transaction[]>(`${this.baseUrl}/transactions`, {
        params: { type: 'expense' },
      })
      .pipe(
        map((list) => list.map(this.normalizeTransaction)),
        this.withFallback('getExpenseTransactions', () =>
          this.mockService.getExpenseTransactions()
        )
      );
  }

  createTransaction(
    payload: CreateTransactionPayload
  ): Observable<Transaction> {
    return this.http
      .post<Transaction>(`${this.baseUrl}/transactions`, payload)
      .pipe(
        map(this.normalizeTransaction),
        this.withFallback('createTransaction', () =>
          this.mockService.createTransaction(payload)
        )
      );
  }

  updateTransaction(
    id: string,
    payload: UpdateTransactionPayload
  ): Observable<Transaction> {
    return this.http
      .patch<Transaction>(`${this.baseUrl}/transactions/${id}`, payload)
      .pipe(
        map(this.normalizeTransaction),
        this.withFallback('updateTransaction', () =>
          this.mockService.updateTransaction(id, payload)
        )
      );
  }

  deleteTransaction(id: string): Observable<DeleteTransactionResponse> {
    return this.http
      .delete<DeleteTransactionResponse>(`${this.baseUrl}/transactions/${id}`)
      .pipe(
        this.withFallback('deleteTransaction', () =>
          this.mockService.deleteTransaction(id)
        )
      );
  }

  resetDemoData(): Observable<DemoResetResponse> {
    return this.http.post<DemoResetResponse>(`${this.baseUrl}/demo/reset`, {}).pipe(
      map((response) => ({
        ...response,
        transactions: response.transactions.map(this.normalizeTransaction),
      })),
      this.withFallback('resetDemoData', () => this.mockService.resetDemoData())
    );
  }

  getBalanceSheet(): Observable<BalanceSheetItem[]> {
    return this.http
      .get<BalanceSheetItem[]>(`${this.baseUrl}/balance-sheet`)
      .pipe(
        this.withFallback('getBalanceSheet', () =>
          this.mockService.getBalanceSheet()
        )
      );
  }

  getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.baseUrl}/reports`).pipe(
      map((list) => list.map(this.normalizeReport)),
      this.withFallback('getReports', () => this.mockService.getReports())
    );
  }

  private withFallback<T>(
    method: string,
    fallbackFactory: () => Observable<T>
  ): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>) =>
      source.pipe(
        catchError((err) => {
          if (this.useFallback) {
            console.warn(
              `[TreasuryApiService] ${method}: API indisponível — usando dados mockados locais.`,
              err?.message ?? err
            );

            return defer(fallbackFactory);
          }

          return throwError(() => err);
        })
      );
  }

  private normalizeTransaction = (
    transaction: Transaction & {
      date: DateLike;
      createdAt?: DateLike;
      updatedAt?: DateLike;
    }
  ): Transaction => ({
    ...transaction,
    date: parseDate(transaction.date),
    createdAt: transaction.createdAt
      ? parseDate(transaction.createdAt)
      : undefined,
    updatedAt: transaction.updatedAt
      ? parseDate(transaction.updatedAt)
      : undefined,
  });

  private normalizeReport = (
    report: Report & { generatedAt: DateLike }
  ): Report => ({
    ...report,
    generatedAt: parseDate(report.generatedAt),
  });
}
