/**
 * Runtime Configuration
 *
 * Configurações centralizadas da aplicação em modo demo.
 * Todas as operações de escrita estão desabilitadas.
 */

import { environment } from '../../environments/environment';

export interface RuntimeConfig {
  /** Modo demo ativado - exibe badge e desabilita operações de escrita */
  demoMode: boolean;

  /** Habilita operações de escrita (POST, PUT, DELETE) */
  enableWriteOperations: boolean;

  /** Exibe badge "DEMO" na interface */
  showDemoBadge: boolean;

  /** Nome da aplicação */
  appName: string;

  /** Versão da aplicação */
  version: string;

  /** Ambiente (development, production) */
  environment: 'development' | 'production';

  /**
   * URL base da API NestJS.
   * Vem do arquivo de environment (substituído por fileReplacements no build).
   */
  apiUrl: string;

  /**
   * Quando true, usa dados mockados locais se a API estiver indisponível.
   * Controlado pelo environment para não mascarar falhas em produção.
   */
  useMockFallback: boolean;
}

/**
 * Configuração padrão da aplicação
 *
 * IMPORTANTE: Em modo demo, todas as operações de escrita estão desabilitadas.
 * A URL da API e o flag de fallback são lidos do arquivo de environment.
 */
export const runtimeConfig: RuntimeConfig = {
  demoMode: true,
  enableWriteOperations: false,
  showDemoBadge: true,
  appName: 'Tesouraria SaaS Demo',
  version: '0.0.0',
  environment: environment.production ? 'production' : 'development',
  apiUrl: environment.apiUrl,
  useMockFallback: environment.useMockFallback,
};

