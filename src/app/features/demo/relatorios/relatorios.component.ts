import { Component } from '@angular/core';

@Component({
  selector: 'app-relatorios',
  template: `
    <div class="relatorios-page">
      <h1>Relatórios</h1>
      <p class="info-message">Integração disponível na próxima etapa.</p>
    </div>
  `,
  styles: [`
    .relatorios-page {
      padding: 2rem;
    }
    
    .info-message {
      color: #616161;
      font-style: italic;
    }
  `]
})
export class RelatoriosComponent {}
