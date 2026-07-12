import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { DocumentService } from '../../core/services/document.service';
import { TaxFilingService } from '../../core/services/tax-filing.service';
import { AuthService } from '../../core/services/auth.service';
import { DocumentCategory, TaxDocument, DocumentRequest, TaxFiling } from '../../core/models';
import { INDIVIDUAL_DOCUMENTS, RequiredDocument } from '../../core/constants/document.constants';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  template: `
    <section class="page-header">
      <h1>Documents</h1>
      <p>{{ authService.isAdmin() ? 'Upload and manage tax filing supporting documents' : 'Upload required documents for your individual tax filing' }}</p>
    </section>

    <!-- Admin Form -->
    @if (authService.isAdmin()) {
      <div class="panel">
        <h2>{{ editingId ? 'Edit Document' : 'Add Document' }}</h2>
        <form [formGroup]="form" (ngSubmit)="save()" class="form-grid">
          <div class="field-group">
            <label>Select File</label>
            <input type="file" (change)="onFileSelectedAdmin($event)" class="file-input" />
          </div>
          <div class="field-group">
            <label>File Name</label>
            <input type="text" formControlName="fileName" placeholder="e.g. tax_return_2024.pdf" />
          </div>
          <div class="field-group">
            <label>File Type</label>
            <input type="text" formControlName="fileType" placeholder="e.g. application/pdf" />
          </div>
          <div class="field-group">
            <label>File Path</label>
            <input type="text" formControlName="filePath" placeholder="/uploads/filename.pdf" />
          </div>
          <div class="field-group">
            <label>Upload Date</label>
            <input type="date" formControlName="uploadDate" />
          </div>
          <div class="field-group">
            <label>Document Category</label>
            <select formControlName="documentCategory">
              <option value="AADHAR">Aadhar Card</option>
              <option value="GST">GST Certificate</option>
              <option value="PAN_CARD">Pancard</option>
            </select>
          </div>
          <div class="field-group">
            <label>Tax Filing</label>
            <select formControlName="taxFilingId">
              @for (filing of filings; track filing.id) {
                <option [value]="filing.id">#{{ filing.id }} - {{ filing.financialYear }}</option>
              }
            </select>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="form.invalid">{{ editingId ? 'Update' : 'Upload Document' }}</button>
            @if (editingId) {
              <button type="button" class="btn btn-outline" (click)="resetForm()">Cancel</button>
            }
          </div>
        </form>
      </div>
    }

    <!-- Taxpayer Upload Panel -->
    @if (!authService.isAdmin()) {
      <div class="panel upload-panel">
        <h2>Upload Documents</h2>
        <p class="hint">Please select your individual tax filing and upload all 3 required certificates.</p>

        <div class="field-group">
          <label>Select Tax Filing</label>
          <select [(ngModel)]="selectedFilingId" (change)="onFilingChange()" class="select-input">
            <option [value]="0">-- Select Filing --</option>
            @for (filing of individualFilings; track filing.id) {
              <option [value]="filing.id">#{{ filing.id }} - Individual Filing ({{ filing.financialYear }})</option>
            }
          </select>
          @if (individualFilings.length === 0) {
            <small class="hint-small">No individual filings found. Create one in Tax Filings first.</small>
          }
        </div>

        @if (selectedFilingId) {
          <div class="docs-grid">
            @for (doc of requiredDocs; track doc.category) {
              <div class="doc-card" [class.uploaded]="uploadedByCategory[doc.category]">
                <div class="doc-header">
                  <div class="doc-icon">
                    @if (uploadedByCategory[doc.category]) {
                      <span class="check">✓</span>
                    } @else {
                      <span class="pending">📄</span>
                    }
                  </div>
                  <div>
                    <h3>{{ doc.label }}</h3>
                    @if (uploadedByCategory[doc.category]) {
                      <span class="uploaded-name">{{ uploadedByCategory[doc.category] }}</span>
                    } @else {
                      <span class="not-uploaded">Not uploaded yet</span>
                    }
                  </div>
                </div>
                <input type="file" class="file-input" (change)="onFileSelectedTaxpayer($event, doc.category)"
                       [disabled]="uploadingCategory === doc.category" />
                @if (uploadingCategory === doc.category) {
                  <small class="uploading-hint">Uploading...</small>
                }
              </div>
            }
          </div>

          <div class="progress-bar-wrap">
            <div class="progress-bar" [style.width.%]="uploadPercent()"></div>
          </div>
          <p class="progress-text">{{ uploadedCount() }} / {{ requiredDocs.length }} documents uploaded</p>

          @if (uploadedCount() === requiredDocs.length) {
            <div class="submit-action-wrap" style="margin-top: 1.25rem;">
              @if (currentFilingStatus === 'PENDING') {
                <span class="submitted-msg" style="color: #10b981; font-weight: 600; display: inline-flex; align-items: center; gap: 0.35rem;">
                  ⏳ Filed return submitted for verification. Waiting for Verifier approval.
                </span>
              } @else if (currentFilingStatus === 'APPROVED') {
                <span class="submitted-msg" style="color: #15803d; font-weight: 600; display: inline-flex; align-items: center; gap: 0.35rem;">
                  ✓ Approved by Verifier.
                </span>
              } @else {
                <button type="button" class="btn" (click)="submitForVerification()" [disabled]="submittingVerify"
                        style="background: #10b981; color: white; padding: 0.65rem 1.5rem; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; transition: background 0.2s;">
                  {{ submittingVerify ? 'Submitting...' : '🚀 Submit for Verification' }}
                </button>
              }
            </div>
          }
        }
      </div>
    }

    <!-- Uploaded Documents Table -->
    <div class="panel">
      <h2>Uploaded Individual Documents</h2>
      <div class="toolbar">
        <input type="search" placeholder="Search documents..." [value]="searchTerm"
          (input)="searchTerm = $any($event.target).value; applyFilters()" />
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>File Name</th>
            <th>Category</th>
            <th>Upload Date</th>
            <th>Filing</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (doc of pagedDocuments; track doc.id) {
            <tr>
              <td>{{ doc.id }}</td>
              <td class="filename">📄 {{ doc.fileName }}</td>
              <td><span class="badge cat-badge">{{ formatCategory(doc.documentCategory) }}</span></td>
              <td>{{ doc.uploadDate }}</td>
              <td>#{{ doc.taxFiling?.id }} {{ doc.taxFiling?.financialYear }}</td>
              <td class="actions">
                @if (authService.isAdmin()) {
                  <button class="btn btn-sm" (click)="edit(doc)">Edit</button>
                  <button class="btn btn-sm btn-danger" (click)="remove(doc.id!)">Delete</button>
                } @else {
                  <span class="muted">—</span>
                }
              </td>
            </tr>
          } @empty {
            <tr><td colspan="6" class="empty-row">No documents found</td></tr>
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
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
    .field-group { display: flex; flex-direction: column; gap: 0.35rem; }
    .field-group label { font-size: 0.82rem; font-weight: 600; color: #475569; }
    .file-input { padding: 0.4rem; }
    .form-actions { display: flex; gap: 0.75rem; align-items: flex-end; padding-top: 1.5rem; }
    
    .upload-panel .hint { color: #64748b; font-size: 0.9rem; margin-bottom: 1.25rem; }
    .select-input { padding: 0.65rem 0.9rem; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.9rem; width: 100%; max-width: 400px; }
    .hint-small { color: #94a3b8; font-size: 0.8rem; display: block; margin-top: 0.25rem; }

    .docs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin: 1.25rem 0; }
    .doc-card { border: 2px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; background: #f8fafc; transition: border-color 0.2s; }
    .doc-card.uploaded { border-color: #10b981; background: #f0fdf4; }
    .doc-header { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.75rem; }
    .doc-icon { font-size: 1.5rem; }
    .doc-icon .check { color: #10b981; }
    .doc-header h3 { margin: 0; font-size: 0.9rem; font-weight: 600; color: #0f172a; }
    .uploaded-name { font-size: 0.78rem; color: #10b981; font-weight: 500; }
    .not-uploaded { font-size: 0.78rem; color: #94a3b8; }
    .uploading-hint { color: #6366f1; font-size: 0.8rem; }

    .progress-bar-wrap { height: 8px; background: #e2e8f0; border-radius: 999px; overflow: hidden; margin-top: 1rem; }
    .progress-bar { height: 100%; background: linear-gradient(90deg, #6366f1, #10b981); border-radius: 999px; transition: width 0.4s ease; }
    .progress-text { font-size: 0.85rem; color: #64748b; margin-top: 0.5rem; }

    .toolbar { margin-bottom: 1rem; }
    .toolbar input { width: 100%; max-width: 320px; padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 0.75rem; border-bottom: 2px solid #e2e8f0; font-size: 0.82rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
    td { text-align: left; padding: 0.75rem; border-bottom: 1px solid #f1f5f9; }
    .filename { font-weight: 500; }
    .cat-badge { background: #ede9fe; color: #7c3aed; }
    .actions { display: flex; gap: 0.5rem; }
    .empty-row { text-align: center; color: #94a3b8; padding: 2rem; }
    .pagination { display: flex; gap: 1rem; align-items: center; margin-top: 1rem; }
    .muted { color: #94a3b8; }
  `
})
export class DocumentsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly documentService = inject(DocumentService);
  private readonly taxFilingService = inject(TaxFilingService);
  readonly authService = inject(AuthService);

  readonly requiredDocs: RequiredDocument[] = INDIVIDUAL_DOCUMENTS;

  individualFilings: TaxFiling[] = [];
  selectedFilingId: number = 0;
  uploadedByCategory: Partial<Record<DocumentCategory, string>> = {};
  uploadingCategory: DocumentCategory | null = null;

  documents: TaxDocument[] = [];
  filteredDocuments: TaxDocument[] = [];
  pagedDocuments: TaxDocument[] = [];
  filings: TaxFiling[] = [];
  searchTerm = '';
  page = 1;
  pageSize = 5;
  totalPages = 1;
  editingId: number | null = null;
  submittingVerify = false;

  get currentFilingStatus(): string {
    const filing = this.individualFilings.find(f => f.id === Number(this.selectedFilingId));
    return filing?.status ?? '';
  }

  submitForVerification(): void {
    const filingId = Number(this.selectedFilingId);
    if (!filingId) return;

    this.submittingVerify = true;
    this.taxFilingService.submit(filingId).subscribe({
      next: (updatedFiling) => {
        this.submittingVerify = false;
        const idx = this.individualFilings.findIndex(f => f.id === filingId);
        if (idx !== -1) {
          this.individualFilings[idx] = updatedFiling;
        }
        this.loadDocuments();
      },
      error: () => {
        this.submittingVerify = false;
      }
    });
  }

  readonly form = this.fb.nonNullable.group({
    fileName: ['', Validators.required],
    fileType: ['', Validators.required],
    filePath: ['', Validators.required],
    uploadDate: ['', Validators.required],
    taxFilingId: [0, Validators.required],
    documentCategory: ['AADHAR' as DocumentCategory, Validators.required]
  });

  ngOnInit(): void {
    if (this.authService.isAdmin()) {
      this.taxFilingService.getAll().subscribe((data) => {
        this.filings = data;
        if (data[0]?.id) this.form.patchValue({ taxFilingId: data[0].id });
      });
      this.loadDocuments();
    } else {
      // Load documents first, then load filings so onFilingChange has data to work with
      const userId = this.authService.currentUser()?.id;
      const orgCats = ['ORGANIZATION_CERTIFICATE', 'INCOME_CERTIFICATE', 'OWNER_CERTIFICATE'];
      this.documentService.getAll().subscribe((data) => {
        const indivDocs = data.filter((d) => !orgCats.includes(d.documentCategory ?? ''));
        this.documents = indivDocs.filter((d) => d.taxFiling?.user?.id === userId);
        this.applyFilters();

        if (userId) {
          this.taxFilingService.getFiledByUser(userId).subscribe((filings) => {
            this.individualFilings = filings.filter(f => f.filingType === 'INDIVIDUAL');
            if (this.individualFilings.length > 0) {
              this.selectedFilingId = this.individualFilings[0].id ?? 0;
              this.onFilingChange();
            }
          });
        }
      });
    }
  }

  onFilingChange(): void {
    this.uploadedByCategory = {};
    const filingId = Number(this.selectedFilingId);
    if (!filingId) return;

    // Filter documents uploaded for this specific individual filing
    const filingDocs = this.documents.filter(d => d.taxFiling?.id === filingId);
    for (const doc of filingDocs) {
      if (doc.documentCategory) {
        this.uploadedByCategory[doc.documentCategory] = doc.fileName;
      }
    }
  }

  onFileSelectedAdmin(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const today = new Date().toISOString().split('T')[0];
    this.form.patchValue({
      fileName: file.name,
      fileType: file.type || 'application/octet-stream',
      filePath: `/uploads/${file.name}`,
      uploadDate: today
    });
  }

  onFileSelectedTaxpayer(event: Event, category: DocumentCategory): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !this.selectedFilingId) return;

    this.uploadingCategory = category;
    const today = new Date().toISOString().split('T')[0];

    this.documentService.upload({
      fileName: file.name,
      fileType: file.type || 'application/octet-stream',
      filePath: `/uploads/${file.name}`,
      uploadDate: today,
      taxFilingId: this.selectedFilingId,
      documentCategory: category
    }).subscribe({
      next: () => {
        this.uploadedByCategory = { ...this.uploadedByCategory, [category]: file.name };
        this.uploadingCategory = null;
        input.value = '';
        this.loadDocuments();
      },
      error: () => {
        this.uploadingCategory = null;
      }
    });
  }

  uploadedCount(): number {
    return this.requiredDocs.filter(d => !!this.uploadedByCategory[d.category]).length;
  }

  uploadPercent(): number {
    return (this.uploadedCount() / this.requiredDocs.length) * 100;
  }

  loadDocuments(): void {
    const orgCats = ['ORGANIZATION_CERTIFICATE', 'INCOME_CERTIFICATE', 'OWNER_CERTIFICATE'];
    this.documentService.getAll().subscribe((data) => {
      const userId = this.authService.currentUser()?.id;
      // Exclude org-specific categories — those belong in Org Documents module
      const indivDocs = data.filter((d) => !orgCats.includes(d.documentCategory ?? ''));
      this.documents = this.authService.isAdmin()
        ? indivDocs
        : indivDocs.filter((d) => d.taxFiling?.user?.id === userId);
      this.applyFilters();
      this.onFilingChange();
    });
  }

  applyFilters(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredDocuments = this.documents.filter(
      (d) => d.fileName.toLowerCase().includes(term) || d.fileType.toLowerCase().includes(term)
    );
    this.totalPages = Math.max(1, Math.ceil(this.filteredDocuments.length / this.pageSize));
    this.paginate();
  }

  paginate(): void {
    const start = (this.page - 1) * this.pageSize;
    this.pagedDocuments = this.filteredDocuments.slice(start, start + this.pageSize);
  }

  save(): void {
    if (this.form.invalid) return;
    const payload = this.form.getRawValue() as DocumentRequest;

    if (this.editingId) {
      this.documentService.update(this.editingId, payload).subscribe(() => {
        this.resetForm();
        this.loadDocuments();
      });
      return;
    }

    this.documentService.upload(payload).subscribe(() => {
      this.resetForm();
      this.loadDocuments();
    });
  }

  edit(doc: TaxDocument): void {
    this.editingId = doc.id ?? null;
    this.form.patchValue({
      fileName: doc.fileName,
      fileType: doc.fileType,
      filePath: doc.filePath,
      uploadDate: doc.uploadDate,
      taxFilingId: doc.taxFiling?.id ?? 0
    });
  }

  remove(id: number): void {
    if (!confirm('Delete this document?')) return;
    this.documentService.delete(id).subscribe(() => this.loadDocuments());
  }

  resetForm(): void {
    this.editingId = null;
    this.form.reset({
      fileName: '',
      fileType: '',
      filePath: '',
      uploadDate: '',
      taxFilingId: this.filings[0]?.id ?? 0,
      documentCategory: 'AADHAR' as DocumentCategory
    });
  }

  formatCategory(cat?: string): string {
    if (!cat) return '—';
    return cat.replace(/_/g, ' ');
  }
}

