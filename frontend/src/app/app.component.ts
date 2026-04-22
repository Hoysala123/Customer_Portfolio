import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, CommonModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private router: Router) {}

  shouldShowFooter(): boolean {
    const currentUrl = this.router.url;
    return !currentUrl.includes('/login') && !currentUrl.includes('/signup') && !currentUrl.includes('/kyc');
  }
}