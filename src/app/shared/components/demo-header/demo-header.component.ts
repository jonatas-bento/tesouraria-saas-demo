import { Component, output } from '@angular/core';
import { DemoBadgeComponent } from '../demo-badge/demo-badge.component';

@Component({
  selector: 'app-demo-header',
  imports: [DemoBadgeComponent],
  templateUrl: './demo-header.component.html',
  styleUrls: ['./demo-header.component.scss'],
})
export class DemoHeaderComponent {
  menuToggle = output<void>();

  onMenuToggle(): void {
    this.menuToggle.emit();
  }
}
