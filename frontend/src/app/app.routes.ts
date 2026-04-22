import { Routes } from '@angular/router';

// GUARDS
import { adminAuthGuard } from './guards/admin-auth.guard';
import { advisorAuthGuard } from './guards/advisor-auth.guard';
import { customerAuthGuard } from './guards/customer-auth.guard';
import { preventLoginGuard } from './guards/prevent-login.guard';
import { rootGuard } from './guards/root.guard';
import { testGuard } from './guards/test.guard';

// AUTH (standalone components or direct imports)
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { KycComponent } from './auth/kyc/kyc.component';

// CUSTOMER DASHBOARD LAYOUT (not standalone)
import { DashboardLayoutComponent } from './dashboard/layout/dashboard-layout/dashboard-layout.component';

// CUSTOMER DASHBOARD CHILDREN
import { PortfolioComponent } from './dashboard/portfolio/portfolio.component';
import { AssetsLiabilitiesComponent } from './dashboard/assets-liabilities/assets-liabilities.component';
import { InvestmentsListComponent } from './dashboard/investments/investments-list/investments-list.component';
import { InvestmentFormComponent } from './dashboard/investments/investment-form/investment-form.component';
import { AnalysisComponent } from './dashboard/analysis/analysis.component';
import { ReportsComponent } from './dashboard/reports/reports.component';

export const routes: Routes = [

  // Default → Login Page (with guard to ensure fresh start)
  { path: '', canActivate: [rootGuard], component: LoginComponent },

  // AUTH ROUTES
  { path: 'login', component: LoginComponent, canActivate: [preventLoginGuard] },
  { path: 'signup', component: SignupComponent },
  { path: 'kyc', component: KycComponent },

  // ================================
  // ADMIN ROUTES (Standalone Lazy Load)
  // ================================
  {
    path: 'admin-dashboard',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./admin/dashboard/admin-dashboard.component')
        .then(m => m.AdminDashboardComponent)
  },
  {
    path: 'admin/customers',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./admin/customers/admin-customers.component')
        .then(m => m.AdminCustomersComponent)
  },
  {
    path: 'admin/advisors',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./admin/advisors/admin-advisors.component')
        .then(m => m.AdminAdvisorsComponent)
  },
  {
    path: 'admin/notification',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./admin/notification/admin-notification.component')
        .then(m => m.AdminNotificationComponent)
  },
  {
    path: 'admin/investment-products',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./admin/investment-products/admin-investment-products.component')
        .then(m => m.AdminInvestmentProductsComponent)
  },

  // ================================
  // ADVISOR ROUTES (Standalone Lazy Load)
  // ================================
  {
    path: 'advisor/dashboard',
    canActivate: [advisorAuthGuard],
    loadComponent: () =>
      import('./advisor/dashboard/advisor-dashboard.component')
        .then(m => m.AdvisorDashboardComponent)
  },
  {
    path: 'advisor/portfolio/:customerId',
    canActivate: [advisorAuthGuard],
    loadComponent: () =>
      import('./advisor/portfolio-builder/portfolio-builder.component')
        .then(m => m.PortfolioBuilderComponent)
  },
  {
    path: 'advisor/customers',
    canActivate: [advisorAuthGuard],
    loadComponent: () =>
      import('./advisor/customers/advisor-customers.component')
        .then(m => m.AdvisorCustomersComponent)
  },
  {
    path: 'advisor/reports',
    canActivate: [advisorAuthGuard],
    loadComponent: () =>
      import('./advisor/reports/advisor-reports.component')
        .then(m => m.AdvisorReportsComponent)
  },

  // ================================
  // CUSTOMER DASHBOARD (With Children)
  // ================================
  {
    path: 'dashboard',
    canActivate: [customerAuthGuard],
    component: DashboardLayoutComponent,
    children: [
      { path: '', redirectTo: 'portfolio', pathMatch: 'full' },
      { path: 'portfolio', component: PortfolioComponent },
      { path: 'assets-liabilities', component: AssetsLiabilitiesComponent },
      { path: 'investments', component: InvestmentsListComponent },
      { path: 'invest', component: InvestmentFormComponent },
      { path: 'analysis', component: AnalysisComponent },
      { path: 'reports', component: ReportsComponent }
    ]
  },

  // Catch-all route - redirect to login
  { path: '**', redirectTo: 'login' }
];