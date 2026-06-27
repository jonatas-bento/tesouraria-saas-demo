/**
 * Data Service Token
 *
 * Token de injeção de dependência que abstrai a fonte de dados.
 * Os componentes injetam este token e não precisam saber se os dados
 * vêm da API real ou do mock local.
 *
 * Registro no app.config.ts decide qual implementação usar:
 *   - TreasuryApiService  → chamadas HTTP reais ao NestJS (com fallback)
 *   - MockDataService     → dados locais mockados (fallback puro)
 */

import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Transaction,
  DashboardSummary,
  BalanceSheetItem,
  Report,
} from '../models';

/** Contrato que todas as implementações do serviço de dados devem seguir */
export interface IDataService {
  getDashboardSummary(): Observable<DashboardSummary>;
  getIncomeTransactions(): Observable<Transaction[]>;
  getExpenseTransactions(): Observable<Transaction[]>;
  getBalanceSheet(): Observable<BalanceSheetItem[]>;
  getReports(): Observable<Report[]>;
  getAllTransactions(): Observable<Transaction[]>;
}

/** Token usado para injetar a implementação correta nos componentes */
export const DATA_SERVICE_TOKEN = new InjectionToken<IDataService>(
  'DataService'
);
