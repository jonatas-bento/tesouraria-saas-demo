import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DemoBadgeComponent } from '../../../shared/components/demo-badge/demo-badge.component';

@Component({
  selector: 'app-demo-home',
  imports: [CommonModule, RouterLink, DemoBadgeComponent],
  template: `
    <div class="demo-home-page">
      <div class="page-header">
        <h1>Bem-vindo à Demonstração</h1>
        <app-demo-badge />
      </div>

      <div class="demo-warning">
        <p>⚠️ Modo somente leitura - Dados demonstrativos</p>
      </div>

      <div class="welcome-section">
        <div class="welcome-card">
          <h2>🎯 Sistema de Tesouraria SaaS</h2>
          <p>
            Explore as funcionalidades do sistema de gestão de tesouraria.
            Todos os dados apresentados são fictícios e servem apenas para demonstração.
          </p>
          <p>
            Navegue pelos módulos disponíveis no menu lateral para conhecer as
            principais funcionalidades da plataforma.
          </p>
        </div>
      </div>

      <div class="modules-section">
        <h2>Módulos Disponíveis</h2>
        <div class="modules-grid">
          <a routerLink="/demo/dashboard" class="module-card">
            <div class="module-icon">📊</div>
            <h3>Dashboard</h3>
            <p>Visão geral das finanças com indicadores e transações recentes.</p>
          </a>

          <a routerLink="/demo/entradas" class="module-card">
            <div class="module-icon">💰</div>
            <h3>Entradas</h3>
            <p>Gestão de recebimentos e entradas financeiras.</p>
          </a>

          <a routerLink="/demo/despesas" class="module-card">
            <div class="module-icon">💸</div>
            <h3>Despesas</h3>
            <p>Controle de pagamentos e despesas operacionais.</p>
          </a>

          <a routerLink="/demo/balancete" class="module-card">
            <div class="module-icon">📋</div>
            <h3>Balancete</h3>
            <p>Balancete de verificação com débitos e créditos.</p>
          </a>

          <a routerLink="/demo/relatorios" class="module-card">
            <div class="module-icon">📈</div>
            <h3>Relatórios</h3>
            <p>Relatórios financeiros mensais, trimestrais e anuais.</p>
          </a>
        </div>
      </div>

      <div class="info-section">
        <div class="info-card">
          <h3>ℹ️ Informações Importantes</h3>
          <ul>
            <li>Esta é uma versão de demonstração com dados fictícios</li>
            <li>Nenhuma operação de escrita é permitida</li>
            <li>Não há integração com APIs ou serviços externos</li>
            <li>Os dados são carregados localmente via serviços mockados</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .demo-home-page {
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

    .welcome-section {
      margin-bottom: 2rem;
    }

    .welcome-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .welcome-card h2 {
      margin: 0 0 1rem 0;
      font-size: 1.8rem;
    }

    .welcome-card p {
      margin: 0 0 1rem 0;
      line-height: 1.6;
      opacity: 0.95;
    }

    .welcome-card p:last-child {
      margin-bottom: 0;
    }

    .modules-section h2 {
      margin-bottom: 1.5rem;
    }

    .modules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .module-card {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-decoration: none;
      color: inherit;
      transition: transform 0.2s, box-shadow 0.2s;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .module-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .module-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .module-card h3 {
      margin: 0 0 0.75rem 0;
      color: #333;
      font-size: 1.25rem;
    }

    .module-card p {
      margin: 0;
      color: #666;
      line-height: 1.5;
      font-size: 0.95rem;
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
      margin: 0;
      padding-left: 1.5rem;
      color: #004085;
    }

    .info-card li {
      margin-bottom: 0.5rem;
      line-height: 1.6;
    }

    .info-card li:last-child {
      margin-bottom: 0;
    }

    @media (max-width: 768px) {
      .demo-home-page {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .welcome-card {
        padding: 1.5rem;
      }

      .welcome-card h2 {
        font-size: 1.5rem;
      }

      .modules-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DemoHomeComponent {}
