import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoBadgeComponent } from '../../../shared/components/demo-badge/demo-badge.component';
import { DATA_SERVICE_TOKEN } from '../../../core/services/data.service.token';
import { Transaction } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-entradas',
  imports: [CommonModule, DemoBadgeComponent],
  template: `
    <div class="entradas-page">
      <div class="page-header">
        <h1>Entradas</h1>
        <app-demo-badge />
      </div>

      <div class="demo-warning">
        <p>⚠️ Modo somente leitura - Dados demonstrativos</p>
      </div>

      <div class="summary-section">
        <div class="summary-card">
          <h3>Total de Entradas</h3>
          <p class="total-amount">{{ getTotalIncome() | currency: 'BRL' }}</p>
        </div>
        <div class="summary-card">
          <h3>Entradas Concluídas</h3>
          <p class="count">{{ getCompletedCount() }}</p>
        </div>
        <div class="summary-card">
          <h3>Entradas Pendentes</h3>
          <p class="count pending">{{ getPendingCount() }}</p>
        </div>
      </div>

      <div class="transactions-section">
        <h2>Todas as Entradas</h2>
        <div class="transactions-table">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Status</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let transaction of incomeTransactions()">
                <td>{{ transaction.date | date: 'dd/MM/yyyy' }}</td>
                <td>{{ transaction.description }}</td>
                <td>{{ transaction.category }}</td>
                <td>
                  <span class="badge" [class]="transaction.status">
                    {{ getStatusLabel(transaction.status) }}
                  </span>
                </td>
                <td class="amount">
                  {{ transaction.amount | currency: 'BRL' }}
                </td>
              </tr>
              <tr *ngIf="incomeTransactions.length === 0">
                <td colspan="5" class="no-data">Nenhuma entrada encontrada</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .entradas-page {
      padding: 2rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
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

    .summary-card {
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

    .total-amount {
      margin: 0;
      font-size: 1.8rem;
      font-weight: bold;
      color: #28a745;
    }

    .count {
      margin: 0;
      font-size: 1.8rem;
      font-weight: bold;
      color: #007bff;
    }

    .count.pending {
      color: #ffc107;
    }

    .transactions-section h2 {
      margin-bottom: 1rem;
    }

    .transactions-table {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
      color: #28a745;
      font-weight: 600;
      font-size: 1.1rem;
    }

    .no-data {
      text-align: center;
      color: #999;
      font-style: italic;
      padding: 2rem !important;
    }

    @media (max-width: 768px) {
      .entradas-page {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .summary-section {
        grid-template-columns: 1fr;
      }

      .transactions-table {
        padding: 1rem;
      }

      table {
        font-size: 0.85rem;
      }

      th, td {
        padding: 0.5rem;
      }
    }
  `]
})
export class EntradasComponent implements OnInit {
  incomeTransactions = signal<Transaction[]>([]);

  private readonly dataService = inject(DATA_SERVICE_TOKEN);

  ngOnInit(): void {
    this.loadIncomeTransactions();
  }

  loadIncomeTransactions(): void {
  this.dataService.getIncomeTransactions().subscribe({
    next: (transactions) => {
      this.incomeTransactions.set(
        transactions
          .slice()
          .sort((a, b) => b.date.getTime() - a.date.getTime())
      );
    },
    error: (error) => {
      console.error('[Entradas] erro ao carregar transações:', error);
    },
  });
}

  getTotalIncome(): number {
  return this.incomeTransactions()
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
}

getCompletedCount(): number {
  return this.incomeTransactions().filter((t) => t.status === 'completed').length;
}

getPendingCount(): number {
  return this.incomeTransactions().filter((t) => t.status === 'pending').length;
}

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pendente',
      completed: 'Concluído',
      cancelled: 'Cancelado',
    };
    return labels[status] || status;
  }
}
