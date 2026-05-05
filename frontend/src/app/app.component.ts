import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, RouteConfigLoadStart } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, CommonModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  showFooter = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Check initial route
    this.updateFooter();

    // Listen to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateFooter();
      });
  }

  private updateFooter() {
    const url = this.router.url;
    
    // Hide footer on auth pages
    const hideOnPaths = ['/login', '/signup', '/kyc', '/'];
    this.showFooter = !hideOnPaths.includes(url);
  }
}