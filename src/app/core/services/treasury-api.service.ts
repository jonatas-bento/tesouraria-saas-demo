/**
 * Treasury API Service
 *
 * Serviço que consome a API REST do backend NestJS (somente leitura).
 * Implementa a interface IDataService, portanto é intercambiável com MockDataService.
 *
 * Estratégia de fallback:
 *   - Tenta a chamada HTTP ao backend.
 *   - Se o backend estiver indisponível (conexão recusada, timeout, 5xx) e o
 *     ambiente tiver `useMockFallback: true`, loga um aviso no console e
 *     devolve os dados mockados locais de forma transparente.
 *   - Se `useMockFallback: false` (produção), o erro é re-lançado.
 *
 * Endpoints consumidos (GET somente — modo read-only):
 *   GET /api/dashboard              → DashboardSummary
 *   GET /api/transactions           → Transaction[]
 *   GET /api/transactions?type=income  → Transaction[] (entradas)
 *   GET /api/transactions?type=expense → Transaction[] (despesas)
 *   GET /api/balance-sheet          → BalanceSheetItem[]
 *   GET /api/reports                → Report[]
 */

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import {
  BalanceSheetItem,
  DashboardSummary,
  Report,
  Transaction,
} from '../models';
import { IDataService } from './data.service.token';
import { MockDataService } from './mock-data.service';

/** Representa o formato de data que a API pode retornar (string ISO ou objeto Date) */
type DateLike = string | Date;

/** Normaliza campos de data que vêm como string ISO do JSON */
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

  // ─── Dashboard ───────────────────────────────────────────────────────────────

  getDashboardSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.baseUrl}/dashboard`).pipe(
      this.withFallback('getDashboardSummary', this.mockService.getDashboardSummary())
    );
  }

  // ─── Transactions ─────────────────────────────────────────────────────────────

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.baseUrl}/transactions`).pipe(
      map((list) => list.map(this.normalizeTransaction)),
      this.withFallback('getAllTransactions', this.mockService.getAllTransactions())
    );
  }

  getIncomeTransactions(): Observable<Transaction[]> {
    return this.http
      .get<Transaction[]>(`${this.baseUrl}/transactions`, {
        params: { type: 'income' },
      })
      .pipe(
        map((list) => list.map(this.normalizeTransaction)),
        this.withFallback('getIncomeTransactions', this.mockService.getIncomeTransactions())
      );
  }

  getExpenseTransactions(): Observable<Transaction[]> {
    return this.http
      .get<Transaction[]>(`${this.baseUrl}/transactions`, {
        params: { type: 'expense' },
      })
      .pipe(
        map((list) => list.map(this.normalizeTransaction)),
        this.withFallback('getExpenseTransactions', this.mockService.getExpenseTransactions())
      );
  }

  // ─── Balance Sheet ────────────────────────────────────────────────────────────

  getBalanceSheet(): Observable<BalanceSheetItem[]> {
    return this.http
      .get<BalanceSheetItem[]>(`${this.baseUrl}/balance-sheet`)
      .pipe(
        this.withFallback('getBalanceSheet', this.mockService.getBalanceSheet())
      );
  }

  // ─── Reports ──────────────────────────────────────────────────────────────────

  getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.baseUrl}/reports`).pipe(
      map((list) => list.map(this.normalizeReport)),
      this.withFallback('getReports', this.mockService.getReports())
    );
  }

  // ─── Private helpers ─────────────────────────────────────────────────────────

  /**
   * Operador RxJS que captura qualquer erro HTTP e, se fallback estiver habilitado,
   * retorna o Observable de mock local. Caso contrário, re-lança o erro.
   */
  private withFallback<T>(
    method: string,
    fallback$: Observable<T>
  ): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>) =>
      source.pipe(
        catchError((err) => {
          if (this.useFallback) {
            console.warn(
              `[TreasuryApiService] ${method}: API indisponível — usando dados mockados locais.`,
              err?.message ?? err
            );
            return fallback$;
          }
          throw err;
        })
      );
  }

  /** Garante que o campo `date` de Transaction seja um objeto Date */
  private normalizeTransaction(t: Transaction & { date: DateLike }): Transaction {
    return { ...t, date: parseDate(t.date) };
  }

  /** Garante que o campo `generatedAt` de Report seja um objeto Date */
  private normalizeReport(r: Report & { generatedAt: DateLike }): Report {
    return { ...r, generatedAt: parseDate(r.generatedAt) };
  }
}
