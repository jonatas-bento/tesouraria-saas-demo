/**
 * Environment Configuration - Production
 *
 * Configuração do ambiente de produção.
 * A URL da API deve ser ajustada para o endereço real de produção.
 * Fallback mock desabilitado — erros da API serão propagados.
 */
export const environment = {
  production: true,

  /** URL base da API NestJS em produção */
  apiUrl: 'https://api.tesouraria-saas.com/api',

  /**
   * Em produção o fallback mock está desabilitado.
   * Caso a API falhe, o erro será visível ao usuário.
   */
  useMockFallback: false,
};
