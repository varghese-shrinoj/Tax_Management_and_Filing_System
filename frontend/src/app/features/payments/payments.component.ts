import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentService } from '../../core/services/payment.service';
import { TaxFilingService } from '../../core/services/tax-filing.service';
import { AuthService } from '../../core/services/auth.service';
import { Payment, PaymentRequest, TaxFiling } from '../../core/models';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe],
  template: `
    <section class="page-header">
      <h1>Payments</h1>
      <p>{{ authService.isAdmin() ? 'Record and manage tax payment transactions' : 'View your tax payment history' }}</p>
    </section>

    @if (authService.isAdmin()) {
    <div class="panel">
      <form [formGroup]="form" (ngSubmit)="save()" class="form-grid">
        <input type="date" formControlName="paymentDate" />
        <input type="number" formControlName="amount" placeholder="Amount" />
        <input type="text" formControlName="paymentMethod" placeholder="Payment Method" />
        <select formControlName="paymentStatus">
          <option value="PENDING">PENDING</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="FAILED">FAILED</option>
        </select>
        <input type="text" formControlName="transactionId" placeholder="Transaction ID" />
        <select formControlName="taxFilingId">
          @for (filing of filings; track filing.id) {
            <option [value]="filing.id">#{{ filing.id }} - {{ filing.financialYear }}</option>
          }
        </select>
        <button type="submit" class="btn btn-primary">{{ editingId ? 'Update' : 'Add Payment' }}</button>
        @if (editingId) {
          <button type="button" class="btn btn-outline" (click)="resetForm()">Cancel</button>
        }
      </form>
    </div>
    }

    <div class="panel">
      <div class="toolbar">
        <input type="search" placeholder="Search by transaction ID..." [value]="searchTerm"
          (input)="searchTerm = $any($event.target).value; applyFilters()" />
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th><th>Date</th><th>Amount</th><th>Method</th><th>Status</th><th>Transaction</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (payment of pagedPayments; track payment.id) {
            <tr>
              <td>{{ payment.id }}</td>
              <td>{{ payment.paymentDate }}</td>
              <td>{{ payment.amount | number }}</td>
              <td>{{ payment.paymentMethod }}</td>
              <td><span class="badge">{{ payment.paymentStatus }}</span></td>
              <td>{{ payment.transactionId }}</td>
              <td class="actions">
                @if (authService.isAdmin()) {
                  <button class="btn btn-sm" (click)="edit(payment)">Edit</button>
                  <button class="btn btn-sm btn-danger" (click)="remove(payment.id!)">Delete</button>
                } @else {
                  <span class="muted">—</span>
                }
              </td>
            </tr>
          } @empty {
            <tr><td colspan="7">No payments found</td></tr>
          }
        </tbody>
      </table>

      <div class="pagination">
        <button class="btn btn-sm" [disabled]="page === 1" (click)="page = page - 1; paginate()">Prev</button>
        <span>Page {{ page }} / {{ totalPages }}</span>
        <button class="btn btn-sm" [disabled]="page >= totalPages" (click)="page = page + 1; paginate()">Next</button>
      </div>
    </div>
  `,
  styles: `
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem; }
    .toolbar input { width: 100%; max-width: 320px; padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 0.75rem; border-bottom: 1px solid #e2e8f0; }
    .actions { display: flex; gap: 0.5rem; }
    .pagination { display: flex; gap: 1rem; align-items: center; margin-top: 1rem; }
    .muted { color: #94a3b8; }
  `
})
export class PaymentsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly paymentService = inject(PaymentService);
  private readonly taxFilingService = inject(TaxFilingService);
  readonly authService = inject(AuthService);

  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  pagedPayments: Payment[] = [];
  filings: TaxFiling[] = [];
  searchTerm = '';
  page = 1;
  pageSize = 5;
  totalPages = 1;
  editingId: number | null = null;

  readonly form = this.fb.nonNullable.group({
    paymentDate: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
    paymentMethod: ['', Validators.required],
    paymentStatus: ['PENDING', Validators.required],
    transactionId: ['', Validators.required],
    taxFilingId: [0, Validators.required]
  });

  ngOnInit(): void {
    if (this.authService.isAdmin()) {
      this.taxFilingService.getAll().subscribe((data) => {
        this.filings = data;
        if (data[0]?.id) this.form.patchValue({ taxFilingId: data[0].id });
      });
    }
    this.loadPayments();
  }

  loadPayments(): void {
    this.paymentService.getAll().subscribe((data) => {
      const userId = this.authService.currentUser()?.id;
      this.payments = this.authService.isAdmin()
        ? data
        : data.filter((p) => p.taxFiling?.user?.id == userId && p.taxFiling?.filingType === 'INDIVIDUAL');
      this.applyFilters();
    });
  }

  applyFilters(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredPayments = this.payments.filter(
      (p) => (p.transactionId ?? '').toLowerCase().includes(term) || 
             (p.paymentMethod ?? '').toLowerCase().includes(term)
    );
    this.totalPages = Math.max(1, Math.ceil(this.filteredPayments.length / this.pageSize));
    this.paginate();
  }

  paginate(): void {
    const start = (this.page - 1) * this.pageSize;
    this.pagedPayments = this.filteredPayments.slice(start, start + this.pageSize);
  }

  save(): void {
    if (this.form.invalid) return;
    const payload = this.form.getRawValue() as PaymentRequest;

    if (this.editingId) {
      this.paymentService.update(this.editingId, payload).subscribe(() => {
        this.resetForm();
        this.loadPayments();
      });
      return;
    }

    this.paymentService.create(payload).subscribe(() => {
      this.resetForm();
      this.loadPayments();
    });
  }

  edit(payment: Payment): void {
    this.editingId = payment.id ?? null;
    this.form.patchValue({
      paymentDate: payment.paymentDate,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      paymentStatus: payment.paymentStatus,
      transactionId: payment.transactionId,
      taxFilingId: payment.taxFiling?.id ?? 0
    });
  }

  remove(id: number): void {
    if (!confirm('Delete this payment?')) return;
    this.paymentService.delete(id).subscribe(() => this.loadPayments());
  }

  resetForm(): void {
    this.editingId = null;
    this.form.reset({
      paymentDate: '',
      amount: 0,
      paymentMethod: '',
      paymentStatus: 'PENDING',
      transactionId: '',
      taxFilingId: this.filings[0]?.id ?? 0
    });
  }
}
