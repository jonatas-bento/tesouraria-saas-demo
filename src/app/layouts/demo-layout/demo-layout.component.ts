import { Component, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { DemoHeaderComponent } from '../../shared/components/demo-header/demo-header.component';

@Component({
  selector: 'app-demo-layout',
  imports: [RouterOutlet, SidebarComponent, DemoHeaderComponent],
  templateUrl: './demo-layout.component.html',
  styleUrls: ['./demo-layout.component.scss'],
})
export class DemoLayoutComponent {
  sidebar = viewChild.required(SidebarComponent);

  onMenuToggle(): void {
    this.sidebar().toggleSidebar();
  }
}
