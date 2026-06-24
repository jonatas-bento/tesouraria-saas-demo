# Tesouraria SaaS Demo - Frontend

## 📋 Visão Geral

Frontend da aplicação de gestão financeira Tesouraria SaaS, construído com Angular 22 e executando em **modo demo**.

## ⚠️ Modo Demo

Esta aplicação está configurada em **modo demo**:

- ✅ Todas as funcionalidades de leitura estão disponíveis
- ❌ Operações de escrita (POST, PUT, DELETE) estão **desabilitadas**
- 🏷️ Badge "DEMO" visível na interface
- 📊 Dados de demonstração pré-carregados

## 🚀 Tecnologias

- **Angular**: 22.0.2
- **TypeScript**: 6.0.2
- **Node.js**: 26.0.0
- **npm**: 11.12.1
- **SCSS**: Preprocessador CSS
- **RxJS**: 7.8.0

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start

# Build de produção
npm run build

# Executar testes
npm test
```

## 🏗️ Estrutura do Projeto

```
src/
├── app/
│   ├── config/           # Configurações centralizadas
│   ├── core/             # Serviços e funcionalidades core
│   ├── shared/           # Componentes e utilitários compartilhados
│   ├── features/         # Módulos de funcionalidades
│   └── layouts/          # Layouts da aplicação
├── styles/               # Estilos globais SCSS
└── assets/               # Recursos estáticos
```

## ⚙️ Configuração

### Runtime Config

Arquivo: `src/app/config/runtime.config.ts`

```typescript
export const runtimeConfig = {
  demoMode: true,                    // Modo demo ativado
  enableWriteOperations: false,      // Escrita desabilitada
  showDemoBadge: true,               // Badge visível
  appName: 'Tesouraria SaaS Demo',
  version: '0.0.0',
  environment: 'development'
};
```

### Brand Config

Arquivo: `src/app/config/brand.config.ts`

Configuração centralizada de marca, cores e logos.

## 🎨 Tema e Estilos

- Variáveis SCSS centralizadas em `src/styles/_variables.scss`
- Sistema de cores baseado na marca
- Utilitários CSS globais
- Design responsivo

## 📝 Convenções

- **Standalone Components**: Arquitetura moderna do Angular
- **Functional Guards**: Guards funcionais para rotas
- **Functional Interceptors**: Interceptors funcionais para HTTP
- **Signals**: Gerenciamento de estado reativo
- **Strict Mode**: TypeScript rigoroso ativado

## 🔐 Segurança

Em modo demo:
- Sem autenticação real
- Sem persistência de dados
- Operações de escrita bloqueadas
- Dados sensíveis não expostos

## 📚 Documentação Adicional

- [Angular Documentation](https://angular.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [RxJS Documentation](https://rxjs.dev)

## 🤝 Contribuição

Este é um projeto de demonstração. Para contribuir:

1. Fork o repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Projeto de demonstração - Todos os direitos reservados.

---

**Versão**: 0.0.0  
**Última atualização**: 2026-06-17
