import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, defer, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
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
import { IDataService } from './data.service.token';
import { MockDataService } from './mock-data.service';

type DateLike = string | Date;

function parseDate(value: DateLike): Date {
  return value instanceof Date ? value : new Date(value);
}

function parseNullableDate(value: DateLike | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  return parseDate(value);
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

  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.baseUrl}/members`).pipe(
      map((list) => list.map(this.normalizeMember)),
      this.withFallback('getMembers', () => this.mockService.getMembers())
    );
  }

  createMember(payload: CreateMemberPayload): Observable<Member> {
    return this.http.post<Member>(`${this.baseUrl}/members`, payload).pipe(
      map(this.normalizeMember),
      this.withFallback('createMember', () =>
        this.mockService.createMember(payload)
      )
    );
  }

  updateMember(id: string, payload: UpdateMemberPayload): Observable<Member> {
    return this.http.patch<Member>(`${this.baseUrl}/members/${id}`, payload).pipe(
      map(this.normalizeMember),
      this.withFallback('updateMember', () =>
        this.mockService.updateMember(id, payload)
      )
    );
  }

  deleteMember(id: string): Observable<DeleteMemberResponse> {
    return this.http.delete<DeleteMemberResponse>(`${this.baseUrl}/members/${id}`).pipe(
      this.withFallback('deleteMember', () => this.mockService.deleteMember(id))
    );
  }

  getCashBatches(): Observable<CashBatch[]> {
    return this.http.get<CashBatch[]>(`${this.baseUrl}/cash-batches`).pipe(
      map((list) => list.map(this.normalizeCashBatch)),
      this.withFallback('getCashBatches', () =>
        this.mockService.getCashBatches()
      )
    );
  }

  getCashBatch(id: string): Observable<CashBatch> {
    return this.http.get<CashBatch>(`${this.baseUrl}/cash-batches/${id}`).pipe(
      map(this.normalizeCashBatch),
      this.withFallback('getCashBatch', () => this.mockService.getCashBatch(id))
    );
  }

  createCashBatch(payload: CreateCashBatchPayload): Observable<CashBatch> {
    return this.http.post<CashBatch>(`${this.baseUrl}/cash-batches`, payload).pipe(
      map(this.normalizeCashBatch),
      this.withFallback('createCashBatch', () =>
        this.mockService.createCashBatch(payload)
      )
    );
  }

  updateCashBatch(
    id: string,
    payload: UpdateCashBatchPayload
  ): Observable<CashBatch> {
    return this.http.patch<CashBatch>(`${this.baseUrl}/cash-batches/${id}`, payload).pipe(
      map(this.normalizeCashBatch),
      this.withFallback('updateCashBatch', () =>
        this.mockService.updateCashBatch(id, payload)
      )
    );
  }

  deleteCashBatch(id: string): Observable<DeleteCashBatchResponse> {
    return this.http.delete<DeleteCashBatchResponse>(`${this.baseUrl}/cash-batches/${id}`).pipe(
      this.withFallback('deleteCashBatch', () =>
        this.mockService.deleteCashBatch(id)
      )
    );
  }

  getAvailableTransactionsForCashBatch(id: string): Observable<Transaction[]> {
    return this.http
      .get<Transaction[]>(`${this.baseUrl}/cash-batches/${id}/available-transactions`)
      .pipe(
        map((list) => list.map(this.normalizeTransaction)),
        this.withFallback('getAvailableTransactionsForCashBatch', () =>
          this.mockService.getAvailableTransactionsForCashBatch(id)
        )
      );
  }

  attachCashBatchTransactions(
    id: string,
    transactionIds: string[]
  ): Observable<CashBatch> {
    return this.http
      .post<CashBatch>(`${this.baseUrl}/cash-batches/${id}/attach-transactions`, {
        transactionIds,
      })
      .pipe(
        map(this.normalizeCashBatch),
        this.withFallback('attachCashBatchTransactions', () =>
          this.mockService.attachCashBatchTransactions(id, transactionIds)
        )
      );
  }

  validateCashBatch(
    id: string,
    payload: ValidateCashBatchPayload
  ): Observable<CashBatch> {
    return this.http
      .post<CashBatch>(`${this.baseUrl}/cash-batches/${id}/validate`, payload)
      .pipe(
        map(this.normalizeCashBatch),
        this.withFallback('validateCashBatch', () =>
          this.mockService.validateCashBatch(id, payload)
        )
      );
  }

  reopenCashBatch(id: string): Observable<CashBatch> {
    return this.http
      .post<CashBatch>(`${this.baseUrl}/cash-batches/${id}/reopen`, {})
      .pipe(
        map(this.normalizeCashBatch),
        this.withFallback('reopenCashBatch', () =>
          this.mockService.reopenCashBatch(id)
        )
      );
  }

  resetDemoData(): Observable<DemoResetResponse> {
    return this.http.post<DemoResetResponse>(`${this.baseUrl}/demo/reset`, {}).pipe(
      map((response) => ({
        ...response,
        transactions: response.transactions.map(this.normalizeTransaction),
        members: response.members?.map(this.normalizeMember),
        cashBatches: response.cashBatches?.map(this.normalizeCashBatch),
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
    batchId: transaction.batchId ?? null,
    createdAt: transaction.createdAt
      ? parseDate(transaction.createdAt)
      : undefined,
    updatedAt: transaction.updatedAt
      ? parseDate(transaction.updatedAt)
      : undefined,
  });

  private normalizeMember = (
    member: Member & {
      joinedAt?: DateLike | null;
      createdAt?: DateLike;
      updatedAt?: DateLike;
    }
  ): Member => ({
    ...member,
    joinedAt: parseNullableDate(member.joinedAt),
    createdAt: member.createdAt ? parseDate(member.createdAt) : undefined,
    updatedAt: member.updatedAt ? parseDate(member.updatedAt) : undefined,
  });

  private normalizeCashBatch = (
    cashBatch: CashBatch & {
      date: DateLike;
      validatedAt?: DateLike | null;
      createdAt?: DateLike;
      updatedAt?: DateLike;
      transactions?: Array<Transaction & { date: DateLike }>;
    }
  ): CashBatch => ({
    ...cashBatch,
    date: parseDate(cashBatch.date),
    validatedAt: parseNullableDate(cashBatch.validatedAt),
    createdAt: cashBatch.createdAt ? parseDate(cashBatch.createdAt) : undefined,
    updatedAt: cashBatch.updatedAt ? parseDate(cashBatch.updatedAt) : undefined,
    transactions: cashBatch.transactions?.map(this.normalizeTransaction),
  });

  private normalizeReport = (
    report: Report & { generatedAt: DateLike }
  ): Report => ({
    ...report,
    generatedAt: parseDate(report.generatedAt),
  });
}
