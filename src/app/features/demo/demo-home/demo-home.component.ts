import { Component } from '@angular/core';

@Component({
  selector: 'app-demo-home',
  template: `
    <div class="demo-home-page">
      <p>Demo Home</p>
    </div>
  `,
  styles: [`
    .demo-home-page {
      padding: 2rem;
    }
  `]
})
export class DemoHomeComponent {}
