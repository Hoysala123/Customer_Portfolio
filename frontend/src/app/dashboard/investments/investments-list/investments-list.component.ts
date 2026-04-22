import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { InvestmentsService } from '../../../services/investments.service';
import { AddOneYearPipe } from '../add-one-year.pipe';

@Component({
  selector: 'app-investments-list',
  standalone: true,
  imports: [CommonModule, AddOneYearPipe],
  templateUrl: './investments-list.component.html'
})
export class InvestmentsListComponent implements OnInit {
  investments: any[] = [];

  constructor(private router: Router, private investmentsService: InvestmentsService) {}

  ngOnInit() {
    const customerId = localStorage.getItem('id');
    if (customerId) {
      this.investmentsService.getInvestments(customerId).subscribe((data: any[]) => {
        this.investments = data.filter(inv => inv.type !== 'Portfolio Created');
      });
    }
  }

  goToInvestForm(type: string) {
    this.router.navigate(['/dashboard/invest'], {
      queryParams: { type }
    });
  }
}