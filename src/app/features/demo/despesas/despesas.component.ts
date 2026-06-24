import { Component } from '@angular/core';

@Component({
  selector: 'app-despesas',
  template: `
    <div class="despesas-page">
      <h1>Despesas</h1>
      <p class="info-message">Integração disponível na próxima etapa.</p>
    </div>
  `,
  styles: [`
    .despesas-page {
      padding: 2rem;
    }
    
    .info-message {
      color: #616161;
      font-style: italic;
    }
  `]
})
export class DespesasComponent {}
