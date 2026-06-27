import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoBadgeComponent } from '../../../shared/components/demo-badge/demo-badge.component';
import { DATA_SERVICE_TOKEN } from '../../../core/services/data.service.token';
import { BalanceSheetItem } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-balancete',
  imports: [CommonModule, DemoBadgeComponent],
  template: `
    <div class="balancete-page">
      <div class="page-header">
        <h1>Balancete</h1>
        <app-demo-badge />
      </div>

      <div class="demo-warning">
        <p>⚠️ Modo somente leitura - Dados demonstrativos</p>
      </div>

      <div class="summary-section">
        <div class="summary-card">
          <h3>Total Débito</h3>
          <p class="total-amount debit">{{ getTotalDebit() | currency: 'BRL' }}</p>
        </div>
        <div class="summary-card">
          <h3>Total Crédito</h3>
          <p class="total-amount credit">{{ getTotalCredit() | currency: 'BRL' }}</p>
        </div>
        <div class="summary-card">
          <h3>Saldo Total</h3>
          <p class="total-amount balance" [class.negative]="getTotalBalance() < 0">
            {{ getTotalBalance() | currency: 'BRL' }}
          </p>
        </div>
      </div>

      <div class="balance-sheet-section">
        <h2>Balancete de Verificação</h2>
        <div class="balance-sheet-table">
          <table>
            <thead>
              <tr>
                <th>Conta</th>
                <th class="number">Débito</th>
                <th class="number">Crédito</th>
                <th class="number">Saldo</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of balanceSheetItems">
                <td class="account-name">{{ item.account }}</td>
                <td class="number debit">
                  {{ item.debit > 0 ? (item.debit | currency: 'BRL') : '-' }}
                </td>
                <td class="number credit">
                  {{ item.credit > 0 ? (item.credit | currency: 'BRL') : '-' }}
                </td>
                <td class="number balance" [class.negative]="item.balance < 0">
                  {{ item.balance | currency: 'BRL' }}
                </td>
              </tr>
              <tr *ngIf="balanceSheetItems.length === 0">
                <td colspan="4" class="no-data">Nenhum dado disponível</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="totals">
                <td><strong>TOTAIS</strong></td>
                <td class="number debit"><strong>{{ getTotalDebit() | currency: 'BRL' }}</strong></td>
                <td class="number credit"><strong>{{ getTotalCredit() | currency: 'BRL' }}</strong></td>
                <td class="number balance" [class.negative]="getTotalBalance() < 0">
                  <strong>{{ getTotalBalance() | currency: 'BRL' }}</strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div class="info-section">
        <div class="info-card">
          <h3>ℹ️ Sobre o Balancete</h3>
          <p>
            O balancete de verificação é um demonstrativo contábil que lista todas as contas
            do plano de contas com seus respectivos saldos devedores e credores.
          </p>
          <p>
            Este relatório é fundamental para verificar a exatidão dos lançamentos contábeis
            e garantir que o total de débitos seja igual ao total de créditos.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .balancete-page {
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
    }

    .total-amount.debit {
      color: #007bff;
    }

    .total-amount.credit {
      color: #6c757d;
    }

    .total-amount.balance {
      color: #28a745;
    }

    .total-amount.balance.negative {
      color: #dc3545;
    }

    .balance-sheet-section h2 {
      margin-bottom: 1rem;
    }

    .balance-sheet-table {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow-x: auto;
      margin-bottom: 2rem;
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

    th.number {
      text-align: right;
    }

    td {
      padding: 0.75rem;
      border-bottom: 1px solid #dee2e6;
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    td.number {
      text-align: right;
      font-family: 'Courier New', monospace;
    }

    td.account-name {
      font-weight: 500;
    }

    td.debit {
      color: #007bff;
    }

    td.credit {
      color: #6c757d;
    }

    td.balance {
      color: #28a745;
      font-weight: 600;
    }

    td.balance.negative {
      color: #dc3545;
    }

    tfoot {
      border-top: 2px solid #495057;
    }

    tfoot td {
      padding: 1rem 0.75rem;
      font-size: 1.05rem;
    }

    .no-data {
      text-align: center;
      color: #999;
      font-style: italic;
      padding: 2rem !important;
    }

    .info-section {
      margin-top: 2rem;
    }

    .info-card {
      background: #e7f3ff;
      border: 1px solid #b3d9ff;
      border-radius: 8px;
      padding: 1.5rem;
    }

    .info-card h3 {
      margin: 0 0 1rem 0;
      color: #004085;
    }

    .info-card p {
      margin: 0 0 0.75rem 0;
      color: #004085;
      line-height: 1.6;
    }

    .info-card p:last-child {
      margin-bottom: 0;
    }

    @media (max-width: 768px) {
      .balancete-page {
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

      .balance-sheet-table {
        padding: 1rem;
      }

      table {
        font-size: 0.85rem;
      }

      th, td {
        padding: 0.5rem;
      }

      .total-amount {
        font-size: 1.5rem;
      }
    }
  `]
})
export class BalanceteComponent implements OnInit {
  balanceSheetItems: BalanceSheetItem[] = [];

  private readonly dataService = inject(DATA_SERVICE_TOKEN);

  ngOnInit(): void {
    this.loadBalanceSheet();
  }

  loadBalanceSheet(): void {
    this.dataService.getBalanceSheet().subscribe((items) => {
      this.balanceSheetItems = items;
    });
  }

  getTotalDebit(): number {
    return this.balanceSheetItems.reduce((sum, item) => sum + item.debit, 0);
  }

  getTotalCredit(): number {
    return this.balanceSheetItems.reduce((sum, item) => sum + item.credit, 0);
  }

  getTotalBalance(): number {
    return this.balanceSheetItems.reduce((sum, item) => sum + item.balance, 0);
  }
}
