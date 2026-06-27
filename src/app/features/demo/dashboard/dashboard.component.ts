import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoBadgeComponent } from '../../../shared/components/demo-badge/demo-badge.component';
import { DATA_SERVICE_TOKEN } from '../../../core/services/data.service.token';
import { DashboardSummary, Transaction } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, DemoBadgeComponent],
  template: `
    <div class="dashboard-page">
      <div class="page-header">
        <h1>Dashboard</h1>
        <app-demo-badge />
      </div>

      <div class="demo-warning">
        <p>⚠️ Modo somente leitura - Dados demonstrativos</p>
      </div>

      <div class="summary-cards">
        <div class="card income">
          <h3>Total de Entradas</h3>
          <p class="amount">{{ summary.totalIncome | currency: 'BRL' }}</p>
        </div>
        <div class="card expense">
          <h3>Total de Despesas</h3>
          <p class="amount">{{ summary.totalExpenses | currency: 'BRL' }}</p>
        </div>
        <div class="card balance">
          <h3>Saldo</h3>
          <p class="amount" [class.negative]="summary.balance < 0">
            {{ summary.balance | currency: 'BRL' }}
          </p>
        </div>
        <div class="card pending">
          <h3>Transações Pendentes</h3>
          <p class="amount">{{ summary.pendingTransactions }}</p>
        </div>
      </div>

      <div class="recent-transactions">
        <h2>Transações Recentes</h2>
        <div class="transactions-table">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let transaction of recentTransactions">
                <td>{{ transaction.date | date: 'dd/MM/yyyy' }}</td>
                <td>{{ transaction.description }}</td>
                <td>{{ transaction.category }}</td>
                <td>
                  <span class="badge" [class]="transaction.type">
                    {{ transaction.type === 'income' ? 'Entrada' : 'Despesa' }}
                  </span>
                </td>
                <td>
                  <span class="badge" [class]="transaction.status">
                    {{ getStatusLabel(transaction.status) }}
                  </span>
                </td>
                <td [class]="transaction.type">
                  {{ transaction.amount | currency: 'BRL' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
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

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .card h3 {
      margin: 0 0 1rem 0;
      font-size: 0.9rem;
      color: #666;
      font-weight: 500;
    }

    .card .amount {
      margin: 0;
      font-size: 1.8rem;
      font-weight: bold;
    }

    .card.income .amount {
      color: #28a745;
    }

    .card.expense .amount {
      color: #dc3545;
    }

    .card.balance .amount {
      color: #007bff;
    }

    .card.balance .amount.negative {
      color: #dc3545;
    }

    .card.pending .amount {
      color: #ffc107;
    }

    .recent-transactions h2 {
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

    .badge.income {
      background-color: #d4edda;
      color: #155724;
    }

    .badge.expense {
      background-color: #f8d7da;
      color: #721c24;
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

    td.income {
      color: #28a745;
      font-weight: 600;
    }

    td.expense {
      color: #dc3545;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .dashboard-page {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .summary-cards {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .card {
        padding: 1rem;
      }

      .card .amount {
        font-size: 1.5rem;
      }

      .transactions-table {
        padding: 0.75rem;
      }

      table {
        font-size: 0.85rem;
      }

      th, td {
        padding: 0.5rem 0.25rem;
      }
    }

    @media (max-width: 576px) {
      .dashboard-page {
        padding: 0.5rem;
      }

      .summary-cards {
        gap: 0.75rem;
      }

      .card .amount {
        font-size: 1.3rem;
      }

      table {
        font-size: 0.75rem;
      }

      th, td {
        padding: 0.4rem 0.2rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummary = {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    pendingTransactions: 0,
  };
  recentTransactions: Transaction[] = [];

  private readonly dataService = inject(DATA_SERVICE_TOKEN);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.dataService.getDashboardSummary().subscribe((summary) => {
      this.summary = summary;
    });

    this.dataService.getAllTransactions().subscribe((transactions) => {
      this.recentTransactions = transactions
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 5);
    });
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
