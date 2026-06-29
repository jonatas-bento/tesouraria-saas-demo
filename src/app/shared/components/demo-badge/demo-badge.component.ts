import { Component } from '@angular/core';

@Component({
  selector: 'app-demo-badge',
  template: `
    <div class="demo-badge">
      <span class="demo-badge-icon">🚧</span>
      <span class="demo-badge-text">Modo Demo</span>
    </div>
  `,
  styles: [`
    .demo-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #ff9900;
      color: #ffffff;
      padding: 8px 16px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 800;
      border: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: 0 10px 28px rgba(255, 153, 0, 0.26);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .demo-badge-icon {
      font-size: 15px;
    }

    .demo-badge-text {
      white-space: nowrap;
    }

    @media (max-width: 768px) {
      .demo-badge {
        position: static;
        display: inline-flex;
        font-size: 12px;
        padding: 6px 12px;
      }

      .demo-badge-icon {
        font-size: 14px;
      }
    }

    @media (max-width: 576px) {
      .demo-badge {
        font-size: 11px;
        padding: 5px 10px;
      }

      .demo-badge-text {
        display: none;
      }

      .demo-badge::after {
        content: 'DEMO';
      }
    }
  `]
})
export class DemoBadgeComponent {}
