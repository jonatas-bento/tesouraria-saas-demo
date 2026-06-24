/**
 * Runtime Configuration
 * 
 * Configurações centralizadas da aplicação em modo demo.
 * Todas as operações de escrita estão desabilitadas.
 */

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
}

/**
 * Configuração padrão da aplicação
 * 
 * IMPORTANTE: Em modo demo, todas as operações de escrita estão desabilitadas.
 */
export const runtimeConfig: RuntimeConfig = {
  demoMode: true,
  enableWriteOperations: false,
  showDemoBadge: true,
  appName: 'Tesouraria SaaS Demo',
  version: '0.0.0',
  environment: 'development'
};
