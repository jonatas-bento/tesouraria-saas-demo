# Guia de Integração com API

## Visão Geral

Este documento descreve os endpoints esperados da API e como preparar a aplicação para integração futura.

**Status Atual:** Modo Demonstração (Dados Mockados)  
**Próxima Fase:** Integração com API REST

## Arquitetura Atual

### Separação de Responsabilidades

```
src/app/core/
├── models/           # Contratos de dados (interfaces TypeScript)
│   ├── index.ts
│   └── transaction.model.ts
├── mocks/            # Dados mockados para demonstração
│   └── transaction.mock.ts
└── services/         # Serviços de dados
    └── mock-data.service.ts (atual - modo demo)
```

### Modelos de Dados (Contratos)

Todos os modelos estão definidos em `src/app/core/models/transaction.model.ts`:

- `Transaction` - Transação financeira
- `DashboardSummary` - Resumo do dashboard
- `BalanceSheetItem` - Item do balancete
- `Report` - Relatório financeiro
- `ApiResponse<T>` - Envelope padrão de resposta
- `PaginationMeta` - Metadados de paginação
- `PaginatedResponse<T>` - Resposta paginada

## Endpoints Esperados da API

### Base URL
```
Desenvolvimento: http://localhost:3000/api
Produção: https://api.tesouraria.com/api
```

### Autenticação
```
Tipo: Bearer Token (JWT)
Header: Authorization: Bearer {token}
```

---

## 1. Dashboard

### GET /api/dashboard/summary
Retorna resumo financeiro para o dashboard.

**Response:**
```typescript
{
  "data": {
    "totalIncome": 35500,
    "totalExpenses": 27770,
    "balance": 7730,
    "pendingTransactions": 2
  },
  "success": true
}
```

**Modelo:** `DashboardSummary`

---

## 2. Transações

### GET /api/transactions
Lista todas as transações com paginação opcional.

**Query Parameters:**
- `page` (number, opcional): Número da página (padrão: 1)
- `pageSize` (number, opcional): Itens por página (padrão: 10)
- `type` (string, opcional): Filtro por tipo ('income' | 'expense')
- `status` (string, opcional): Filtro por status ('pending' | 'completed' | 'cancelled')
- `startDate` (string, opcional): Data inicial (ISO 8601)
- `endDate` (string, opcional): Data final (ISO 8601)

**Response (Paginada):**
```typescript
{
  "data": [
    {
      "id": "1",
      "date": "2026-06-01T00:00:00.000Z",
      "description": "Recebimento de Cliente A",
      "amount": 15000,
      "category": "Vendas",
      "type": "income",
      "status": "completed"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 10,
    "totalItems": 8,
    "totalPages": 1
  },
  "success": true
}
```

**Modelo:** `PaginatedResponse<Transaction>`

### GET /api/transactions/:id
Retorna uma transação específica.

**Response:**
```typescript
{
  "data": {
    "id": "1",
    "date": "2026-06-01T00:00:00.000Z",
    "description": "Recebimento de Cliente A",
    "amount": 15000,
    "category": "Vendas",
    "type": "income",
    "status": "completed"
  },
  "success": true
}
```

**Modelo:** `ApiResponse<Transaction>`

### POST /api/transactions
Cria uma nova transação.

**Request Body:**
```typescript
{
  "date": "2026-06-20T00:00:00.000Z",
  "description": "Nova Transação",
  "amount": 5000,
  "category": "Vendas",
  "type": "income"
}
```

**Response:**
```typescript
{
  "data": {
    "id": "9",
    "date": "2026-06-20T00:00:00.000Z",
    "description": "Nova Transação",
    "amount": 5000,
    "category": "Vendas",
    "type": "income",
    "status": "pending"
  },
  "message": "Transação criada com sucesso",
  "success": true
}
```

### PUT /api/transactions/:id
Atualiza uma transação existente.

**Request Body:**
```typescript
{
  "description": "Descrição Atualizada",
  "amount": 5500,
  "status": "completed"
}
```

**Response:**
```typescript
{
  "data": {
    "id": "9",
    "date": "2026-06-20T00:00:00.000Z",
    "description": "Descrição Atualizada",
    "amount": 5500,
    "category": "Vendas",
    "type": "income",
    "status": "completed"
  },
  "message": "Transação atualizada com sucesso",
  "success": true
}
```

### DELETE /api/transactions/:id
Remove uma transação.

**Response:**
```typescript
{
  "message": "Transação removida com sucesso",
  "success": true
}
```

---

## 3. Balancete

### GET /api/balance-sheet
Retorna o balancete de verificação.

**Query Parameters:**
- `date` (string, opcional): Data de referência (ISO 8601)

**Response:**
```typescript
{
  "data": [
    {
      "account": "Caixa",
      "debit": 25000,
      "credit": 0,
      "balance": 25000
    },
    {
      "account": "Bancos",
      "debit": 45000,
      "credit": 0,
      "balance": 45000
    }
  ],
  "success": true
}
```

**Modelo:** `ApiResponse<BalanceSheetItem[]>`

---

## 4. Relatórios

### GET /api/reports
Lista todos os relatórios disponíveis.

**Query Parameters:**
- `type` (string, opcional): Filtro por tipo ('monthly' | 'quarterly' | 'annual')
- `page` (number, opcional): Número da página
- `pageSize` (number, opcional): Itens por página

**Response:**
```typescript
{
  "data": [
    {
      "id": "1",
      "name": "Relatório Mensal - Junho 2026",
      "type": "monthly",
      "period": "Junho/2026",
      "generatedAt": "2026-06-26T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 10,
    "totalItems": 3,
    "totalPages": 1
  },
  "success": true
}
```

**Modelo:** `PaginatedResponse<Report>`

### GET /api/reports/:id
Retorna um relatório específico.

**Response:**
```typescript
{
  "data": {
    "id": "1",
    "name": "Relatório Mensal - Junho 2026",
    "type": "monthly",
    "period": "Junho/2026",
    "generatedAt": "2026-06-26T00:00:00.000Z"
  },
  "success": true
}
```

**Modelo:** `ApiResponse<Report>`

### GET /api/reports/:id/download
Faz download do relatório em PDF.

**Response:**
- Content-Type: application/pdf
- Content-Disposition: attachment; filename="relatorio-junho-2026.pdf"

---

## Plano de Migração

### Fase 1: Preparação (Atual - Concluída ✅)
- [x] Definir modelos de dados (contratos)
- [x] Separar dados mockados em arquivo próprio
- [x] Documentar endpoints esperados
- [x] Manter serviço mock funcionando

### Fase 2: Criação do Serviço de API (Próxima)
1. Criar `src/app/core/services/treasury-api.service.ts`
2. Implementar HttpClient para chamadas reais
3. Adicionar interceptors para autenticação
4. Implementar tratamento de erros
5. Adicionar loading states

### Fase 3: Substituição Gradual
1. Criar feature flag para alternar entre mock e API
2. Testar endpoints um por um
3. Validar respostas da API
4. Ajustar modelos se necessário

### Fase 4: Produção
1. Remover serviço mock
2. Configurar variáveis de ambiente
3. Implementar retry logic
4. Adicionar cache quando apropriado

---

## Exemplo de Implementação Futura

### treasury-api.service.ts (Exemplo)
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
  Transaction, 
  DashboardSummary, 
  ApiResponse 
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class TreasuryApiService {
  private readonly baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getDashboardSummary(): Observable<DashboardSummary> {
    return this.http
      .get<ApiResponse<DashboardSummary>>(`${this.baseUrl}/dashboard/summary`)
      .pipe(map(response => response.data));
  }

  getAllTransactions(): Observable<Transaction[]> {
    return this.http
      .get<ApiResponse<Transaction[]>>(`${this.baseUrl}/transactions`)
      .pipe(map(response => response.data));
  }

  // ... outros métodos
}
```

---

## Notas Importantes

### Tratamento de Datas
- API deve retornar datas em formato ISO 8601
- Frontend converte para objetos Date do JavaScript
- Timezone: UTC (converter para local no frontend)

### Autenticação
- JWT armazenado em localStorage ou sessionStorage
- Refresh token para renovação automática
- Logout limpa tokens e redireciona para login

### Tratamento de Erros
- Códigos HTTP padrão (200, 201, 400, 401, 403, 404, 500)
- Mensagens de erro em português
- Validações no backend e frontend

### Performance
- Implementar paginação em todas as listas
- Cache de dados quando apropriado
- Lazy loading de relatórios grandes

### Segurança
- HTTPS obrigatório em produção
- CORS configurado corretamente
- Validação de inputs no backend
- Rate limiting para prevenir abuso

---

## Checklist de Integração

- [ ] Configurar variáveis de ambiente (API_URL)
- [ ] Implementar TreasuryApiService
- [ ] Adicionar HttpClient no app.config.ts
- [ ] Criar interceptor de autenticação
- [ ] Criar interceptor de erros
- [ ] Implementar loading states
- [ ] Testar todos os endpoints
- [ ] Validar tratamento de erros
- [ ] Implementar retry logic
- [ ] Adicionar testes unitários
- [ ] Documentar mudanças

---

## Contato

Para dúvidas sobre a API ou integração, consulte a equipe de backend.
