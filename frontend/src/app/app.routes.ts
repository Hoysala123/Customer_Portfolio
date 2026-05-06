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

// PAGE IMPORTS - PRODUCTS
import { GovernmentBondsComponent } from './pages/products/government-bonds.component';
import { FixedDepositsComponent } from './pages/products/fixed-deposits.component';
import { GovernmentSchemesComponent } from './pages/products/government-schemes.component';
import { RetirementPlansComponent } from './pages/products/retirement-plans.component';
import { PortfolioBuilderComponent as PortfolioBuilderPageComponent } from './pages/products/portfolio-builder.component';

// PAGE IMPORTS - SUPPORT
import { HelpCenterComponent } from './pages/support/help-center.component';
import { AdvisorSupportComponent } from './pages/support/advisor-support.component';
import { DocumentationComponent } from './pages/support/documentation.component';
import { FaqsComponent } from './pages/support/faqs.component';
import { InvestmentGuidanceComponent } from './pages/support/investment-guidance.component';

// PAGE IMPORTS - LEGAL
import { AmlPolicyComponent } from './pages/legal/aml-policy.component';
import { PrivacyPolicyComponent } from './pages/legal/privacy-policy.component';
import { CustomerAgreementComponent } from './pages/legal/customer-agreement.component';
import { RiskDisclosureComponent } from './pages/legal/risk-disclosure.component';
import { ReturnPolicyComponent } from './pages/legal/return-policy.component';

// PAGE IMPORTS - COMPANY
import { AboutFinVistaComponent } from './pages/company/about-finvista.component';
import { OurAdvisorsComponent } from './pages/company/our-advisors.component';
import { LeadershipComponent } from './pages/company/leadership.component';
import { CareersComponent } from './pages/company/careers.component';
import { ContactUsComponent } from './pages/company/contact-us.component';

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

  // ================================
  // PRODUCTS PAGES
  // ================================
  { path: 'pages/products/government-bonds', component: GovernmentBondsComponent },
  { path: 'pages/products/fixed-deposits', component: FixedDepositsComponent },
  { path: 'pages/products/government-schemes', component: GovernmentSchemesComponent },
  { path: 'pages/products/retirement-plans', component: RetirementPlansComponent },
  { path: 'pages/products/portfolio-builder', component: PortfolioBuilderPageComponent },

  // ================================
  // SUPPORT PAGES
  // ================================
  { path: 'pages/support/help-center', component: HelpCenterComponent },
  { path: 'pages/support/advisor-support', component: AdvisorSupportComponent },
  { path: 'pages/support/documentation', component: DocumentationComponent },
  { path: 'pages/support/faqs', component: FaqsComponent },
  { path: 'pages/support/investment-guidance', component: InvestmentGuidanceComponent },

  // ================================
  // LEGAL PAGES
  // ================================
  { path: 'pages/legal/aml-policy', component: AmlPolicyComponent },
  { path: 'pages/legal/privacy-policy', component: PrivacyPolicyComponent },
  { path: 'pages/legal/customer-agreement', component: CustomerAgreementComponent },
  { path: 'pages/legal/risk-disclosure', component: RiskDisclosureComponent },
  { path: 'pages/legal/return-policy', component: ReturnPolicyComponent },

  // ================================
  // COMPANY PAGES
  // ================================
  { path: 'pages/company/about-finvista', component: AboutFinVistaComponent },
  { path: 'pages/company/our-advisors', component: OurAdvisorsComponent },
  { path: 'pages/company/leadership', component: LeadershipComponent },
  { path: 'pages/company/careers', component: CareersComponent },
  { path: 'pages/company/contact-us', component: ContactUsComponent },

  // Catch-all route - redirect to login
  { path: '**', redirectTo: 'login' }
];