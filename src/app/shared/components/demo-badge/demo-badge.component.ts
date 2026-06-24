import { Component } from '@angular/core';

@Component({
  selector: 'app-demo-badge',
  template: `
    <div class="demo-badge">
      <span class="demo-badge-icon">🔍</span>
      <span class="demo-badge-text">Ambiente de Demonstração</span>
    </div>
  `,
  styles: [`
    @use '../../../../styles/variables' as *;

    .demo-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background-color: #fff3cd;
      color: #856404;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
      border: 1px solid #ffeaa7;
    }

    .demo-badge-icon {
      font-size: 16px;
    }

    .demo-badge-text {
      white-space: nowrap;
    }

    @media (max-width: 576px) {
      .demo-badge {
        font-size: 12px;
        padding: 6px 12px;
      }

      .demo-badge-icon {
        font-size: 14px;
      }
    }
  `]
})
export class DemoBadgeComponent {}
