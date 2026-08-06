import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin-guard';
import { clienteGuard } from './core/guards/cliente-guard';
import { SiteLayoutComponent } from './shared/site-layout-component/site-layout-component';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Entrar | Code Ink',
    loadComponent: () =>
      import('./pages/login-componente/login-componente').then((m) => m.LoginComponente),
  },
  {
    path: 'cadastro',
    title: 'Cadastro | Code Ink',
    loadComponent: () =>
      import('./pages/cadastro-componente/cadastro-componente').then((m) => m.CadastroComponente),
  },
  {
    path: '',
    component: SiteLayoutComponent,
    children: [
      {
        path: '',
        title: 'Code Ink Estúdio',
        loadComponent: () =>
          import('./pages/home-componente/home-componente').then((m) => m.HomeComponente),
      },
      { path: 'home', redirectTo: '', pathMatch: 'full' },
      {
        path: 'portfolio',
        title: 'Portfólio | Code Ink',
        loadComponent: () =>
          import('./pages/portfolio-componente/portfolio-componente').then(
            (m) => m.PortfolioComponente,
          ),
      },
      {
        path: 'portfolio/:id',
        title: 'Detalhes da tattoo | Code Ink',
        loadComponent: () =>
          import('./pages/tattoo-detail-componente/tattoo-detail-componente').then(
            (m) => m.TattooDetailComponente,
          ),
      },
      {
        path: 'flash',
        title: 'Flash tattoos | Code Ink',
        loadComponent: () =>
          import('./pages/flash-tattoos-componente/flash-tattoos-componente').then(
            (m) => m.FlashTattoosComponente,
          ),
      },
      {
        path: 'tatuadores',
        title: 'Tatuadores | Code Ink',
        loadComponent: () =>
          import('./pages/tatuadores-componente/tatuadores-componente').then(
            (m) => m.TatuadoresComponente,
          ),
      },
      {
        path: 'tatuadores/:id',
        title: 'Perfil do tatuador | Code Ink',
        loadComponent: () =>
          import('./pages/tatuador-perfil-componente/tatuador-perfil-componente').then(
            (m) => m.TatuadorPerfilComponente,
          ),
      },
      {
        path: 'agendamento',
        title: 'Agendamento | Code Ink',
        loadComponent: () =>
          import('./pages/agendamento-componente/agendamento-componente').then(
            (m) => m.AgendamentoComponente,
          ),
      },
      {
        path: 'contato',
        title: 'Contato | Code Ink',
        loadComponent: () =>
          import('./pages/contato-componente/contato-componente').then((m) => m.ContatoComponente),
      },
      {
        path: 'perfil',
        title: 'Minha conta | Code Ink',
        canActivate: [clienteGuard],
        loadComponent: () =>
          import('./pages/cliente-perfil-componente/cliente-perfil-componente').then(
            (m) => m.ClientePerfilComponente,
          ),
      },
      {
        path: 'dashboard',
        title: 'Dashboard | Code Ink',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./pages/dashboard-componente/dashboard-componente').then(
            (m) => m.DashboardComponente,
          ),
      },

      {
        path: 'dashboard/agendamentos',
        title: 'Gerenciar agendamentos | Code Ink',
        canActivate: [adminGuard],
        loadComponent: () =>
          import(
            './pages/agendamentos-admin-componente/agendamentos-admin-componente'
          ).then((m) => m.AgendamentosAdminComponente),
      },

      {
        path: '**',
        title: 'Página não encontrada | Code Ink',
        loadComponent: () =>
          import('./pages/not-found-componente/not-found-componente').then(
            (m) => m.NotFoundComponente,
          ),
      },
    ],
  },
];
