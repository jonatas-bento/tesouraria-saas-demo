import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CreateTransactionPayload,
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../../../../core/models';
import { DATA_SERVICE_TOKEN } from '../../../../core/services/data.service.token';
import { DemoBadgeComponent } from '../../../../shared/components/demo-badge/demo-badge.component';

interface TransactionFormState {
  date: string;
  description: string;
  amount: number | null;
  category: string;
  status: TransactionStatus;
}

@Component({
  selector: 'app-transactions-crud',
  imports: [CommonModule, FormsModule, DemoBadgeComponent],
  template: `
    <div class="transactions-page">
      <div class="page-header">
        <h1>{{ title }}</h1>
        <app-demo-badge />
      </div>

      <div class="demo-warning">
        <p>
          🧪 Modo demonstração - você pode criar, editar, excluir e resetar os
          dados de teste.
        </p>
      </div>

      <div class="summary-section">
        <div class="summary-card">
          <h3>Total de {{ title }}</h3>
          <p class="total-amount" [class.income]="isIncome()" [class.expense]="!isIncome()">
            {{ getTotalAmount() | currency: 'BRL' }}
          </p>
        </div>

        <div class="summary-card">
          <h3>{{ title }} Concluídas</h3>
          <p class="count">{{ getCompletedCount() }}</p>
        </div>

        <div class="summary-card">
          <h3>{{ title }} Pendentes</h3>
          <p class="count pending">{{ getPendingCount() }}</p>
        </div>
      </div>

      <div class="form-card">
        <div class="section-header">
          <h2>{{ editingId() ? 'Editar' : 'Nova' }} {{ singularLabel }}</h2>

          <button type="button" class="secondary-button" (click)="resetDemoData()">
            Resetar demo
          </button>
        </div>

        <form class="form-grid" (ngSubmit)="save()">
          <label>
            Data
            <input
              type="date"
              name="date"
              [ngModel]="form().date"
              (ngModelChange)="updateForm('date', $event)"
              required
            />
          </label>

          <label>
            Descrição
            <input
              type="text"
              name="description"
              placeholder="Ex.: Recebimento de dízimos"
              [ngModel]="form().description"
              (ngModelChange)="updateForm('description', $event)"
              required
            />
          </label>

          <label>
            Categoria
            <input
              type="text"
              name="category"
              placeholder="Ex.: Dízimos, Ofertas, Aluguel"
              [ngModel]="form().category"
              (ngModelChange)="updateForm('category', $event)"
              required
            />
          </label>

          <label>
            Valor
            <input
              type="number"
              name="amount"
              min="0.01"
              step="0.01"
              placeholder="0,00"
              [ngModel]="form().amount"
              (ngModelChange)="updateAmount($event)"
              required
            />
          </label>

          <label>
            Status
            <select
              name="status"
              [ngModel]="form().status"
              (ngModelChange)="updateForm('status', $event)"
            >
              <option value="completed">Concluído</option>
              <option value="pending">Pendente</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </label>

          <div class="form-actions">
            <button type="submit" class="primary-button" [disabled]="saving()">
              {{ saving() ? 'Salvando...' : editingId() ? 'Salvar edição' : 'Adicionar' }}
            </button>

            <button
              type="button"
              class="secondary-button"
              *ngIf="editingId()"
              (click)="cancelEdit()"
            >
              Cancelar
            </button>
          </div>
        </form>

        <p class="feedback success" *ngIf="successMessage()">
          {{ successMessage() }}
        </p>

        <p class="feedback error" *ngIf="errorMessage()">
          {{ errorMessage() }}
        </p>
      </div>

      <div class="transactions-section">
        <h2>Todas as {{ title }}</h2>

        <div class="transactions-table">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Status</th>
                <th>Valor</th>
                <th class="actions-column">Ações</th>
              </tr>
            </thead>

            <tbody>
              <tr *ngFor="let transaction of transactions()">
                <td>{{ transaction.date | date: 'dd/MM/yyyy' }}</td>
                <td>{{ transaction.description }}</td>
                <td>{{ transaction.category }}</td>
                <td>
                  <span class="badge" [class]="transaction.status">
                    {{ getStatusLabel(transaction.status) }}
                  </span>
                </td>
                <td class="amount" [class.income]="isIncome()" [class.expense]="!isIncome()">
                  {{ transaction.amount | currency: 'BRL' }}
                </td>
                <td class="actions">
                  <button type="button" class="small-button" (click)="edit(transaction)">
                    Editar
                  </button>

                  <button
                    type="button"
                    class="small-button danger"
                    (click)="remove(transaction)"
                  >
                    Excluir
                  </button>
                </td>
              </tr>

              <tr *ngIf="transactions().length === 0">
                <td colspan="6" class="no-data">
                  Nenhuma {{ singularLabel }} encontrada.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .transactions-page {
      padding: 2rem;
    }

    .page-header,
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .demo-warning {
      background-color: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 2rem;
      text-align: center;
    }

    .demo-warning p {
      margin: 0;
      color: #856404;
      font-weight: 500;
    }

    .summary-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .summary-card,
    .form-card,
    .transactions-table {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .summary-card h3 {
      margin: 0 0 1rem 0;
      font-size: 0.9rem;
      color: #666;
      font-weight: 500;
    }

    .total-amount,
    .count {
      margin: 0;
      font-size: 1.8rem;
      font-weight: bold;
    }

    .total-amount.income,
    td.amount.income {
      color: #28a745;
    }

    .total-amount.expense,
    td.amount.expense {
      color: #dc3545;
    }

    .count {
      color: #007bff;
    }

    .count.pending {
      color: #ffc107;
    }

    .form-card {
      margin-bottom: 2rem;
    }

    .form-card h2,
    .transactions-section h2 {
      margin: 0 0 1rem 0;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
      align-items: end;
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      font-weight: 600;
      color: #495057;
    }

    input,
    select {
      border: 1px solid #ced4da;
      border-radius: 8px;
      padding: 0.7rem;
      font: inherit;
    }

    .form-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    button {
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 700;
    }

    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .primary-button {
      background: #003162;
      color: white;
      padding: 0.75rem 1rem;
    }

    .secondary-button {
      background: #e9ecef;
      color: #343a40;
      padding: 0.75rem 1rem;
    }

    .small-button {
      background: #e7f3ff;
      color: #004085;
      padding: 0.45rem 0.7rem;
      font-size: 0.85rem;
    }

    .small-button.danger {
      background: #f8d7da;
      color: #721c24;
    }

    .feedback {
      margin: 1rem 0 0 0;
      font-weight: 600;
    }

    .feedback.success {
      color: #155724;
    }

    .feedback.error {
      color: #721c24;
    }

    .transactions-table {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      text-align: left;
      padding: 0.75rem;
      border-bottom: 2px solid #dee2e6;
      font-weight: 600;
      color: #495057;
    }

    td {
      padding: 0.75rem;
      border-bottom: 1px solid #dee2e6;
    }

    tr:last-child td {
      border-bottom: none;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .badge.pending {
      background-color: #fff3cd;
      color: #856404;
    }

    .badge.completed {
      background-color: #d1ecf1;
      color: #0c5460;
    }

    .badge.cancelled {
      background-color: #f8d7da;
      color: #721c24;
    }

    td.amount {
      font-weight: 700;
      font-size: 1.05rem;
    }

    .actions-column {
      width: 160px;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .no-data {
      text-align: center;
      color: #999;
      font-style: italic;
      padding: 2rem !important;
    }

    @media (max-width: 768px) {
      .transactions-page {
        padding: 1rem;
      }

      .page-header,
      .section-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .summary-section {
        grid-template-columns: 1fr;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      table {
        font-size: 0.85rem;
      }

      th,
      td {
        padding: 0.5rem;
      }
    }
  `],
})
export class TransactionsCrudComponent implements OnInit {
  @Input({ required: true }) type: TransactionType = 'income';
  @Input({ required: true }) title = 'Transações';
  @Input({ required: true }) singularLabel = 'transação';

  transactions = signal<Transaction[]>([]);
  editingId = signal<string | null>(null);
  saving = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  form = signal<TransactionFormState>(this.createEmptyForm());

  private readonly dataService = inject(DATA_SERVICE_TOKEN);

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    const request$ = this.isIncome()
      ? this.dataService.getIncomeTransactions()
      : this.dataService.getExpenseTransactions();

    request$.subscribe({
      next: (transactions) => {
        this.transactions.set(this.sortTransactions(transactions));
      },
      error: () => {
        this.errorMessage.set(`Não foi possível carregar ${this.title}.`);
      },
    });
  }

  save(): void {
    this.clearMessages();

    const form = this.form();

    if (
      !form.date ||
      !form.description.trim() ||
      !form.category.trim() ||
      !form.amount ||
      form.amount <= 0
    ) {
      this.errorMessage.set('Preencha todos os campos obrigatórios.');
      return;
    }

    const payload: CreateTransactionPayload = {
      date: form.date,
      description: form.description.trim(),
      amount: Number(form.amount),
      category: form.category.trim(),
      type: this.type,
      status: form.status,
    };

    this.saving.set(true);

    const id = this.editingId();

    const request$ = id
      ? this.dataService.updateTransaction(id, payload)
      : this.dataService.createTransaction(payload);

    request$.subscribe({
      next: () => {
        this.successMessage.set(
          id
            ? `${this.capitalize(this.singularLabel)} atualizada com sucesso.`
            : `${this.capitalize(this.singularLabel)} criada com sucesso.`
        );
        this.cancelEdit();
        this.loadTransactions();
      },
      error: () => {
        this.errorMessage.set('Não foi possível salvar a transação.');
      },
      complete: () => {
        this.saving.set(false);
      },
    });
  }

  edit(transaction: Transaction): void {
    this.clearMessages();

    this.editingId.set(transaction.id);

    this.form.set({
      date: this.toInputDate(transaction.date),
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category,
      status: transaction.status,
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  remove(transaction: Transaction): void {
    const confirmed = window.confirm(
      `Deseja excluir "${transaction.description}"?`
    );

    if (!confirmed) {
      return;
    }

    this.clearMessages();

    this.dataService.deleteTransaction(transaction.id).subscribe({
      next: () => {
        this.successMessage.set(
          `${this.capitalize(this.singularLabel)} excluída com sucesso.`
        );
        this.loadTransactions();
      },
      error: () => {
        this.errorMessage.set('Não foi possível excluir a transação.');
      },
    });
  }

  resetDemoData(): void {
    const confirmed = window.confirm(
      'Deseja restaurar os dados demonstrativos iniciais?'
    );

    if (!confirmed) {
      return;
    }

    this.clearMessages();

    this.dataService.resetDemoData().subscribe({
      next: () => {
        this.successMessage.set('Dados demonstrativos restaurados com sucesso.');
        this.cancelEdit();
        this.loadTransactions();
      },
      error: () => {
        this.errorMessage.set('Não foi possível resetar a demo.');
      },
    });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.set(this.createEmptyForm());
  }

  updateForm<K extends keyof TransactionFormState>(
    field: K,
    value: TransactionFormState[K]
  ): void {
    this.form.update((current) => ({
      ...current,
      [field]: value,
    }));
  }

  updateAmount(value: string | number | null): void {
    const amount = value === null || value === '' ? null : Number(value);
    this.updateForm('amount', amount);
  }

  getTotalAmount(): number {
    return this.transactions()
      .filter((transaction) => transaction.status === 'completed')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }

  getCompletedCount(): number {
    return this.transactions().filter(
      (transaction) => transaction.status === 'completed'
    ).length;
  }

  getPendingCount(): number {
    return this.transactions().filter(
      (transaction) => transaction.status === 'pending'
    ).length;
  }

  getStatusLabel(status: TransactionStatus): string {
    const labels: Record<TransactionStatus, string> = {
      pending: 'Pendente',
      completed: 'Concluído',
      cancelled: 'Cancelado',
    };

    return labels[status];
  }

  isIncome(): boolean {
    return this.type === 'income';
  }

  private createEmptyForm(): TransactionFormState {
    return {
      date: new Date().toISOString().slice(0, 10),
      description: '',
      amount: null,
      category: '',
      status: 'completed',
    };
  }

  private sortTransactions(transactions: Transaction[]): Transaction[] {
    return transactions
      .slice()
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  private toInputDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private clearMessages(): void {
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  private capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
