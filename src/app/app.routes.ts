import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/public-layout/public-layout.component').then(
        (m) => m.PublicLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/public/home/home.component').then(
            (m) => m.HomeComponent
          ),
      },
      {
        path: 'solucao',
        loadComponent: () =>
          import('./features/public/solucao/solucao.component').then(
            (m) => m.SolucaoComponent
          ),
      },
      {
        path: 'contato',
        loadComponent: () =>
          import('./features/public/contato/contato.component').then(
            (m) => m.ContatoComponent
          ),
      },
    ],
  },
  {
    path: 'demo',
    loadComponent: () =>
      import('./layouts/demo-layout/demo-layout.component').then(
        (m) => m.DemoLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/demo/demo-home/demo-home.component').then(
            (m) => m.DemoHomeComponent
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/demo/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'entradas',
        loadComponent: () =>
          import('./features/demo/entradas/entradas.component').then(
            (m) => m.EntradasComponent
          ),
      },
      {
        path: 'despesas',
        loadComponent: () =>
          import('./features/demo/despesas/despesas.component').then(
            (m) => m.DespesasComponent
          ),
      },
      {
        path: 'balancete',
        loadComponent: () =>
          import('./features/demo/balancete/balancete.component').then(
            (m) => m.BalanceteComponent
          ),
      },
      {
        path: 'relatorios',
        loadComponent: () =>
          import('./features/demo/relatorios/relatorios.component').then(
            (m) => m.RelatoriosComponent
          ),
      },
    ],
  },
];
