import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ReportService } from '../../core/services/dashboard.service';
import { ReportResponse } from '../../core/models';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <section class="page-header">
      <h1>Reports</h1>
      <p>Summary analytics and revenue reporting</p>
    </section>

    @if (loading) {
      <p>Loading reports...</p>
    } @else if (summary) {
      <div class="stats-grid">
        <article class="stat-card"><h3>Users</h3><p>{{ summary.totalUsers }}</p></article>
        <article class="stat-card"><h3>Tax Filings</h3><p>{{ summary.totalTaxFilings }}</p></article>
        <article class="stat-card"><h3>Payments</h3><p>{{ summary.totalPayments }}</p></article>
        <article class="stat-card"><h3>Documents</h3><p>{{ summary.totalDocuments }}</p></article>
        <article class="stat-card revenue"><h3>Total Revenue</h3><p>{{ summary.totalRevenue | number:'1.2-2' }}</p></article>
      </div>

      <div class="panel">
        <h2>Revenue Breakdown</h2>
        <div class="revenue-bar">
          <div [style.width.%]="100"></div>
        </div>
        <p class="revenue-label">Collected revenue: <strong>{{ summary.totalRevenue | number:'1.2-2' }}</strong></p>
      </div>
    }
  `,
  styles: `
    .stats-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem; margin-bottom: 1.5rem;
    }
    .stat-card {
      background: #fff; border-radius: 12px; padding: 1.25rem;
      box-shadow: 0 4px 14px rgba(15,39,68,0.08);
    }
    .stat-card h3 { margin: 0; font-size: 0.9rem; color: #64748b; }
    .stat-card p { margin: 0.5rem 0 0; font-size: 1.75rem; font-weight: 700; color: #1d4ed8; }
    .revenue p { color: #0f766e; }
    .revenue-bar {
      height: 16px; background: #e2e8f0; border-radius: 999px; overflow: hidden; margin-top: 1rem;
    }
    .revenue-bar div { height: 100%; background: linear-gradient(90deg, #0f766e, #2dd4bf); }
    .revenue-label { margin-top: 0.75rem; color: #475569; }
  `
})
export class ReportsComponent implements OnInit {
  private readonly reportService = inject(ReportService);

  summary: ReportResponse | null = null;
  loading = true;

  ngOnInit(): void {
    this.reportService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
