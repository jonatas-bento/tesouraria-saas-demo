import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { runtimeConfig } from './config/runtime.config';
import { brandConfig } from './config/brand.config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal(brandConfig.name);
  protected readonly config = runtimeConfig;
  protected readonly brand = brandConfig;
  
  // Modo demo ativado
  protected readonly isDemoMode = signal(runtimeConfig.demoMode);
  protected readonly showDemoBadge = signal(runtimeConfig.showDemoBadge);
}
