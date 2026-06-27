/**
 * Environment Configuration - Development
 *
 * Configuração do ambiente de desenvolvimento.
 * O serviço de API tentará conectar ao backend NestJS.
 * Se o backend estiver offline, faz fallback automático para dados mockados locais.
 */
export const environment = {
  production: false,

  /** URL base da API NestJS */
  apiUrl: 'http://localhost:3000/api',

  /**
   * Habilita fallback para dados mockados quando a API estiver indisponível.
   * Em development: true  → silencia erros e usa mock local
   * Em production:  false → propaga o erro (API é obrigatória)
   */
  useMockFallback: true,
};
