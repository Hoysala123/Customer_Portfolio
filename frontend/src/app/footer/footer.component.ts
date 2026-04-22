import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html'
})
export class FooterComponent {

    constructor(private router: Router) {}

  logout() {
    this.router.navigate(['/login']);
  }
}