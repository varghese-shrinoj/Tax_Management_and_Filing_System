import { Component, OnInit, inject } from '@angular/core';
import { DashboardService } from '../../core/services/dashboard.service';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { PaymentService } from '../../core/services/payment.service';
import { TaxFilingService } from '../../core/services/tax-filing.service';
import { DashboardResponse, User, Payment, TaxFiling } from '../../core/models';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <section class="page-header">
      <h1>Dashboard</h1>
      <p>{{ authService.isAdmin() ? 'Administrator Control Center' : 'Overview of tax management activity' }}</p>
    </section>

    @if (loading) {
      <p class="loading-state">Loading dashboard...</p>
    } @else if (dashboard) {
      <div class="stats-grid">
        @if (authService.isAdmin()) {
          <article class="stat-card users-card" (click)="activeTab = 'users'" [class.clickable]="true">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <h3>Total Users</h3>
              <p>{{ dashboard.totalUsers }}</p>
            </div>
          </article>
          <article class="stat-card filings-card" (click)="activeTab = 'filings'" [class.clickable]="true">
            <div class="stat-icon">📄</div>
            <div class="stat-info">
              <h3>Tax Filings</h3>
              <p>{{ dashboard.totalTaxFilings }}</p>
            </div>
          </article>
          <article class="stat-card payments-card" (click)="activeTab = 'payments'" [class.clickable]="true">
            <div class="stat-icon">💳</div>
            <div class="stat-info">
              <h3>Payments</h3>
              <p>{{ dashboard.totalPayments }}</p>
            </div>
          </article>
          <article class="stat-card documents-card">
            <div class="stat-icon">📁</div>
            <div class="stat-info">
              <h3>Documents</h3>
              <p>{{ dashboard.totalDocuments }}</p>
            </div>
          </article>
        } @else {
          <!-- Taxpayer Separated View -->
          <article class="stat-card individual-filings">
            <div class="stat-icon">👤</div>
            <div class="stat-info">
              <h3>Individual Filings</h3>
              <p>{{ dashboard.totalIndividualFilings }}</p>
            </div>
          </article>
          <article class="stat-card organization-filings">
            <div class="stat-icon">🏢</div>
            <div class="stat-info">
              <h3>Organisation Filings</h3>
              <p>{{ dashboard.totalOrganizationFilings }}</p>
            </div>
          </article>
          <article class="stat-card individual-payments">
            <div class="stat-icon">💳</div>
            <div class="stat-info">
              <h3>Individual Payments</h3>
              <p>{{ dashboard.totalIndividualPayments }}</p>
            </div>
          </article>
          <article class="stat-card organization-payments">
            <div class="stat-icon">📈</div>
            <div class="stat-info">
              <h3>Organisation Payments</h3>
              <p>{{ dashboard.totalOrganizationPayments }}</p>
            </div>
          </article>
          <article class="stat-card documents-card">
            <div class="stat-icon">📁</div>
            <div class="stat-info">
              <h3>Documents</h3>
              <p>{{ dashboard.totalDocuments }}</p>
            </div>
          </article>
        }
      </div>

      @if (authService.isAdmin()) {
        <!-- Admin Tables Control Panel -->
        <div class="admin-panel">
          <div class="tab-header">
            <button class="tab-btn" [class.active]="activeTab === 'users'" (click)="activeTab = 'users'">
              👥 User Details
            </button>
            <button class="tab-btn" [class.active]="activeTab === 'filings'" (click)="activeTab = 'filings'">
              📄 Filing Details
            </button>
            <button class="tab-btn" [class.active]="activeTab === 'payments'" (click)="activeTab = 'payments'">
              💳 Payment Details
            </button>
          </div>

          <div class="tab-content">
            @if (activeTab === 'users') {
              <div class="table-card">
                <h2>User Management</h2>
                <div class="table-wrap">
                  <table>
                    <thead>
                      <tr><th>ID</th><th>Full Name</th><th>Email</th><th>Role</th></tr>
                    </thead>
                    <tbody>
                      @for (user of users; track user.id) {
                        <tr>
                          <td><strong>#{{ user.id }}</strong></td>
                          <td>{{ user.fullName }}</td>
                          <td><a href="mailto:{{ user.email }}">{{ user.email }}</a></td>
                          <td><span class="badge role-badge">{{ user.role }}</span></td>
                        </tr>
                      } @empty {
                        <tr><td colspan="4" class="empty">No users registered yet.</td></tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

            @if (activeTab === 'filings') {
              <div class="table-card">
                <h2>Tax Filing Submissions</h2>
                <div class="table-wrap">
                  <table>
                    <thead>
                      <tr><th>ID</th><th>Taxpayer</th><th>Year</th><th>Type</th><th>Annual Income</th><th>Tax Amount</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      @for (filing of filings; track filing.id) {
                        <tr>
                          <td><strong>#{{ filing.id }}</strong></td>
                          <td>{{ filing.user?.fullName }} <br><small class="email-sub">{{ filing.user?.email }}</small></td>
                          <td>{{ filing.financialYear }}</td>
                          <td><span class="type-tag">{{ filing.filingType ?? 'INDIVIDUAL' }}</span></td>
                          <td>₹{{ filing.annualIncome | number }}</td>
                          <td>₹{{ filing.taxAmount | number }}</td>
                          <td><span class="badge status-badge">{{ filing.status }}</span></td>
                        </tr>
                      } @empty {
                        <tr><td colspan="7" class="empty">No tax filings created yet.</td></tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }

            @if (activeTab === 'payments') {
              <div class="table-card">
                <h2>Payment Transactions</h2>
                <div class="table-wrap">
                  <table>
                    <thead>
                      <tr><th>ID</th><th>Taxpayer</th><th>Date</th><th>Amount</th><th>Method</th><th>Status</th><th>Transaction ID</th></tr>
                    </thead>
                    <tbody>
                      @for (payment of payments; track payment.id) {
                        <tr>
                          <td><strong>#{{ payment.id }}</strong></td>
                          <td>{{ payment.taxFiling?.user?.fullName }}</td>
                          <td>{{ payment.paymentDate }}</td>
                          <td>₹{{ payment.amount | number }}</td>
                          <td><span class="badge type-badge">{{ payment.paymentMethod }}</span></td>
                          <td><span class="badge status-badge">{{ payment.paymentStatus }}</span></td>
                          <td class="tx-id"><code>{{ payment.transactionId || '—' }}</code></td>
                        </tr>
                      } @empty {
                        <tr><td colspan="7" class="empty">No payments received yet.</td></tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }
          </div>
        </div>
      } @else {
        <!-- Taxpayer Charts Activity Summary -->
        <div class="chart-panel">
          <h2>Activity Summary</h2>
          <div class="bars">
            <div class="bar-item">
              <span class="label">Individual Filings</span>
              <div class="bar-track"><div class="bar-fill indiv-filings-fill" [style.width.%]="barWidth(dashboard.totalIndividualFilings)"></div></div>
              <span class="value">{{ dashboard.totalIndividualFilings }}</span>
            </div>
            <div class="bar-item">
              <span class="label">Organisation Filings</span>
              <div class="bar-track"><div class="bar-fill org-filings-fill" [style.width.%]="barWidth(dashboard.totalOrganizationFilings)"></div></div>
              <span class="value">{{ dashboard.totalOrganizationFilings }}</span>
            </div>
            <div class="bar-item">
              <span class="label">Individual Payments</span>
              <div class="bar-track"><div class="bar-fill indiv-payments-fill" [style.width.%]="barWidth(dashboard.totalIndividualPayments)"></div></div>
              <span class="value">{{ dashboard.totalIndividualPayments }}</span>
            </div>
            <div class="bar-item">
              <span class="label">Organisation Payments</span>
              <div class="bar-track"><div class="bar-fill org-payments-fill" [style.width.%]="barWidth(dashboard.totalOrganizationPayments)"></div></div>
              <span class="value">{{ dashboard.totalOrganizationPayments }}</span>
            </div>
            <div class="bar-item">
              <span class="label">Documents</span>
              <div class="bar-track"><div class="bar-fill docs-fill" [style.width.%]="barWidth(dashboard.totalDocuments)"></div></div>
              <span class="value">{{ dashboard.totalDocuments }}</span>
            </div>
          </div>
        </div>
      }
    }
  `,
  styles: `
    .loading-state { color: #64748b; font-size: 0.95rem; }
    .stats-grid {
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.25rem; 
      margin-bottom: 2rem;
    }
    .stat-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 4px 18px rgba(15, 34, 58, 0.04);
      border: 1px solid #f1f5f9;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .stat-card.clickable { cursor: pointer; }
    .stat-card.clickable:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 24px rgba(15, 34, 58, 0.08);
      background: #fdfdfd;
    }
    .stat-icon {
      font-size: 1.75rem;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: grid;
      place-items: center;
    }
    .stat-info h3 { margin: 0; font-size: 0.85rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.02em; }
    .stat-info p { margin: 0.25rem 0 0; font-size: 2.25rem; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; }

    /* Icons */
    .users-card .stat-icon { background: rgba(37, 99, 235, 0.1); color: #2563eb; }
    .filings-card .stat-icon { background: rgba(13, 148, 136, 0.1); color: #0d9488; }
    .payments-card .stat-icon { background: rgba(220, 38, 38, 0.1); color: #dc2626; }
    .documents-card .stat-icon { background: rgba(124, 58, 237, 0.1); color: #7c3aed; }

    .individual-filings .stat-icon { background: rgba(37, 99, 235, 0.1); color: #2563eb; }
    .organization-filings .stat-icon { background: rgba(79, 70, 229, 0.1); color: #4f46e5; }
    .individual-payments .stat-icon { background: rgba(219, 39, 119, 0.1); color: #db2777; }
    .organization-payments .stat-icon { background: rgba(16, 185, 129, 0.1); color: #10b981; }

    /* Admin Panel and Tabs */
    .admin-panel { margin-top: 1rem; }
    .tab-header { display: flex; gap: 0.5rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; margin-bottom: 1.5rem; }
    .tab-btn {
      padding: 0.6rem 1.25rem; border: none; background: transparent; font-weight: 600; font-size: 0.95rem;
      color: #64748b; border-radius: 8px; cursor: pointer; transition: all 0.2s;
    }
    .tab-btn:hover { background: #f1f5f9; color: #0f172a; }
    .tab-btn.active { background: #e0e7ff; color: #4f46e5; }

    .table-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 4px 18px rgba(15, 34, 58, 0.04);
      border: 1px solid #f1f5f9;
    }
    .table-card h2 { margin: 0 0 1.25rem 0; font-size: 1.15rem; font-weight: 700; color: #0f172a; }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 0.75rem 1rem; border-bottom: 2px solid #e2e8f0; font-size: 0.8rem; color: #64748b; text-transform: uppercase; }
    td { text-align: left; padding: 0.85rem 1rem; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; color: #334155; }
    tr:last-child td { border-bottom: none; }
    
    .badge { padding: 0.25rem 0.6rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; display: inline-block; }
    .role-badge { background: #eff6ff; color: #1d4ed8; }
    .type-badge { background: #f0fdf4; color: #166534; }
    .status-badge { background: #f0fdf4; color: #166534; }
    .type-tag { font-size: 0.78rem; font-weight: 600; background: #f1f5f9; padding: 0.2rem 0.5rem; border-radius: 6px; color: #475569; }
    
    .email-sub { color: #94a3b8; }
    .tx-id code { font-family: monospace; font-size: 0.85rem; color: #db2777; background: #fdf2f8; padding: 0.15rem 0.4rem; border-radius: 4px; }
    .empty { text-align: center; color: #94a3b8; padding: 3rem; }

    /* Chart Panel */
    .chart-panel {
      background: #ffffff;
      border-radius: 16px;
      padding: 1.75rem;
      box-shadow: 0 4px 18px rgba(15, 34, 58, 0.04);
      border: 1px solid #f1f5f9;
    }
    .chart-panel h2 { margin: 0 0 1.5rem 0; font-size: 1.2rem; font-weight: 700; color: #0f172a; }
    .bars { display: flex; flex-direction: column; gap: 1.25rem; }
    .bar-item { display: grid; grid-template-columns: 180px 1fr 40px; align-items: center; gap: 1rem; }
    .bar-item .label { font-size: 0.9rem; font-weight: 500; color: #475569; }
    .bar-item .value { font-size: 0.95rem; font-weight: 700; color: #0f172a; text-align: right; }
    .bar-track { height: 10px; background: #f1f5f9; border-radius: 999px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 999px; transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1); }

    .users-fill { background: linear-gradient(90deg, #3b82f6, #2563eb); }
    .filings-fill { background: linear-gradient(90deg, #14b8a6, #0d9488); }
    .payments-fill { background: linear-gradient(90deg, #f87171, #dc2626); }
    
    .indiv-filings-fill { background: linear-gradient(90deg, #60a5fa, #2563eb); }
    .org-filings-fill { background: linear-gradient(90deg, #818cf8, #4f46e5); }
    .indiv-payments-fill { background: linear-gradient(90deg, #f472b6, #db2777); }
    .org-payments-fill { background: linear-gradient(90deg, #34d399, #10b981); }
    .docs-fill { background: linear-gradient(90deg, #a78bfa, #7c3aed); }
  `
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly paymentService = inject(PaymentService);
  private readonly taxFilingService = inject(TaxFilingService);

  dashboard: DashboardResponse | null = null;
  loading = true;
  private maxValue = 1;

  // Admin lists
  users: User[] = [];
  payments: Payment[] = [];
  filings: TaxFiling[] = [];
  activeTab: 'users' | 'filings' | 'payments' = 'users';

  ngOnInit(): void {
    const userId = this.authService.isAdmin() ? undefined : this.authService.currentUser()?.id;
    this.dashboardService.getDashboard(userId).subscribe({
      next: (data) => {
        this.dashboard = data;
        this.maxValue = Math.max(
          data.totalUsers || 0,
          data.totalIndividualFilings || 0,
          data.totalOrganizationFilings || 0,
          data.totalIndividualPayments || 0,
          data.totalOrganizationPayments || 0,
          data.totalDocuments || 0,
          1
        );
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    if (this.authService.isAdmin()) {
      this.userService.getAll().subscribe((users) => (this.users = users));
      this.taxFilingService.getAll().subscribe((filings) => (this.filings = filings));
      this.paymentService.getAll().subscribe((payments) => (this.payments = payments));
    }
  }

  barWidth(value: number): number {
    return Math.max((value / this.maxValue) * 100, 6);
  }
}
