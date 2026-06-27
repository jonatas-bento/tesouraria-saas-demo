import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoBadgeComponent } from '../../../shared/components/demo-badge/demo-badge.component';
import { MockDataService } from '../../../core/services/mock-data.service';
import { Report } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-relatorios',
  imports: [CommonModule, DemoBadgeComponent],
  template: `
    <div class="relatorios-page">
      <div class="page-header">
        <h1>Relatórios</h1>
        <app-demo-badge />
      </div>

      <div class="demo-warning">
        <p>⚠️ Modo somente leitura - Dados demonstrativos</p>
      </div>

      <div class="intro-section">
        <div class="intro-card">
          <h2>📊 Central de Relatórios</h2>
          <p>
            Acesse relatórios financeiros e contábeis para análise e tomada de decisão.
            Os relatórios disponíveis incluem demonstrativos mensais, trimestrais e anuais.
          </p>
        </div>
      </div>

      <div class="reports-section">
        <h2>Relatórios Disponíveis</h2>
        <div class="reports-grid">
          <div class="report-card" *ngFor="let report of reports">
            <div class="report-header">
              <span class="report-icon">{{ getReportIcon(report.type) }}</span>
              <span class="report-type-badge" [class]="report.type">
                {{ getReportTypeLabel(report.type) }}
              </span>
            </div>
            <h3>{{ report.name }}</h3>
            <div class="report-details">
              <div class="detail-item">
                <span class="label">Período:</span>
                <span class="value">{{ report.period }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Gerado em:</span>
                <span class="value">{{ report.generatedAt | date: 'dd/MM/yyyy HH:mm' }}</span>
              </div>
            </div>
            <div class="report-actions">
              <button class="btn-view" (click)="viewReport(report)">
                👁️ Visualizar
              </button>
              <button class="btn-download" (click)="downloadReport(report)">
                📥 Download
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="reports.length === 0" class="no-reports">
          <p>Nenhum relatório disponível no momento.</p>
        </div>
      </div>

      <div class="info-section">
        <div class="info-card">
          <h3>ℹ️ Sobre os Relatórios</h3>
          <ul>
            <li><strong>Relatórios Mensais:</strong> Demonstrativos detalhados das operações do mês.</li>
            <li><strong>Relatórios Trimestrais:</strong> Consolidação dos resultados do trimestre.</li>
            <li><strong>Relatórios Anuais:</strong> Balanço completo das atividades do ano.</li>
          </ul>
          <p class="note">
            <strong>Nota:</strong> Em modo demonstração, as ações de visualização e download
            apenas simulam o comportamento real do sistema.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .relatorios-page {
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

    .intro-section {
      margin-bottom: 2rem;
    }

    .intro-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .intro-card h2 {
      margin: 0 0 1rem 0;
      font-size: 1.5rem;
    }

    .intro-card p {
      margin: 0;
      line-height: 1.6;
      opacity: 0.95;
    }

    .reports-section h2 {
      margin-bottom: 1.5rem;
    }

    .reports-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .report-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .report-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .report-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .report-icon {
      font-size: 2rem;
    }

    .report-type-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .report-type-badge.monthly {
      background-color: #d1ecf1;
      color: #0c5460;
    }

    .report-type-badge.quarterly {
      background-color: #d4edda;
      color: #155724;
    }

    .report-type-badge.annual {
      background-color: #f8d7da;
      color: #721c24;
    }

    .report-card h3 {
      margin: 0 0 1rem 0;
      font-size: 1.1rem;
      color: #333;
    }

    .report-details {
      margin-bottom: 1.5rem;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }

    .detail-item .label {
      color: #666;
      font-weight: 500;
    }

    .detail-item .value {
      color: #333;
    }

    .report-actions {
      display: flex;
      gap: 0.75rem;
    }

    .report-actions button {
      flex: 1;
      padding: 0.75rem;
      border: none;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-view {
      background-color: #007bff;
      color: white;
    }

    .btn-view:hover {
      background-color: #0056b3;
    }

    .btn-download {
      background-color: #28a745;
      color: white;
    }

    .btn-download:hover {
      background-color: #1e7e34;
    }

    .no-reports {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: 8px;
      color: #999;
      font-style: italic;
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

    .info-card ul {
      margin: 0 0 1rem 0;
      padding-left: 1.5rem;
      color: #004085;
    }

    .info-card li {
      margin-bottom: 0.5rem;
      line-height: 1.6;
    }

    .info-card .note {
      margin: 1rem 0 0 0;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 4px;
      color: #004085;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .relatorios-page {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .intro-card {
        padding: 1.5rem;
      }

      .reports-grid {
        grid-template-columns: 1fr;
      }

      .report-actions {
        flex-direction: column;
      }
    }
  `]
})
export class RelatoriosComponent implements OnInit {
  reports: Report[] = [];

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.mockDataService.getReports().subscribe((reports) => {
      this.reports = reports.sort(
        (a, b) => b.generatedAt.getTime() - a.generatedAt.getTime()
      );
    });
  }

  getReportIcon(type: string): string {
    const icons: Record<string, string> = {
      monthly: '📅',
      quarterly: '📊',
      annual: '📈',
    };
    return icons[type] || '📄';
  }

  getReportTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      monthly: 'Mensal',
      quarterly: 'Trimestral',
      annual: 'Anual',
    };
    return labels[type] || type;
  }

  viewReport(report: Report): void {
    alert(
      `📄 Visualizando relatório: ${report.name}\n\n` +
      `Em um ambiente real, este relatório seria exibido em uma nova janela ou modal.\n\n` +
      `Modo demonstração - Nenhuma ação executada.`
    );
  }

  downloadReport(report: Report): void {
    alert(
      `📥 Download do relatório: ${report.name}\n\n` +
      `Em um ambiente real, o arquivo seria baixado em formato PDF ou Excel.\n\n` +
      `Modo demonstração - Nenhuma ação executada.`
    );
  }
}
