/**
 * Brand Configuration
 * 
 * Configuração central da marca e identidade visual da aplicação.
 */

export interface BrandConfig {
  /** Nome da aplicação */
  name: string;
  
  /** Nome curto para exibição */
  shortName: string;
  
  /** Slogan ou descrição */
  tagline: string;
  
  /** Cores da marca */
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    danger: string;
  };
  
  /** Logos */
  logos: {
    main: string;
    icon: string;
    light: string;
    dark: string;
  };
}

/**
 * Configuração da marca Gestão Inteligente para Igrejas
 */
export const brandConfig: BrandConfig = {
  name: 'Gestão Inteligente para Igrejas',
  shortName: 'Tesouraria',
  tagline: 'Portal Administrativo e Financeiro',
  colors: {
    primary: '#1976d2',
    secondary: '#424242',
    accent: '#82b1ff',
    success: '#4caf50',
    warning: '#ff9800',
    danger: '#f44336'
  },
  logos: {
    main: '/assets/images/logo.png',
    icon: '/assets/images/icon.png',
    light: '/assets/images/logo-light.png',
    dark: '/assets/images/logo-dark.png'
  }
};
