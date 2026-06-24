import { Component } from '@angular/core';

@Component({
  selector: 'app-entradas',
  template: `
    <div class="entradas-page">
      <h1>Entradas</h1>
      <p class="info-message">Integração disponível na próxima etapa.</p>
    </div>
  `,
  styles: [`
    .entradas-page {
      padding: 2rem;
    }
    
    .info-message {
      color: #616161;
      font-style: italic;
    }
  `]
})
export class EntradasComponent {}
