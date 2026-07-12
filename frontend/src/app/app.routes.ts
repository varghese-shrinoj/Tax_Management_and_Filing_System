import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'signup',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/signup/signup.component').then((m) => m.SignupComponent)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent)
      },
      {
        path: 'users',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/users/users.component').then((m) => m.UsersComponent)
      },
      {
        path: 'tax-types',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/tax-types/tax-types.component').then((m) => m.TaxTypesComponent)
      },
      {
        path: 'tax-filings',
        loadComponent: () => import('./features/tax-filings/tax-filings.component').then((m) => m.TaxFilingsComponent)
      },
      {
        path: 'org-filings',
        loadComponent: () => import('./features/tax-filings/org-filings.component').then((m) => m.OrgFilingsComponent)
      },
      {
        path: 'payments',
        loadComponent: () => import('./features/payments/payments.component').then((m) => m.PaymentsComponent)
      },
      {
        path: 'documents',
        loadComponent: () => import('./features/documents/documents.component').then((m) => m.DocumentsComponent)
      },
      {
        path: 'org-documents',
        loadComponent: () => import('./features/documents/org-documents.component').then((m) => m.OrgDocumentsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then((m) => m.ProfileComponent)
      },
      {
        path: 'reports',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/reports/reports.component').then((m) => m.ReportsComponent)
      },
      {
        path: 'verifier-filings',
        loadComponent: () => import('./features/verifier/verifier-filings.component').then((m) => m.VerifierFilingsComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
