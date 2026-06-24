import { Component } from '@angular/core';

@Component({
  selector: 'app-balancete',
  template: `
    <div class="balancete-page">
      <h1>Balancete</h1>
      <p class="info-message">Integração disponível na próxima etapa.</p>
    </div>
  `,
  styles: [`
    .balancete-page {
      padding: 2rem;
    }
    
    .info-message {
      color: #616161;
      font-style: italic;
    }
  `]
})
export class BalanceteComponent {}
