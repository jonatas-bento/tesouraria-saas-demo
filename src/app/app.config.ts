/**
 * Application Configuration
 *
 * Registra todos os providers globais da aplicação:
 *   - Router
 *   - HttpClient (com fetch nativo para Angular 22)
 *   - DATA_SERVICE_TOKEN → TreasuryApiService (API real + fallback mock)
 *
 * Os componentes devem injetar DATA_SERVICE_TOKEN e nunca diretamente
 * MockDataService ou TreasuryApiService, garantindo fácil troca futura.
 */

import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { DATA_SERVICE_TOKEN } from './core/services/data.service.token';
import { TreasuryApiService } from './core/services/treasury-api.service';

export const appConfig: ApplicationConfig = {
  providers: [
    // Listeners de erro globais do browser
    provideBrowserGlobalErrorListeners(),

    // Roteamento lazy-load
    provideRouter(routes),

    // HttpClient com fetch nativo (Angular 22+)
    provideHttpClient(withFetch()),

    /**
     * Registra TreasuryApiService como implementação do DATA_SERVICE_TOKEN.
     * - Em development: tenta a API real; fallback automático para mock local.
     * - Em production:  tenta a API real; sem fallback (erro é propagado).
     *
     * Para usar mock puro (sem HTTP), troque por:
     *   { provide: DATA_SERVICE_TOKEN, useExisting: MockDataService }
     */
    {
      provide: DATA_SERVICE_TOKEN,
      useExisting: TreasuryApiService,
    },
  ],
};

