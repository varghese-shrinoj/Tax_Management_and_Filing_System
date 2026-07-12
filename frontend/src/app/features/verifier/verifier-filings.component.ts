import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DecimalPipe, LowerCasePipe } from '@angular/common';
import { TaxFilingService } from '../../core/services/tax-filing.service';
import { TaxFiling } from '../../core/models';

@Component({
  selector: 'app-verifier-filings',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe, LowerCasePipe],
  template: `
    <section class="page-header">
      <h1>🔍 Verify Tax Filings</h1>
      <p>Review and approve or reject submitted tax returns</p>
    </section>

    @if (notification) {
      <div class="notification" [class.notif-success]="notification.type === 'success'" [class.notif-error]="notification.type === 'error'">
        <span>{{ notification.message }}</span>
        <button type="button" (click)="notification = null">✕</button>
      </div>
    }

    <div class="summary-bar">
      <div class="summary-item pending">
        <span class="count">{{ pendingCount }}</span>
        <span class="label">Pending Review</span>
      </div>
      <div class="summary-item approved">
        <span class="count">{{ approvedCount }}</span>
        <span class="label">Approved</span>
      </div>
      <div class="summary-item rejected">
        <span class="count">{{ rejectedCount }}</span>
        <span class="label">Rejected</span>
      </div>
    </div>

    @if (selectedFiling) {
      <div class="detail-panel">
        <div class="detail-header">
          <h2>Filing #{{ selectedFiling.id }} — {{ selectedFiling.user?.fullName }}</h2>
          <button type="button" class="btn btn-outline" (click)="selectedFiling = null; rejectMode = false">← Back to List</button>
        </div>

        <div class="detail-card">
          <h3>Filing Details</h3>
          <div class="detail-row"><span>Taxpayer</span><strong>{{ selectedFiling.user?.fullName }}</strong></div>
          <div class="detail-row"><span>Email</span><strong>{{ selectedFiling.user?.email }}</strong></div>
          <div class="detail-row"><span>Filing Type</span><strong>{{ selectedFiling.filingType ?? 'INDIVIDUAL' }}</strong></div>
          @if (selectedFiling.organizationName) {
            <div class="detail-row"><span>Organisation</span><strong>{{ selectedFiling.organizationName }}</strong></div>
          }
          <div class="detail-row"><span>Financial Year</span><strong>{{ selectedFiling.financialYear }}</strong></div>
          <div class="detail-row"><span>Filing Date</span><strong>{{ selectedFiling.filingDate }}</strong></div>
          <div class="detail-row"><span>Annual Income</span><strong>₹{{ selectedFiling.annualIncome | number }}</strong></div>
          <div class="detail-row"><span>Tax Amount</span><strong>₹{{ selectedFiling.taxAmount | number }}</strong></div>
          <div class="detail-row"><span>Current Status</span>
            <strong><span class="badge badge-{{ selectedFiling.status | lowercase }}">{{ selectedFiling.status }}</span></strong>
          </div>
        </div>

        @if (selectedFiling.status === 'PENDING' || selectedFiling.status === 'FILED') {
          @if (!rejectMode) {
            <div class="action-bar">
              <button type="button" class="btn btn-approve" (click)="approve(selectedFiling)" [disabled]="busy">
                {{ busy ? 'Processing...' : '✓ Approve Filing' }}
              </button>
              <button type="button" class="btn btn-reject" (click)="rejectMode = true">
                ✗ Reject with Feedback
              </button>
            </div>
          } @else {
            <div class="reject-form">
              <h3>✗ Rejection Feedback</h3>
              <p class="hint">Provide clear feedback so the taxpayer knows exactly what to fix.</p>
              <form [formGroup]="rejectForm" (ngSubmit)="reject(selectedFiling!)">
                <textarea formControlName="feedback" rows="5" placeholder="e.g. The annual income does not match the attached documents. Please re-upload a valid income certificate."></textarea>
                @if (rejectForm.controls.feedback.touched && rejectForm.controls.feedback.invalid) {
                  <small class="err">Feedback is required before rejecting.</small>
                }
                <div class="form-actions">
                  <button type="button" class="btn btn-outline" (click)="rejectMode = false">Cancel</button>
                  <button type="submit" class="btn btn-reject" [disabled]="rejectForm.invalid || busy">
                    {{ busy ? 'Submitting...' : '✗ Confirm Rejection' }}
                  </button>
                </div>
              </form>
            </div>
          }
        }
      </div>
    } @else {
      <div class="panel">
        <div class="toolbar">
          <button class="filter-btn" [class.active]="statusFilter === 'PENDING'" (click)="statusFilter = 'PENDING'; applyFilter()">⏳ Pending</button>
          <button class="filter-btn" [class.active]="statusFilter === 'APPROVED'" (click)="statusFilter = 'APPROVED'; applyFilter()">✓ Approved</button>
          <button class="filter-btn" [class.active]="statusFilter === 'REJECTED'" (click)="statusFilter = 'REJECTED'; applyFilter()">✗ Rejected</button>
          <button class="filter-btn" [class.active]="statusFilter === ''" (click)="statusFilter = ''; applyFilter()">All</button>
        </div>

        @if (loading) {
          <p class="loading">Loading filings...</p>
        } @else {
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Taxpayer</th><th>Type</th><th>Year</th>
                  <th>Income</th><th>Tax</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                @for (filing of filteredFilings; track filing.id) {
                  <tr [class.row-pending]="filing.status === 'PENDING' || filing.status === 'FILED'">
                    <td><strong>#{{ filing.id }}</strong></td>
                    <td>
                      {{ filing.user?.fullName }}
                      <br><small class="sub">{{ filing.user?.email }}</small>
                    </td>
                    <td><span class="type-tag">{{ filing.filingType ?? 'IND' }}</span></td>
                    <td>{{ filing.financialYear }}</td>
                    <td>₹{{ filing.annualIncome | number }}</td>
                    <td>₹{{ filing.taxAmount | number }}</td>
                    <td><span class="badge badge-{{ filing.status | lowercase }}">{{ filing.status }}</span></td>
                    <td>
                      @if (filing.status === 'PENDING' || filing.status === 'FILED') {
                        <button class="btn btn-sm btn-review" (click)="selectFiling(filing)">Review →</button>
                      } @else {
                        <button class="btn btn-sm btn-outline" (click)="selectFiling(filing)">View</button>
                      }
                    </td>
                  </tr>
                } @empty {
                  <tr><td colspan="8" class="empty">No filings match the selected filter.</td></tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    }
  `,
  styles: `
    .page-header { margin-bottom: 1.5rem; }
    .page-header h1 { margin: 0; font-size: 1.6rem; font-weight: 800; color: #0f172a; }
    .page-header p { margin: 0.25rem 0 0; color: #64748b; }

    .notification {
      padding: 0.9rem 1.25rem; border-radius: 12px; margin-bottom: 1.25rem;
      display: flex; align-items: center; justify-content: space-between; gap: 1rem;
    }
    .notif-success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
    .notif-error { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; }
    .notification button { background: none; border: none; cursor: pointer; font-size: 1rem; color: inherit; }

    .summary-bar { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
    .summary-item {
      flex: 1; padding: 1.25rem; border-radius: 14px; text-align: center;
      display: flex; flex-direction: column; gap: 0.25rem;
    }
    .summary-item.pending { background: #fefce8; border: 1px solid #fde68a; }
    .summary-item.approved { background: #f0fdf4; border: 1px solid #bbf7d0; }
    .summary-item.rejected { background: #fef2f2; border: 1px solid #fecaca; }
    .summary-item .count { font-size: 2rem; font-weight: 800; }
    .summary-item.pending .count { color: #b45309; }
    .summary-item.approved .count { color: #15803d; }
    .summary-item.rejected .count { color: #b91c1c; }
    .summary-item .label { font-size: 0.78rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }

    .panel { background: #fff; border-radius: 16px; padding: 1.5rem; box-shadow: 0 4px 18px rgba(15,34,58,0.04); border: 1px solid #f1f5f9; }
    .toolbar { display: flex; gap: 0.5rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
    .filter-btn {
      padding: 0.45rem 1rem; border: 1.5px solid #e2e8f0; border-radius: 999px;
      background: #fff; cursor: pointer; font-size: 0.84rem; font-weight: 600; color: #64748b; transition: all 0.15s;
    }
    .filter-btn.active { background: #4f46e5; border-color: #4f46e5; color: #fff; }

    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 0.7rem 1rem; border-bottom: 2px solid #e2e8f0; font-size: 0.76rem; color: #64748b; text-transform: uppercase; }
    td { text-align: left; padding: 0.85rem 1rem; border-bottom: 1px solid #f1f5f9; font-size: 0.88rem; color: #334155; }
    tr:last-child td { border-bottom: none; }
    .row-pending { background: #fffbeb; }
    .sub { color: #94a3b8; font-size: 0.76rem; }
    .loading, .empty { text-align: center; color: #94a3b8; padding: 2.5rem; }
    .type-tag { font-size: 0.74rem; font-weight: 700; background: #f1f5f9; padding: 0.2rem 0.5rem; border-radius: 6px; color: #475569; }

    .badge { padding: 0.25rem 0.65rem; border-radius: 999px; font-size: 0.74rem; font-weight: 700; display: inline-block; }
    .badge-pending { background: #fef3c7; color: #92400e; }
    .badge-approved { background: #d1fae5; color: #065f46; }
    .badge-rejected { background: #fee2e2; color: #991b1b; }
    .badge-draft { background: #e0e7ff; color: #3730a3; }
    .badge-filed { background: #f0fdf4; color: #166534; }

    .btn { padding: 0.55rem 1.1rem; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; font-size: 0.875rem; transition: all 0.15s; }
    .btn-outline { background: #fff; border: 1.5px solid #cbd5e1; color: #475569; }
    .btn-outline:hover { background: #f8fafc; }
    .btn-sm { padding: 0.4rem 0.85rem; font-size: 0.8rem; }
    .btn-review { background: #4f46e5; color: #fff; }
    .btn-review:hover { background: #4338ca; }
    .btn-approve { background: #10b981; color: #fff; padding: 0.75rem 1.75rem; font-size: 0.95rem; border-radius: 10px; }
    .btn-approve:hover:not(:disabled) { background: #059669; }
    .btn-reject { background: #ef4444; color: #fff; padding: 0.75rem 1.75rem; font-size: 0.95rem; border-radius: 10px; }
    .btn-reject:hover:not(:disabled) { background: #dc2626; }
    button:disabled { opacity: 0.6; cursor: not-allowed; }

    .detail-panel { background: #fff; border-radius: 16px; padding: 1.75rem; box-shadow: 0 4px 18px rgba(15,34,58,0.04); border: 1px solid #f1f5f9; }
    .detail-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
    .detail-header h2 { margin: 0; font-size: 1.2rem; font-weight: 700; color: #0f172a; }
    .detail-card { background: #f8fafc; border-radius: 12px; padding: 1.25rem; border: 1px solid #e2e8f0; margin-bottom: 1.5rem; }
    .detail-card h3 { margin: 0 0 1rem; font-size: 0.88rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.04em; }
    .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; }
    .detail-row:last-child { border-bottom: none; }
    .detail-row span { color: #64748b; }
    .detail-row strong { color: #0f172a; }

    .action-bar { display: flex; gap: 1rem; flex-wrap: wrap; padding: 1.25rem 0 0; border-top: 2px solid #f1f5f9; }

    .reject-form { padding: 1.25rem; background: #fef2f2; border-radius: 12px; border: 1px solid #fecaca; }
    .reject-form h3 { margin: 0 0 0.4rem; font-size: 1rem; font-weight: 700; color: #991b1b; }
    .reject-form .hint { color: #dc2626; font-size: 0.85rem; margin: 0 0 0.85rem; }
    .reject-form textarea {
      width: 100%; padding: 0.75rem; border: 1.5px solid #fecaca;
      border-radius: 10px; font-size: 0.9rem; resize: vertical; font-family: inherit; box-sizing: border-box;
    }
    .reject-form textarea:focus { outline: none; border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }
    .form-actions { display: flex; gap: 0.75rem; margin-top: 0.85rem; }
    .err { color: #dc2626; font-size: 0.82rem; margin-top: 0.25rem; display: block; }
  `
})
export class VerifierFilingsComponent implements OnInit {
  private readonly taxFilingService = inject(TaxFilingService);
  private readonly fb = inject(FormBuilder);

  allFilings: TaxFiling[] = [];
  filteredFilings: TaxFiling[] = [];

  loading = true;
  busy = false;
  statusFilter = 'PENDING';
  selectedFiling: TaxFiling | null = null;
  rejectMode = false;
  notification: { type: 'success' | 'error'; message: string } | null = null;

  readonly rejectForm = this.fb.nonNullable.group({
    feedback: ['', Validators.required]
  });

  get pendingCount(): number { return this.allFilings.filter(f => f.status === 'PENDING' || f.status === 'FILED').length; }
  get approvedCount(): number { return this.allFilings.filter(f => f.status === 'APPROVED').length; }
  get rejectedCount(): number { return this.allFilings.filter(f => f.status === 'REJECTED').length; }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.taxFilingService.getAll().subscribe({
      next: (filings) => {
        this.allFilings = filings;
        this.applyFilter();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  applyFilter(): void {
    if (this.statusFilter === 'PENDING') {
      // Show both FILED and PENDING in the pending review tab
      this.filteredFilings = this.allFilings.filter(f => f.status === 'PENDING' || f.status === 'FILED');
    } else if (this.statusFilter) {
      this.filteredFilings = this.allFilings.filter(f => f.status === this.statusFilter);
    } else {
      this.filteredFilings = [...this.allFilings];
    }
  }

  selectFiling(filing: TaxFiling): void {
    this.selectedFiling = { ...filing };
    this.rejectMode = false;
    this.rejectForm.reset();
  }

  approve(filing: TaxFiling): void {
    this.busy = true;
    this.taxFilingService.approve(filing.id!).subscribe({
      next: () => {
        this.busy = false;
        this.selectedFiling = null;
        this.notify('success', `✓ Filing #${filing.id} has been APPROVED successfully.`);
        this.load();
      },
      error: () => { this.busy = false; this.notify('error', 'Failed to approve. Please try again.'); }
    });
  }

  reject(filing: TaxFiling): void {
    if (this.rejectForm.invalid) return;
    this.busy = true;
    const feedback = this.rejectForm.getRawValue().feedback;
    this.taxFilingService.reject(filing.id!, feedback).subscribe({
      next: () => {
        this.busy = false;
        this.selectedFiling = null;
        this.rejectMode = false;
        this.notify('success', `✗ Filing #${filing.id} has been REJECTED. Feedback sent to taxpayer.`);
        this.load();
      },
      error: () => { this.busy = false; this.notify('error', 'Failed to reject. Please try again.'); }
    });
  }

  private notify(type: 'success' | 'error', message: string): void {
    this.notification = { type, message };
    setTimeout(() => { this.notification = null; }, 5000);
  }
}
