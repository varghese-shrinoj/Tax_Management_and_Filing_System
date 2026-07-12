import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaxFilingService } from '../../core/services/tax-filing.service';
import { TaxTypeService } from '../../core/services/tax-type.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { DocumentService } from '../../core/services/document.service';
import { PaymentService } from '../../core/services/payment.service';
import { INDIVIDUAL_DOCUMENTS, ORGANIZATION_DOCUMENTS, RequiredDocument } from '../../core/constants/document.constants';
import { DocumentCategory, FilingType, TaxFiling, TaxFilingRequest, TaxType, User } from '../../core/models';

@Component({
  selector: 'app-tax-filings',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe],
  template: `
    <section class="page-header">
      <h1>Individual Tax Filings</h1>
      <p>{{ authService.isAdmin() ? 'Create and track annual tax return submissions' : 'File your tax return in 2 steps: details, payment' }}</p>
    </section>

    @if (authService.isAdmin()) {
      <div class="panel">
        <form [formGroup]="adminForm" (ngSubmit)="saveAdmin()" class="form-grid">
          <input type="text" formControlName="financialYear" placeholder="Financial Year (2024-25)" />
          <input type="number" formControlName="annualIncome" placeholder="Annual Income" />
          <input type="number" formControlName="taxAmount" placeholder="Tax Amount" />
          <input type="date" formControlName="filingDate" />
          <select formControlName="filingType">
            <option value="INDIVIDUAL">Individual</option>
            <option value="ORGANIZATION">Organization</option>
          </select>
          @if (adminForm.value.filingType === 'ORGANIZATION') {
            <input type="text" formControlName="organizationName" placeholder="Organization Name" />
          }
          <select formControlName="status">
            <option value="DRAFT">DRAFT</option>
            <option value="AWAITING_PAYMENT">AWAITING_PAYMENT</option>
            <option value="FILED">FILED</option>
            <option value="PENDING">PENDING</option>
            <option value="SUBMITTED">SUBMITTED</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
          <select formControlName="userId">
            @for (user of users; track user.id) {
              <option [value]="user.id">{{ user.fullName }}</option>
            }
          </select>
          <select formControlName="taxTypeId">
            @for (type of taxTypes; track type.id) {
              <option [value]="type.id">{{ type.taxName }}</option>
            }
          </select>
          <button type="submit" class="btn btn-primary">{{ editingId ? 'Update' : 'File Tax' }}</button>
          @if (editingId) {
            <button type="button" class="btn btn-outline" (click)="resetAdminForm()">Cancel</button>
          }
        </form>
      </div>
    } @else {
      @if (showWizard) {
        <div class="panel wizard">
          <div class="steps">
            <span [class.active]="wizardStep >= 1">1. Details</span>
            <span [class.active]="wizardStep >= 2">2. Payment</span>
          </div>

          @if (wizardStep === 1) {
            <form [formGroup]="detailsForm" (ngSubmit)="saveDetailsStep()" class="form-grid">
              <input type="text" formControlName="financialYear" placeholder="Financial Year (2024-25)" />
              <input type="number" formControlName="annualIncome" placeholder="Annual Income" />
              <input type="number" formControlName="taxAmount" placeholder="Tax Amount" />
              <input type="date" formControlName="filingDate" />
              <select formControlName="taxTypeId">
                @for (type of taxTypes; track type.id) {
                  <option [value]="type.id">{{ type.taxName }}</option>
                }
              </select>
              <div class="wizard-actions">
                <button type="button" class="btn btn-outline" (click)="cancelWizard()">Cancel</button>
                <button type="submit" class="btn btn-primary">Continue to Payment</button>
              </div>
            </form>
          }

          @if (wizardStep === 2) {
            <div class="payment-card">
              <div class="payment-header">
                <div class="upi-logo">💳 UPI Payment</div>
                <div class="pay-amount">₹{{ paymentForm.value.amount | number }}</div>
                <p class="pay-label">Tax Amount Due</p>
              </div>
              <form [formGroup]="paymentForm" (ngSubmit)="submitPayment()" class="pay-form">
                <input type="hidden" formControlName="paymentDate" />
                <input type="hidden" formControlName="amount" />
                <div class="pay-field">
                  <label>Your UPI ID</label>
                  <input type="text" formControlName="upiId" placeholder="e.g. yourname@upi" class="upi-input" />
                </div>
                @if (paymentError) {
                  <p class="error">{{ paymentError }}</p>
                }
                <div class="wizard-actions">
                  <button type="button" class="btn btn-outline" (click)="wizardStep = 1">Back</button>
                  <button type="submit" class="btn btn-pay" [disabled]="submittingPayment || paymentForm.invalid">
                    {{ submittingPayment ? 'Processing...' : '✓ Make Payment' }}
                  </button>
                </div>
              </form>
            </div>
          }
        </div>
      } @else if (editingId) {
        <div class="panel">
          <h2>Edit Filing Details</h2>
          <form [formGroup]="detailsForm" (ngSubmit)="saveDetailsEdit()" class="form-grid">
            <input type="text" formControlName="financialYear" placeholder="Financial Year (2024-25)" />
            <input type="number" formControlName="annualIncome" placeholder="Annual Income" />
            <input type="number" formControlName="taxAmount" placeholder="Tax Amount" />
            <input type="date" formControlName="filingDate" />
            <select formControlName="taxTypeId">
              @for (type of taxTypes; track type.id) {
                <option [value]="type.id">{{ type.taxName }}</option>
              }
            </select>
            <div class="wizard-actions">
              <button type="button" class="btn btn-outline" (click)="cancelEdit()">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      } @else {
        <div class="panel toolbar-row">
          <button type="button" class="btn btn-primary" (click)="startWizard()">+ File New Tax Return</button>
        </div>
      }
    }

    <div class="panel">
      @if (authService.isAdmin()) {
        <div class="toolbar">
          <select [value]="filterStatus" (change)="filterStatus = $any($event.target).value; applyFilter()">
            <option value="">All Statuses</option>
            <option value="DRAFT">DRAFT</option>
            <option value="AWAITING_PAYMENT">AWAITING_PAYMENT</option>
            <option value="FILED">FILED</option>
            <option value="PENDING">PENDING</option>
            <option value="SUBMITTED">SUBMITTED</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
          <input type="text" placeholder="Filter by year" [value]="filterYear"
            (input)="filterYear = $any($event.target).value; applyFilter()" />
        </div>
      } @else {
        <div class="toolbar">
          <input type="text" placeholder="Filter by year" [value]="filterYear"
            (input)="filterYear = $any($event.target).value; applyLocalFilter()" />
        </div>
      }

      <table>
        <thead>
          <tr>
            <th>ID</th><th>Year</th><th>Type</th><th>Income</th><th>Tax</th><th>Status</th>
            @if (authService.isAdmin()) { <th>User</th> }
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (filing of pagedFilings; track filing.id) {
            <tr>
              <td>{{ filing.id }}</td>
              <td>{{ filing.financialYear }}</td>
              <td>{{ filingLabel(filing) }}</td>
              <td>{{ filing.annualIncome | number }}</td>
              <td>{{ filing.taxAmount | number }}</td>
              <td>
                <span class="badge">{{ filing.status }}</span>
                @if (filing.status === 'REJECTED' && filing.feedback) {
                  <div class="feedback-box">
                    <strong>⚠ Verifier Feedback:</strong>
                    <p>{{ filing.feedback }}</p>
                  </div>
                }
                @if (filing.status === 'APPROVED') {
                  <div class="approved-note">✓ Approved by verifier</div>
                }
              </td>
              @if (authService.isAdmin()) {
                <td>{{ filing.user?.fullName }}</td>
              }
              <td class="actions">
                @if (authService.isAdmin()) {
                  <button class="btn btn-sm" (click)="editAdmin(filing)">Edit</button>
                  <button class="btn btn-sm btn-danger" (click)="remove(filing.id!)">Delete</button>
                } @else {
                  @if (filing.status === 'REJECTED') {
                    <button class="btn btn-sm btn-resubmit" (click)="editTaxpayer(filing)">✎ Fix & Resubmit</button>
                  } @else if (filing.status !== 'APPROVED') {
                    <button class="btn btn-sm" (click)="editTaxpayer(filing)">Edit Details</button>
                  }
                }
              </td>
            </tr>
          } @empty {
            <tr><td [attr.colspan]="authService.isAdmin() ? 8 : 7">
              {{ authService.isAdmin() ? 'No tax filings found' : 'No filed returns yet. Complete all 2 steps to see your filing here.' }}
            </td></tr>
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
    .toolbar, .toolbar-row { display: flex; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap; align-items: center; }
    .toolbar select, .toolbar input { padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 0.75rem; border-bottom: 1px solid #e2e8f0; }
    .actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .pagination { display: flex; gap: 1rem; align-items: center; margin-top: 1rem; }
    .feedback-box {
      margin-top: 0.4rem; padding: 0.5rem 0.65rem; background: #fef2f2;
      border: 1px solid #fecaca; border-radius: 8px; font-size: 0.8rem; color: #991b1b;
    }
    .feedback-box p { margin: 0.2rem 0 0; }
    .approved-note { margin-top: 0.4rem; font-size: 0.8rem; color: #15803d; font-weight: 600; }
    .btn-resubmit { background: #f59e0b; color: #fff; }
    .btn-resubmit:hover { background: #d97706; }
    .wizard .steps { display: flex; gap: 1rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
    .wizard .steps span { padding: 0.35rem 0.85rem; border-radius: 999px; background: #e2e8f0; color: #64748b; font-size: 0.85rem; }
    .wizard .steps span.active { background: #4f46e5; color: #fff; }
    .wizard-actions { display: flex; gap: 0.75rem; margin-top: 1rem; }
    .step-panel { display: flex; flex-direction: column; gap: 0.85rem; }
    .hint { color: #64748b; margin: 0; }
    .doc-upload-row { display: flex; flex-direction: column; gap: 0.35rem; padding: 0.75rem; background: #f8fafc; border-radius: 8px; }
    .doc-upload-row label { font-weight: 600; color: #334155; }
    .uploaded { color: #0f766e; font-size: 0.9rem; }
    .error { color: #dc2626; margin: 0; }
    .payment-card { border: 2px solid #e0e7ff; border-radius: 16px; overflow: hidden; max-width: 420px; margin: 0 auto; }
    .payment-header { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 2rem; text-align: center; }
    .upi-logo { font-size: 1rem; font-weight: 600; opacity: 0.9; margin-bottom: 0.75rem; }
    .pay-amount { font-size: 2.5rem; font-weight: 800; letter-spacing: -0.02em; }
    .pay-label { font-size: 0.85rem; opacity: 0.8; margin-top: 0.25rem; }
    .pay-form { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
    .pay-field { display: flex; flex-direction: column; gap: 0.4rem; }
    .pay-field label { font-weight: 600; font-size: 0.85rem; color: #374151; }
    .upi-input { padding: 0.75rem 1rem; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 1rem; transition: border-color 0.2s; }
    .upi-input:focus { outline: none; border-color: #4f46e5; }
    .btn-pay { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 10px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: opacity 0.2s; }
    .btn-pay:disabled { opacity: 0.5; cursor: not-allowed; }
  `
})
export class TaxFilingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly taxFilingService = inject(TaxFilingService);
  private readonly taxTypeService = inject(TaxTypeService);
  private readonly userService = inject(UserService);
  private readonly documentService = inject(DocumentService);
  private readonly paymentService = inject(PaymentService);
  readonly authService = inject(AuthService);

  get requiredDocs(): RequiredDocument[] {
    const ft = this.showWizard
      ? this.detailsForm.getRawValue().filingType
      : this.detailsForm.getRawValue().filingType;
    return ft === 'ORGANIZATION' ? ORGANIZATION_DOCUMENTS : INDIVIDUAL_DOCUMENTS;
  }

  filings: TaxFiling[] = [];
  pagedFilings: TaxFiling[] = [];
  users: User[] = [];
  taxTypes: TaxType[] = [];
  filterStatus = '';
  filterYear = '';
  page = 1;
  pageSize = 5;
  totalPages = 1;
  editingId: number | null = null;
  editingStatus: string = '';

  showWizard = false;
  wizardStep = 1;
  draftFilingId: number | null = null;
  uploadedByCategory: Partial<Record<DocumentCategory, string>> = {};
  paymentError = '';
  submittingPayment = false;

  readonly adminForm = this.fb.nonNullable.group({
    financialYear: ['', Validators.required],
    annualIncome: [0, [Validators.required, Validators.min(0)]],
    taxAmount: [0, [Validators.required, Validators.min(0)]],
    filingDate: ['', Validators.required],
    filingType: ['INDIVIDUAL' as FilingType, Validators.required],
    organizationName: [''],
    status: ['FILED', Validators.required],
    userId: [0, Validators.required],
    taxTypeId: [0, Validators.required]
  });

  readonly detailsForm = this.fb.nonNullable.group({
    filingType: ['INDIVIDUAL' as FilingType, Validators.required],
    organizationName: [''],
    financialYear: ['', Validators.required],
    annualIncome: [0, [Validators.required, Validators.min(0)]],
    taxAmount: [0, [Validators.required, Validators.min(0)]],
    filingDate: ['', Validators.required],
    taxTypeId: [0, Validators.required]
  });

  readonly paymentForm = this.fb.nonNullable.group({
    paymentDate: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
    upiId: ['', Validators.required]
  });

  ngOnInit(): void {
    this.taxTypeService.getAll().subscribe((types) => {
      this.taxTypes = types;
      if (types[0]?.id) {
        this.adminForm.patchValue({ taxTypeId: types[0].id });
        this.detailsForm.patchValue({ taxTypeId: types[0].id });
      }
    });

    if (this.authService.isAdmin()) {
      this.userService.getAll().subscribe((users) => {
        this.users = users;
        if (users[0]?.id) this.adminForm.patchValue({ userId: users[0].id });
      });
      this.loadAdminFilings();
    } else {
      this.loadTaxpayerFilings();
    }
  }

  filingLabel(filing: TaxFiling): string {
    if (filing.filingType === 'ORGANIZATION' && filing.organizationName) {
      return filing.organizationName;
    }
    return 'Individual';
  }

  allDocsUploaded(): boolean {
    return this.requiredDocs.every((d) => !!this.uploadedByCategory[d.category]);
  }

  startWizard(): void {
    this.showWizard = true;
    this.wizardStep = 1;
    this.draftFilingId = null;
    this.uploadedByCategory = {};
    this.paymentError = '';
    this.resetDetailsForm();
  }

  cancelWizard(): void {
    this.showWizard = false;
    this.wizardStep = 1;
    this.draftFilingId = null;
    this.uploadedByCategory = {};
    this.paymentError = '';
  }

  saveDetailsStep(): void {
    if (this.detailsForm.invalid) return;
    if (this.detailsForm.value.filingType === 'ORGANIZATION' && !this.detailsForm.value.organizationName?.trim()) {
      return;
    }

    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    const details = this.detailsForm.getRawValue();
    const payload: TaxFilingRequest = {
      financialYear: details.financialYear,
      annualIncome: details.annualIncome,
      taxAmount: details.taxAmount,
      filingDate: details.filingDate,
      taxTypeId: details.taxTypeId,
      filingType: details.filingType,
      organizationName: details.filingType === 'ORGANIZATION' ? details.organizationName : undefined,
      status: 'DRAFT',
      userId
    };

    this.taxFilingService.create(payload).subscribe({
      next: (filing) => {
        this.draftFilingId = filing.id ?? null;
        this.paymentForm.patchValue({ amount: details.taxAmount });
        this.wizardStep = 2;
      }
    });
  }

  onFileSelected(event: Event, category: DocumentCategory): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !this.draftFilingId) return;

    const today = new Date().toISOString().split('T')[0];

    this.documentService.upload({
      fileName: file.name,
      fileType: file.type || 'application/octet-stream',
      filePath: `/uploads/${file.name}`,
      uploadDate: today,
      taxFilingId: this.draftFilingId,
      documentCategory: category
    }).subscribe({
      next: () => {
        this.uploadedByCategory = { ...this.uploadedByCategory, [category]: file.name };
        input.value = '';
      }
    });
  }

  submitPayment(): void {
    if (this.paymentForm.invalid || !this.draftFilingId) return;

    this.submittingPayment = true;
    this.paymentError = '';

    const payment = this.paymentForm.getRawValue();
    this.paymentService.create({
      paymentDate: payment.paymentDate,
      amount: payment.amount,
      paymentMethod: 'UPI',
      transactionId: payment.upiId,
      paymentStatus: 'COMPLETED',
      taxFilingId: this.draftFilingId
    }).subscribe({
      next: () => {
        this.submittingPayment = false;
        this.cancelWizard();
        this.loadTaxpayerFilings();
      },
      error: (err) => {
        this.submittingPayment = false;
        this.paymentError = typeof err.error === 'string'
          ? err.error
          : 'Payment failed. Upload all 3 documents first.';
      }
    });
  }

  editTaxpayer(filing: TaxFiling): void {
    this.editingId = filing.id ?? null;
    this.editingStatus = filing.status;   // remember original status
    this.showWizard = false;
    this.detailsForm.patchValue({
      filingType: filing.filingType ?? 'INDIVIDUAL',
      organizationName: filing.organizationName ?? '',
      financialYear: filing.financialYear,
      annualIncome: filing.annualIncome,
      taxAmount: filing.taxAmount,
      filingDate: filing.filingDate,
      taxTypeId: filing.taxType?.id ?? 0
    });
  }

  saveDetailsEdit(): void {
    if (!this.editingId || this.detailsForm.invalid) return;

    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    const details = this.detailsForm.getRawValue();
    // If re-editing a REJECTED filing, set back to PENDING for re-verification
    const newStatus = this.editingStatus === 'REJECTED' ? 'PENDING' : 'FILED';
    const payload: TaxFilingRequest = {
      financialYear: details.financialYear,
      annualIncome: details.annualIncome,
      taxAmount: details.taxAmount,
      filingDate: details.filingDate,
      taxTypeId: details.taxTypeId,
      filingType: details.filingType,
      organizationName: details.filingType === 'ORGANIZATION' ? details.organizationName : undefined,
      status: newStatus,
      feedback: undefined,   // clear old verifier feedback
      userId
    };

    this.taxFilingService.update(this.editingId, payload).subscribe(() => {
      this.cancelEdit();
      this.loadTaxpayerFilings();
    });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.resetDetailsForm();
  }

  loadAdminFilings(): void {
    this.taxFilingService.getAll().subscribe((data) => {
      this.filings = data;
      this.paginate();
    });
  }

  loadTaxpayerFilings(): void {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    this.taxFilingService.getFiledByUser(userId).subscribe((data) => {
      this.filings = data;
      this.applyLocalFilter();
    });
  }

  applyFilter(): void {
    if (!this.authService.isAdmin()) {
      this.applyLocalFilter();
      return;
    }

    if (this.filterStatus) {
      this.taxFilingService.getByStatus(this.filterStatus).subscribe((data) => {
        this.filings = this.filterYear
          ? data.filter((f) => f.financialYear.includes(this.filterYear))
          : data;
        this.page = 1;
        this.paginate();
      });
      return;
    }

    if (this.filterYear) {
      this.taxFilingService.getByYear(this.filterYear).subscribe((data) => {
        this.filings = data;
        this.page = 1;
        this.paginate();
      });
      return;
    }

    this.loadAdminFilings();
  }

  applyLocalFilter(): void {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    this.taxFilingService.getFiledByUser(userId).subscribe((data) => {
      const individualData = data.filter((f) => f.filingType === 'INDIVIDUAL');
      this.filings = this.filterYear
        ? individualData.filter((f) => f.financialYear.includes(this.filterYear))
        : individualData;
      this.page = 1;
      this.paginate();
    });
  }

  paginate(): void {
    this.totalPages = Math.max(1, Math.ceil(this.filings.length / this.pageSize));
    const start = (this.page - 1) * this.pageSize;
    this.pagedFilings = this.filings.slice(start, start + this.pageSize);
  }

  saveAdmin(): void {
    if (this.adminForm.invalid) return;
    const raw = this.adminForm.getRawValue();
    const payload: TaxFilingRequest = {
      ...raw,
      organizationName: raw.filingType === 'ORGANIZATION' ? raw.organizationName : undefined
    };

    if (this.editingId) {
      this.taxFilingService.update(this.editingId, payload).subscribe(() => {
        this.resetAdminForm();
        this.applyFilter();
      });
      return;
    }

    this.taxFilingService.create(payload).subscribe(() => {
      this.resetAdminForm();
      this.applyFilter();
    });
  }

  editAdmin(filing: TaxFiling): void {
    this.editingId = filing.id ?? null;
    this.adminForm.patchValue({
      financialYear: filing.financialYear,
      annualIncome: filing.annualIncome,
      taxAmount: filing.taxAmount,
      filingDate: filing.filingDate,
      filingType: filing.filingType ?? 'INDIVIDUAL',
      organizationName: filing.organizationName ?? '',
      status: filing.status,
      userId: filing.user?.id ?? 0,
      taxTypeId: filing.taxType?.id ?? 0
    });
  }

  remove(id: number): void {
    if (!confirm('Delete this tax filing?')) return;
    this.taxFilingService.delete(id).subscribe(() => this.applyFilter());
  }

  resetAdminForm(): void {
    this.editingId = null;
    this.adminForm.reset({
      financialYear: '',
      annualIncome: 0,
      taxAmount: 0,
      filingDate: '',
      filingType: 'INDIVIDUAL',
      organizationName: '',
      status: 'FILED',
      userId: this.users[0]?.id ?? 0,
      taxTypeId: this.taxTypes[0]?.id ?? 0
    });
  }

  resetDetailsForm(): void {
    this.detailsForm.reset({
      filingType: 'INDIVIDUAL',
      organizationName: '',
      financialYear: '',
      annualIncome: 0,
      taxAmount: 0,
      filingDate: '',
      taxTypeId: this.taxTypes[0]?.id ?? 0
    });
    const today = new Date().toISOString().split('T')[0];
    this.paymentForm.reset({
      paymentDate: today,
      amount: 0,
      upiId: ''
    });
  }
}
