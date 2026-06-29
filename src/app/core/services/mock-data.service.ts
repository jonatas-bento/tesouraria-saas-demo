import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  BalanceSheetItem,
  CashBatch,
  CashBatchStatus,
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
import {
  MOCK_BALANCE_SHEET,
  MOCK_REPORTS,
  MOCK_TRANSACTIONS,
} from '../mocks/transaction.mock';

const MEMBER_SEEDS: Member[] = [
  {
    id: 'mock-member-1',
    name: 'João Carlos de Souza',
    phone: '(21) 99999-1001',
    email: 'joao.carlos@email.com',
    status: 'active',
    joinedAt: new Date('2021-03-14'),
    observations: 'Membro ativo. Atua no departamento de recepção.',
  },
  {
    id: 'mock-member-2',
    name: 'Maria Fernanda Lima',
    phone: '(21) 99999-1002',
    email: 'maria.lima@email.com',
    status: 'active',
    joinedAt: new Date('2019-08-22'),
    observations: 'Participa do ministério de louvor.',
  },
  {
    id: 'mock-member-3',
    name: 'Pedro Henrique Alves',
    phone: '(21) 99999-1003',
    email: 'pedro.alves@email.com',
    status: 'visitor',
    joinedAt: null,
    observations: 'Visitante recorrente. Acompanhando classe de novos membros.',
  },
];

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  private mockTransactions: Transaction[] = this.createInitialTransactions();
  private mockMembers: Member[] = this.createInitialMembers();
  private mockCashBatches: CashBatch[] = this.createInitialCashBatches();

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
      batchId: null,
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

  getMembers(): Observable<Member[]> {
    return of(this.mockMembers.slice());
  }

  createMember(payload: CreateMemberPayload): Observable<Member> {
    const now = new Date();

    const member: Member = {
      id: this.createId(),
      name: payload.name,
      phone: payload.phone?.trim() || null,
      email: payload.email?.trim() || null,
      status: payload.status ?? 'active',
      joinedAt: payload.joinedAt ? new Date(payload.joinedAt) : null,
      observations: payload.observations?.trim() || null,
      createdAt: now,
      updatedAt: now,
    };

    this.mockMembers = [member, ...this.mockMembers];

    return of(member);
  }

  updateMember(id: string, payload: UpdateMemberPayload): Observable<Member> {
    const index = this.mockMembers.findIndex((item) => item.id === id);

    if (index < 0) {
      throw new Error('Membro não encontrado no mock.');
    }

    const current = this.mockMembers[index];

    const updated: Member = {
      ...current,
      ...payload,
      phone:
        payload.phone !== undefined
          ? payload.phone?.trim() || null
          : current.phone,
      email:
        payload.email !== undefined
          ? payload.email?.trim() || null
          : current.email,
      joinedAt:
        payload.joinedAt !== undefined
          ? payload.joinedAt
            ? new Date(payload.joinedAt)
            : null
          : current.joinedAt,
      observations:
        payload.observations !== undefined
          ? payload.observations?.trim() || null
          : current.observations,
      updatedAt: new Date(),
    };

    this.mockMembers[index] = updated;

    return of(updated);
  }

  deleteMember(id: string): Observable<DeleteMemberResponse> {
    this.mockMembers = this.mockMembers.filter((item) => item.id !== id);

    return of({
      id,
      deleted: true,
    });
  }

  getCashBatches(): Observable<CashBatch[]> {
    return of(
      this.mockCashBatches
        .map((batch) => this.enrichCashBatch(batch))
        .sort((a, b) => b.date.getTime() - a.date.getTime())
    );
  }

  getCashBatch(id: string): Observable<CashBatch> {
    const batch = this.findCashBatch(id);

    return of(this.enrichCashBatch(batch, true));
  }

  createCashBatch(payload: CreateCashBatchPayload): Observable<CashBatch> {
    const now = new Date();

    const batch: CashBatch = {
      id: this.createId(),
      date: new Date(payload.date),
      description: payload.description,
      countedAmount: payload.countedAmount,
      countedBy: payload.countedBy,
      status: 'open',
      validatedBy: null,
      validatedAt: null,
      notes: payload.notes?.trim() || null,
      launchedAmount: 0,
      difference: payload.countedAmount,
      transactionsCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    this.mockCashBatches = [batch, ...this.mockCashBatches];

    return of(this.enrichCashBatch(batch, true));
  }

  updateCashBatch(
    id: string,
    payload: UpdateCashBatchPayload
  ): Observable<CashBatch> {
    const index = this.mockCashBatches.findIndex((item) => item.id === id);

    if (index < 0) {
      throw new Error('Lote não encontrado no mock.');
    }

    const current = this.mockCashBatches[index];

    const updated: CashBatch = {
      ...current,
      ...payload,
      date: payload.date ? new Date(payload.date) : current.date,
      notes:
        payload.notes !== undefined
          ? payload.notes?.trim() || null
          : current.notes,
      updatedAt: new Date(),
    };

    this.mockCashBatches[index] = updated;

    return of(this.enrichCashBatch(updated, true));
  }

  deleteCashBatch(id: string): Observable<DeleteCashBatchResponse> {
    this.mockCashBatches = this.mockCashBatches.filter((item) => item.id !== id);

    this.mockTransactions = this.mockTransactions.map((transaction) =>
      transaction.batchId === id ? { ...transaction, batchId: null } : transaction
    );

    return of({
      id,
      deleted: true,
    });
  }

  getAvailableTransactionsForCashBatch(id: string): Observable<Transaction[]> {
    this.findCashBatch(id);

    return of(
      this.mockTransactions
        .filter(
          (transaction) =>
            transaction.type === 'income' &&
            (!transaction.batchId || transaction.batchId === id)
        )
        .slice()
    );
  }

  attachCashBatchTransactions(
    id: string,
    transactionIds: string[]
  ): Observable<CashBatch> {
    const batch = this.findCashBatch(id);

    if (batch.status === 'validated') {
      throw new Error('Não é possível alterar um lote validado.');
    }

    const selectedIds = new Set(transactionIds);

    this.mockTransactions = this.mockTransactions.map((transaction) => {
      if (transaction.batchId === id) {
        return {
          ...transaction,
          batchId: null,
          updatedAt: new Date(),
        };
      }

      return transaction;
    });

    this.mockTransactions = this.mockTransactions.map((transaction) => {
      if (selectedIds.has(transaction.id)) {
        return {
          ...transaction,
          batchId: id,
          updatedAt: new Date(),
        };
      }

      return transaction;
    });

    batch.status = 'checking';
    batch.validatedBy = null;
    batch.validatedAt = null;
    batch.updatedAt = new Date();

    return of(this.enrichCashBatch(batch, true));
  }

  validateCashBatch(
    id: string,
    payload: ValidateCashBatchPayload
  ): Observable<CashBatch> {
    const batch = this.findCashBatch(id);
    const enriched = this.enrichCashBatch(batch, true);

    batch.status = this.getValidationStatus(
      batch.countedAmount,
      enriched.launchedAmount
    );
    batch.validatedBy = payload.validatedBy;
    batch.validatedAt = new Date();
    batch.notes = payload.notes?.trim() || batch.notes;
    batch.updatedAt = new Date();

    return of(this.enrichCashBatch(batch, true));
  }

  reopenCashBatch(id: string): Observable<CashBatch> {
    const batch = this.findCashBatch(id);

    batch.status = 'checking';
    batch.validatedBy = null;
    batch.validatedAt = null;
    batch.updatedAt = new Date();

    return of(this.enrichCashBatch(batch, true));
  }

  resetDemoData(): Observable<DemoResetResponse> {
    this.mockTransactions = this.createInitialTransactions();
    this.mockMembers = this.createInitialMembers();
    this.mockCashBatches = this.createInitialCashBatches();

    const cashBatches = this.mockCashBatches.map((batch) =>
      this.enrichCashBatch(batch)
    );

    return of({
      message: 'Dados demonstrativos restaurados com sucesso.',
      transactionsCount: this.mockTransactions.length,
      membersCount: this.mockMembers.length,
      cashBatchesCount: cashBatches.length,
      transactions: this.mockTransactions.slice(),
      members: this.mockMembers.slice(),
      cashBatches,
    });
  }

  getBalanceSheet(): Observable<BalanceSheetItem[]> {
    return of(this.mockBalanceSheet.slice());
  }

  getReports(): Observable<Report[]> {
    return of(this.mockReports.slice());
  }

  private createInitialTransactions(): Transaction[] {
    return MOCK_TRANSACTIONS.map((item) => ({
      ...item,
      date: new Date(item.date),
      batchId: item.id === '1' || item.id === '2' ? 'mock-batch-1' : null,
    }));
  }

  private createInitialMembers(): Member[] {
    return MEMBER_SEEDS.map((item) => ({
      ...item,
      joinedAt: item.joinedAt ? new Date(item.joinedAt) : null,
    }));
  }

  private createInitialCashBatches(): CashBatch[] {
    return [
      {
        id: 'mock-batch-1',
        date: new Date('2026-06-05'),
        description: 'Lote de conferência - entradas iniciais da demo',
        countedAmount: 23500,
        countedBy: 'Tesoureiro Demo',
        status: 'validated',
        validatedBy: 'Tesoureiro Demo',
        validatedAt: new Date('2026-06-05T21:00:00'),
        notes: 'Lote demonstrativo validado sem divergência.',
        launchedAmount: 0,
        difference: 0,
        transactionsCount: 0,
      },
    ];
  }

  private findCashBatch(id: string): CashBatch {
    const batch = this.mockCashBatches.find((item) => item.id === id);

    if (!batch) {
      throw new Error('Lote não encontrado no mock.');
    }

    return batch;
  }

  private enrichCashBatch(
    batch: CashBatch,
    includeTransactions = false
  ): CashBatch {
    const transactions = this.mockTransactions.filter(
      (transaction) => transaction.batchId === batch.id
    );

    const launchedAmount = transactions
      .filter((transaction) => transaction.status !== 'cancelled')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      ...batch,
      launchedAmount,
      difference: Number((batch.countedAmount - launchedAmount).toFixed(2)),
      transactionsCount: transactions.length,
      transactions: includeTransactions ? transactions.slice() : undefined,
    };
  }

  private getValidationStatus(
    countedAmount: number,
    launchedAmount: number
  ): CashBatchStatus {
    const difference = Number((countedAmount - launchedAmount).toFixed(2));

    return Math.abs(difference) < 0.01 ? 'validated' : 'divergent';
  }

  private createId(): string {
    return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`;
  }
}
