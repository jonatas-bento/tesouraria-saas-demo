import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-page">
      <h1>Dashboard</h1>
      <p class="info-message">Integração disponível na próxima etapa.</p>
    </div>
  `,
  styles: [`
    .dashboard-page {
      padding: 2rem;
    }
    
    .info-message {
      color: #616161;
      font-style: italic;
    }
  `]
})
export class DashboardComponent {}
