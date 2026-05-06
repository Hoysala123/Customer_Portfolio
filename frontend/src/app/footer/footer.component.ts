import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface FooterItem {
  label: string;
  route?: string;
  action?: string;
  external?: boolean;
  url?: string;
}

interface FooterColumn {
  title: string;
  items: FooterItem[];
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  activeItem: string = '';
  activeSocial: string = '';

  footerColumns: FooterColumn[] = [
    {
      title: 'Products',
      items: [
        { label: 'Government Bonds', route: '/pages/products/government-bonds' },
        { label: 'Fixed Deposits', route: '/pages/products/fixed-deposits' },
        { label: 'Government Schemes', route: '/pages/products/government-schemes' },
        { label: 'Retirement Plans', route: '/pages/products/retirement-plans' },
        { label: 'Portfolio Builder', route: '/pages/products/portfolio-builder' }
      ]
    },
    {
      title: 'Support',
      items: [
        { label: 'Help Center', route: '/pages/support/help-center' },
        { label: 'Advisor Support', route: '/pages/support/advisor-support' },
        { label: 'Documentation', route: '/pages/support/documentation' },
        { label: 'FAQs', route: '/pages/support/faqs' },
        { label: 'Investment Guidance', route: '/pages/support/investment-guidance' }
      ]
    },
    {
      title: 'Legal',
      items: [
        { label: 'AML Policy', route: '/pages/legal/aml-policy' },
        { label: 'Privacy Policy', route: '/pages/legal/privacy-policy' },
        { label: 'Customer Agreement', route: '/pages/legal/customer-agreement' },
        { label: 'Risk Disclosure', route: '/pages/legal/risk-disclosure' },
        { label: 'Return Policy', route: '/pages/legal/return-policy' }
      ]
    },
    {
      title: 'Company',
      items: [
        { label: 'About FinVista', route: '/pages/company/about-finvista' },
        { label: 'Our Advisors', route: '/pages/company/our-advisors' },
        { label: 'Leadership', route: '/pages/company/leadership' },
        { label: 'Careers', route: '/pages/company/careers' },
        { label: 'Contact Us', route: '/pages/company/contact-us' }
      ]
    }
  ];

  socialLinks = [
    { name: 'facebook', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg', url: 'https://facebook.com/finvista' },
    { name: 'instagram', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg', url: 'https://instagram.com/finvista' },
    { name: 'linkedin', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg', url: 'https://linkedin.com/company/finvista' },
    { name: 'github', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg', url: 'https://github.com/finvista' }
  ];

  constructor(private router: Router) {}

  onItemClick(item: FooterItem): void {
    this.activeItem = this.activeItem === item.label ? '' : item.label;
    
    // Handle navigation
    if (item.external && item.url) {
      window.open(item.url, '_blank');
    } else if (item.route) {
      this.router.navigate([item.route]);
    }
  }

  onSocialClick(social: { name: string; url: string }): void {
    this.activeSocial = social.name;
    window.open(social.url, '_blank');
    
    setTimeout(() => {
      this.activeSocial = '';
    }, 300);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}