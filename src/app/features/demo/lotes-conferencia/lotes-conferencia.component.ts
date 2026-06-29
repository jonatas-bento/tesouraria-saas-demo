import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CashBatch,
  CashBatchStatus,
  CreateCashBatchPayload,
  Transaction,
} from '../../../core/models';
import { DATA_SERVICE_TOKEN } from '../../../core/services/data.service.token';
import { DemoBadgeComponent } from '../../../shared/components/demo-badge/demo-badge.component';

interface CashBatchFormState {
  date: string;
  description: string;
  countedAmount: number | null;
  countedBy: string;
  notes: string;
}

interface ValidationFormState {
  validatedBy: string;
  notes: string;
}

@Component({
  selector: 'app-lotes-conferencia',
  imports: [CommonModule, FormsModule, DemoBadgeComponent],
  template: `
    <div class="batches-page">
      <div class="page-header">
        <div>
          <h1>Tesouraria · Lotes de Conferência</h1>
          <p>
            Validação do dinheiro contado fisicamente contra as entradas lançadas.
          </p>
        </div>
        <app-demo-badge />
      </div>

      <div class="demo-warning">
        <p>
          🧪 Modo demonstração - o lote evidencia conferência, vínculo das entradas,
          diferença e validação do tesoureiro.
        </p>
      </div>

      <div class="summary-section">
        <div class="summary-card">
          <h3>Total de Lotes</h3>
          <p class="count">{{ batches().length }}</p>
        </div>

        <div class="summary-card">
          <h3>Validados</h3>
          <p class="count success">{{ getStatusCount('validated') }}</p>
        </div>

        <div class="summary-card">
          <h3>Divergentes</h3>
          <p class="count danger">{{ getStatusCount('divergent') }}</p>
        </div>

        <div class="summary-card">
          <h3>Em Conferência</h3>
          <p class="count warning">
            {{ getStatusCount('open') + getStatusCount('checking') }}
          </p>
        </div>
      </div>

      <div class="form-card">
        <div class="section-header">
          <h2>Novo lote</h2>

          <button type="button" class="secondary-button" (click)="resetDemoData()">
            Resetar demo
          </button>
        </div>

        <form class="form-grid" (ngSubmit)="createBatch()">
          <label>
            Data do lote
            <input
              type="date"
              name="date"
              [ngModel]="form().date"
              (ngModelChange)="updateForm('date', $event)"
              required
            />
          </label>

          <label>
            Valor contado
            <input
              type="number"
              name="countedAmount"
              min="0"
              step="0.01"
              placeholder="0,00"
              [ngModel]="form().countedAmount"
              (ngModelChange)="updateAmount($event)"
              required
            />
          </label>

          <label>
            Contado por
            <input
              type="text"
              name="countedBy"
              placeholder="Nome do tesoureiro"
              [ngModel]="form().countedBy"
              (ngModelChange)="updateForm('countedBy', $event)"
              required
            />
          </label>

          <label class="wide">
            Descrição
            <input
              type="text"
              name="description"
              placeholder="Ex.: Lote do culto dominical"
              [ngModel]="form().description"
              (ngModelChange)="updateForm('description', $event)"
              required
            />
          </label>

          <label class="wide">
            Observações
            <textarea
              name="notes"
              rows="3"
              placeholder="Observações da contagem física"
              [ngModel]="form().notes"
              (ngModelChange)="updateForm('notes', $event)"
            ></textarea>
          </label>

          <div class="form-actions">
            <button type="submit" class="primary-button" [disabled]="saving()">
              {{ saving() ? 'Criando...' : 'Criar lote' }}
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

      <div class="content-grid">
        <div class="batches-card">
          <h2>Lotes</h2>

          <div class="batches-list">
            <button
              type="button"
              class="batch-item"
              *ngFor="let batch of batches()"
              [class.selected]="selectedBatch()?.id === batch.id"
              (click)="selectBatch(batch)"
            >
              <div>
                <strong>{{ batch.description }}</strong>
                <small>{{ batch.date | date: 'dd/MM/yyyy' }}</small>
              </div>

              <div class="batch-meta">
                <span class="badge" [class]="batch.status">
                  {{ getStatusLabel(batch.status) }}
                </span>
                <span>{{ batch.launchedAmount | currency: 'BRL' }}</span>
              </div>
            </button>

            <p class="no-data" *ngIf="batches().length === 0">
              Nenhum lote cadastrado.
            </p>
          </div>
        </div>

        <div class="details-card" *ngIf="selectedBatch(); else emptySelection">
          <div class="section-header">
            <div>
              <h2>{{ selectedBatch()?.description }}</h2>
              <p>
                Lote de {{ selectedBatch()?.date | date: 'dd/MM/yyyy' }}
              </p>
            </div>

            <div class="actions">
              <button
                type="button"
                class="small-button"
                *ngIf="selectedBatch()?.status === 'validated' || selectedBatch()?.status === 'divergent'"
                (click)="reopenSelectedBatch()"
              >
                Reabrir
              </button>

              <button
                type="button"
                class="small-button danger"
                (click)="deleteSelectedBatch()"
              >
                Excluir
              </button>
            </div>
          </div>

          <div class="validation-grid">
            <div class="validation-card">
              <span>Valor contado</span>
              <strong>{{ selectedBatch()?.countedAmount | currency: 'BRL' }}</strong>
            </div>

            <div class="validation-card">
              <span>Valor lançado</span>
              <strong>{{ selectedBatch()?.launchedAmount | currency: 'BRL' }}</strong>
            </div>

            <div class="validation-card">
              <span>Diferença</span>
              <strong [class.negative]="(selectedBatch()?.difference ?? 0) !== 0">
                {{ selectedBatch()?.difference | currency: 'BRL' }}
              </strong>
            </div>

            <div class="validation-card">
              <span>Status</span>
              <strong>{{ getStatusLabel(selectedBatch()?.status || 'open') }}</strong>
            </div>
          </div>

          <div class="batch-notes" *ngIf="selectedBatch()?.notes">
            <strong>Observações:</strong>
            <p>{{ selectedBatch()?.notes }}</p>
          </div>

          <div class="transactions-card">
            <h3>Entradas disponíveis para vínculo</h3>
            <p class="helper">
              Selecione as entradas que pertencem a este lote. O sistema somará os
              valores e comparará com o dinheiro contado.
            </p>

            <div class="transactions-list">
              <label
                class="transaction-item"
                *ngFor="let transaction of availableTransactions()"
              >
                <input
                  type="checkbox"
                  [checked]="isTransactionSelected(transaction.id)"
                  [disabled]="selectedBatch()?.status === 'validated'"
                  (change)="toggleTransactionSelection(transaction.id, $event)"
                />

                <div>
                  <strong>{{ transaction.description }}</strong>
                  <small>
                    {{ transaction.date | date: 'dd/MM/yyyy' }} ·
                    {{ transaction.category }} ·
                    {{ getTransactionStatusLabel(transaction.status) }}
                  </small>
                </div>

                <span>{{ transaction.amount | currency: 'BRL' }}</span>
              </label>

              <p class="no-data" *ngIf="availableTransactions().length === 0">
                Nenhuma entrada disponível para este lote. Cadastre uma nova entrada
                financeira ou utilize uma entrada que ainda não esteja vinculada a outro lote.
              </p>
            </div>

            <div class="selection-summary">
              <span>Selecionado:</span>
              <strong>{{ getSelectedTotal() | currency: 'BRL' }}</strong>

              <span>Diferença prevista:</span>
              <strong [class.negative]="getPreviewDifference() !== 0">
                {{ getPreviewDifference() | currency: 'BRL' }}
              </strong>
            </div>

            <button
              type="button"
              class="primary-button"
              [disabled]="!selectedBatch() || selectedBatch()?.status === 'validated' || selectedTransactionIds().length === 0"
              (click)="attachTransactions()"
            >
              Vincular entradas selecionadas
            </button>
          </div>

          <div class="validate-card">
            <h3>Validação do tesoureiro</h3>

            <div class="form-grid">
              <label>
                Validado por
                <input
                  type="text"
                  name="validatedBy"
                  [ngModel]="validationForm().validatedBy"
                  (ngModelChange)="updateValidationForm('validatedBy', $event)"
                />
              </label>

              <label class="wide">
                Observação da validação
                <textarea
                  name="validationNotes"
                  rows="3"
                  [ngModel]="validationForm().notes"
                  (ngModelChange)="updateValidationForm('notes', $event)"
                ></textarea>
              </label>

              <div class="form-actions">
                <button
                  type="button"
                  class="primary-button"
                  [disabled]="!selectedBatch() || selectedBatch()?.status === 'validated'"
                  (click)="validateSelectedBatch()"
                >
                  Validar lote
                </button>
              </div>
            </div>

            <p class="validated-info" *ngIf="selectedBatch()?.validatedBy">
              Validado por {{ selectedBatch()?.validatedBy }}
              em {{ selectedBatch()?.validatedAt | date: 'dd/MM/yyyy HH:mm' }}.
            </p>
          </div>
        </div>

        <ng-template #emptySelection>
          <div class="details-card empty">
            <h2>Selecione um lote</h2>
            <p>
              Escolha um lote à esquerda para vincular entradas, conferir valores
              e registrar a validação.
            </p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .batches-page {
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

    .page-header h1,
    .section-header h2 {
      margin: 0 0 0.35rem 0;
    }

    .page-header p,
    .section-header p {
      margin: 0;
      color: #6c757d;
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
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .summary-card,
    .form-card,
    .batches-card,
    .details-card,
    .validation-card,
    .transactions-card,
    .validate-card {
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

    .count {
      margin: 0;
      font-size: 1.8rem;
      font-weight: bold;
      color: #003162;
    }

    .count.success {
      color: #28a745;
    }

    .count.danger {
      color: #dc3545;
    }

    .count.warning {
      color: #ffc107;
    }

    .form-card {
      margin-bottom: 2rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
      align-items: end;
    }

    .wide {
      grid-column: 1 / -1;
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      font-weight: 600;
      color: #495057;
    }

    input,
    textarea {
      border: 1px solid #ced4da;
      border-radius: 8px;
      padding: 0.7rem;
      font: inherit;
    }

    textarea {
      resize: vertical;
    }

    .form-actions,
    .actions {
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
      opacity: 0.6;
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

    .content-grid {
      display: grid;
      grid-template-columns: minmax(280px, 360px) 1fr;
      gap: 1.5rem;
      align-items: start;
    }

    .batches-card h2,
    .details-card h2 {
      margin-top: 0;
    }

    .batches-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .batch-item {
      width: 100%;
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      padding: 1rem;
      text-align: left;
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      align-items: center;
    }

    .batch-item.selected {
      border-color: #003162;
      box-shadow: 0 0 0 2px rgba(0, 49, 98, 0.12);
    }

    .batch-item strong,
    .transaction-item strong {
      display: block;
      color: #212529;
    }

    .batch-item small,
    .transaction-item small {
      display: block;
      color: #6c757d;
      margin-top: 0.25rem;
    }

    .batch-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.4rem;
      color: #495057;
      font-size: 0.9rem;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 700;
      white-space: nowrap;
    }

    .badge.open {
      background: #e2e3e5;
      color: #383d41;
    }

    .badge.checking {
      background: #fff3cd;
      color: #856404;
    }

    .badge.validated {
      background: #d4edda;
      color: #155724;
    }

    .badge.divergent {
      background: #f8d7da;
      color: #721c24;
    }

    .validation-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .validation-card {
      background: #f8f9fa;
      box-shadow: none;
      border: 1px solid #e9ecef;
    }

    .validation-card span {
      display: block;
      color: #6c757d;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    .validation-card strong {
      font-size: 1.25rem;
      color: #003162;
    }

    .negative {
      color: #dc3545 !important;
    }

    .batch-notes {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1.5rem;
      color: #495057;
    }

    .batch-notes p {
      margin: 0.5rem 0 0 0;
    }

    .transactions-card,
    .validate-card {
      margin-top: 1.5rem;
      box-shadow: none;
      border: 1px solid #e9ecef;
    }

    .transactions-card h3,
    .validate-card h3 {
      margin-top: 0;
    }

    .helper {
      color: #6c757d;
      line-height: 1.5;
    }

    .transactions-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin: 1rem 0;
    }

    .transaction-item {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 0.85rem;
      gap: 1rem;
    }

    .transaction-item input {
      width: 18px;
      height: 18px;
    }

    .selection-summary {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      align-items: center;
      background: #e7f3ff;
      color: #004085;
      border-radius: 8px;
      padding: 1rem;
      margin: 1rem 0;
    }

    .validated-info {
      margin: 1rem 0 0 0;
      color: #155724;
      font-weight: 600;
    }

    .empty {
      text-align: center;
      color: #6c757d;
    }

    .no-data {
      text-align: center;
      color: #999;
      font-style: italic;
      padding: 1rem;
    }

    @media (max-width: 992px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .batches-page {
        padding: 1rem;
      }

      .page-header,
      .section-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .summary-section,
      .form-grid,
      .validation-grid {
        grid-template-columns: 1fr;
      }

      .transaction-item {
        grid-template-columns: auto 1fr;
      }

      .transaction-item span {
        grid-column: 2;
      }
    }
  `],
})
export class LotesConferenciaComponent implements OnInit {
  batches = signal<CashBatch[]>([]);
  selectedBatch = signal<CashBatch | null>(null);
  availableTransactions = signal<Transaction[]>([]);
  selectedTransactionIds = signal<string[]>([]);

  saving = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  form = signal<CashBatchFormState>(this.createEmptyForm());
  validationForm = signal<ValidationFormState>({
    validatedBy: 'Tesoureiro Demo',
    notes: '',
  });

  private readonly dataService = inject(DATA_SERVICE_TOKEN);

  ngOnInit(): void {
    this.loadBatches();
  }

  loadBatches(): void {
    this.dataService.getCashBatches().subscribe({
      next: (batches) => {
        this.batches.set(batches);
      },
      error: () => {
        this.errorMessage.set('Não foi possível carregar os lotes.');
      },
    });
  }

  createBatch(): void {
    this.clearMessages();

    const form = this.form();

    if (!form.date || !form.description.trim() || !form.countedBy.trim()) {
      this.errorMessage.set('Preencha data, descrição e responsável pela contagem.');
      return;
    }

    if (form.countedAmount === null || form.countedAmount < 0) {
      this.errorMessage.set('Informe um valor contado válido.');
      return;
    }

    const payload: CreateCashBatchPayload = {
      date: form.date,
      description: form.description.trim(),
      countedAmount: form.countedAmount,
      countedBy: form.countedBy.trim(),
      notes: form.notes.trim(),
    };

    this.saving.set(true);

    this.dataService.createCashBatch(payload).subscribe({
      next: (batch) => {
        this.successMessage.set('Lote criado com sucesso.');
        this.form.set(this.createEmptyForm());
        this.loadBatches();
        this.selectBatch(batch);
      },
      error: () => {
        this.errorMessage.set('Não foi possível criar o lote.');
      },
      complete: () => {
        this.saving.set(false);
      },
    });
  }

  selectBatch(batch: CashBatch): void {
    this.clearMessages();

    this.dataService.getCashBatch(batch.id).subscribe({
      next: (loadedBatch) => {
        this.selectedBatch.set(loadedBatch);
        this.selectedTransactionIds.set(
          loadedBatch.transactions?.map((transaction) => transaction.id) ?? []
        );
        this.loadAvailableTransactions(loadedBatch.id);
      },
      error: () => {
        this.errorMessage.set('Não foi possível carregar o lote selecionado.');
      },
    });
  }

  loadAvailableTransactions(batchId: string): void {
    this.dataService.getAvailableTransactionsForCashBatch(batchId).subscribe({
      next: (transactions) => {
        this.availableTransactions.set(transactions);
      },
      error: () => {
        this.errorMessage.set('Não foi possível carregar as entradas disponíveis.');
      },
    });
  }

  attachTransactions(): void {
    const batch = this.selectedBatch();

    if (!batch) {
      return;
    }

    this.clearMessages();

    this.dataService
      .attachCashBatchTransactions(batch.id, this.selectedTransactionIds())
      .subscribe({
        next: (updatedBatch) => {
          this.successMessage.set('Entradas vinculadas ao lote com sucesso.');
          this.selectedBatch.set(updatedBatch);
          this.selectedTransactionIds.set(
            updatedBatch.transactions?.map((transaction) => transaction.id) ?? []
          );
          this.loadBatches();
          this.loadAvailableTransactions(updatedBatch.id);
        },
        error: () => {
          this.errorMessage.set('Não foi possível vincular as entradas.');
        },
      });
  }

  validateSelectedBatch(): void {
    const batch = this.selectedBatch();

    if (!batch) {
      return;
    }

    const validation = this.validationForm();

    if (!validation.validatedBy.trim()) {
      this.errorMessage.set('Informe quem validou o lote.');
      return;
    }

    this.clearMessages();

    this.dataService
      .validateCashBatch(batch.id, {
        validatedBy: validation.validatedBy.trim(),
        notes: validation.notes.trim(),
      })
      .subscribe({
        next: (updatedBatch) => {
          this.successMessage.set(
            updatedBatch.status === 'validated'
              ? 'Lote validado sem divergência.'
              : 'Lote validado com divergência.'
          );
          this.selectedBatch.set(updatedBatch);
          this.loadBatches();
          this.loadAvailableTransactions(updatedBatch.id);
        },
        error: () => {
          this.errorMessage.set('Não foi possível validar o lote.');
        },
      });
  }

  reopenSelectedBatch(): void {
    const batch = this.selectedBatch();

    if (!batch) {
      return;
    }

    this.clearMessages();

    this.dataService.reopenCashBatch(batch.id).subscribe({
      next: (updatedBatch) => {
        this.successMessage.set('Lote reaberto para conferência.');
        this.selectedBatch.set(updatedBatch);
        this.selectedTransactionIds.set(
          updatedBatch.transactions?.map((transaction) => transaction.id) ?? []
        );
        this.loadBatches();
        this.loadAvailableTransactions(updatedBatch.id);
      },
      error: () => {
        this.errorMessage.set('Não foi possível reabrir o lote.');
      },
    });
  }

  deleteSelectedBatch(): void {
    const batch = this.selectedBatch();

    if (!batch) {
      return;
    }

    const confirmed = window.confirm(`Deseja excluir o lote "${batch.description}"?`);

    if (!confirmed) {
      return;
    }

    this.clearMessages();

    this.dataService.deleteCashBatch(batch.id).subscribe({
      next: () => {
        this.successMessage.set('Lote excluído com sucesso.');
        this.selectedBatch.set(null);
        this.selectedTransactionIds.set([]);
        this.availableTransactions.set([]);
        this.loadBatches();
      },
      error: () => {
        this.errorMessage.set('Não foi possível excluir o lote.');
      },
    });
  }

  resetDemoData(): void {
    const confirmed = window.confirm(
      'Deseja restaurar todos os dados demonstrativos?'
    );

    if (!confirmed) {
      return;
    }

    this.clearMessages();

    this.dataService.resetDemoData().subscribe({
      next: () => {
        this.successMessage.set('Dados demonstrativos restaurados com sucesso.');
        this.selectedBatch.set(null);
        this.selectedTransactionIds.set([]);
        this.availableTransactions.set([]);
        this.loadBatches();
      },
      error: () => {
        this.errorMessage.set('Não foi possível resetar a demo.');
      },
    });
  }

  toggleTransactionSelection(transactionId: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    this.selectedTransactionIds.update((current) => {
      if (checked) {
        return current.includes(transactionId)
          ? current
          : [...current, transactionId];
      }

      return current.filter((id) => id !== transactionId);
    });
  }

  isTransactionSelected(transactionId: string): boolean {
    return this.selectedTransactionIds().includes(transactionId);
  }

  getSelectedTotal(): number {
    const selectedIds = new Set(this.selectedTransactionIds());

    return this.availableTransactions()
      .filter(
        (transaction) =>
          selectedIds.has(transaction.id) && transaction.status !== 'cancelled'
      )
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }

  getPreviewDifference(): number {
    const batch = this.selectedBatch();

    if (!batch) {
      return 0;
    }

    return Number((batch.countedAmount - this.getSelectedTotal()).toFixed(2));
  }

  getStatusCount(status: CashBatchStatus): number {
    return this.batches().filter((batch) => batch.status === status).length;
  }

  getStatusLabel(status: CashBatchStatus): string {
    const labels: Record<CashBatchStatus, string> = {
      open: 'Aberto',
      checking: 'Em conferência',
      validated: 'Validado',
      divergent: 'Divergente',
    };

    return labels[status];
  }

  getTransactionStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pendente',
      completed: 'Concluída',
      cancelled: 'Cancelada',
    };

    return labels[status] ?? status;
  }

  updateForm<K extends keyof CashBatchFormState>(
    field: K,
    value: CashBatchFormState[K]
  ): void {
    this.form.update((current) => ({
      ...current,
      [field]: value,
    }));
  }

  updateAmount(value: number | string | null): void {
    const parsed = value === null || value === '' ? null : Number(value);

    this.form.update((current) => ({
      ...current,
      countedAmount: Number.isNaN(parsed) ? null : parsed,
    }));
  }

  updateValidationForm<K extends keyof ValidationFormState>(
    field: K,
    value: ValidationFormState[K]
  ): void {
    this.validationForm.update((current) => ({
      ...current,
      [field]: value,
    }));
  }

  private createEmptyForm(): CashBatchFormState {
    return {
      date: new Date().toISOString().slice(0, 10),
      description: '',
      countedAmount: null,
      countedBy: 'Tesoureiro Demo',
      notes: '',
    };
  }

  private clearMessages(): void {
    this.successMessage.set('');
    this.errorMessage.set('');
  }
}
