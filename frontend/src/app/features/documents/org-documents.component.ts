import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DocumentService } from '../../core/services/document.service';
import { TaxFilingService } from '../../core/services/tax-filing.service';
import { AuthService } from '../../core/services/auth.service';
import { DocumentCategory, TaxDocument, TaxFiling } from '../../core/models';
import { ORGANIZATION_DOCUMENTS, RequiredDocument } from '../../core/constants/document.constants';

@Component({
  selector: 'app-org-documents',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="page-header">
      <h1>Organisation Documents</h1>
      <p>Upload required documents for your organisation tax filing</p>
    </section>

    <div class="panel upload-panel">
      <h2>Upload Documents</h2>
      <p class="hint">Please select your organisation's tax filing and upload all 3 required certificates.</p>

      <div class="field-group">
        <label>Select Tax Filing</label>
        <select [(ngModel)]="selectedFilingId" [ngModelOptions]="{standalone: true}" (change)="onFilingChange()" class="select-input">
          <option [value]="0">-- Select Filing --</option>
          @for (filing of orgFilings; track filing.id) {
            <option [value]="filing.id">#{{ filing.id }} - {{ filing.organizationName }} ({{ filing.financialYear }})</option>
          }
        </select>
        @if (orgFilings.length === 0) {
          <small class="hint-small">No organisation filings found. Create one in Tax Filings first.</small>
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
              <input type="file" class="file-input" (change)="onFileSelected($event, doc.category)"
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

    <div class="panel">
      <h2>Uploaded Organisation Documents</h2>
      <div class="toolbar">
        <input type="search" placeholder="Search documents..." [value]="searchTerm"
          (input)="searchTerm = $any($event.target).value; applyFilters()" />
      </div>

      <table>
        <thead>
          <tr><th>ID</th><th>File Name</th><th>Category</th><th>Upload Date</th><th>Filing</th><th>Actions</th></tr>
        </thead>
        <tbody>
          @for (doc of pagedDocuments; track doc.id) {
            <tr>
              <td>{{ doc.id }}</td>
              <td class="filename">📄 {{ doc.fileName }}</td>
              <td><span class="badge cat-badge">{{ formatCategory(doc.documentCategory) }}</span></td>
              <td>{{ doc.uploadDate }}</td>
              <td>#{{ doc.taxFiling?.id }} {{ doc.taxFiling?.organizationName }}</td>
              <td class="actions">
                @if (authService.isAdmin()) {
                  <button class="btn btn-sm btn-danger" (click)="remove(doc.id!)">Delete</button>
                } @else {
                  <span class="muted">—</span>
                }
              </td>
            </tr>
          } @empty {
            <tr><td colspan="6" class="empty-row">No organisation documents found</td></tr>
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
    .upload-panel .hint { color: #64748b; font-size: 0.9rem; margin-bottom: 1.25rem; }
    .field-group { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.25rem; }
    .field-group label { font-size: 0.85rem; font-weight: 600; color: #475569; }
    .select-input { padding: 0.65rem 0.9rem; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.9rem; }
    .hint-small { color: #94a3b8; font-size: 0.8rem; }

    .docs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin: 1.25rem 0; }
    .doc-card { border: 2px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; background: #f8fafc; transition: border-color 0.2s; }
    .doc-card.uploaded { border-color: #10b981; background: #f0fdf4; }
    .doc-header { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.75rem; }
    .doc-icon { font-size: 1.5rem; }
    .doc-icon .check { color: #10b981; }
    .doc-header h3 { margin: 0; font-size: 0.9rem; font-weight: 600; color: #0f172a; }
    .uploaded-name { font-size: 0.78rem; color: #10b981; font-weight: 500; }
    .not-uploaded { font-size: 0.78rem; color: #94a3b8; }
    .file-input { width: 100%; font-size: 0.82rem; padding: 0.4rem; cursor: pointer; }
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
export class OrgDocumentsComponent implements OnInit {
  private readonly documentService = inject(DocumentService);
  private readonly taxFilingService = inject(TaxFilingService);
  readonly authService = inject(AuthService);

  readonly requiredDocs: RequiredDocument[] = ORGANIZATION_DOCUMENTS;

  orgFilings: TaxFiling[] = [];
  selectedFilingId: number = 0;
  uploadedByCategory: Partial<Record<DocumentCategory, string>> = {};
  uploadingCategory: DocumentCategory | null = null;

  documents: TaxDocument[] = [];
  filteredDocuments: TaxDocument[] = [];
  pagedDocuments: TaxDocument[] = [];
  searchTerm = '';
  page = 1;
  pageSize = 5;
  totalPages = 1;
  submittingVerify = false;

  get currentFilingStatus(): string {
    const filing = this.orgFilings.find(f => f.id === Number(this.selectedFilingId));
    return filing?.status ?? '';
  }

  submitForVerification(): void {
    const filingId = Number(this.selectedFilingId);
    if (!filingId) return;

    this.submittingVerify = true;
    this.taxFilingService.submit(filingId).subscribe({
      next: (updatedFiling) => {
        this.submittingVerify = false;
        const idx = this.orgFilings.findIndex(f => f.id === filingId);
        if (idx !== -1) {
          this.orgFilings[idx] = updatedFiling;
        }
        this.loadDocuments();
      },
      error: () => {
        this.submittingVerify = false;
      }
    });
  }

  ngOnInit(): void {
    const userId = this.authService.currentUser()?.id;
    const orgCats: DocumentCategory[] = ['ORGANIZATION_CERTIFICATE', 'INCOME_CERTIFICATE', 'OWNER_CERTIFICATE'];

    // Load documents first so onFilingChange has data when called
    this.documentService.getAll().subscribe((data) => {
      this.documents = (this.authService.isAdmin()
        ? data
        : data.filter(d => d.taxFiling?.user?.id === userId)
      ).filter(d => orgCats.includes(d.documentCategory as DocumentCategory));
      this.applyFilters();

      if (userId) {
        this.taxFilingService.getFiledByUser(userId).subscribe((filings) => {
          this.orgFilings = filings.filter(f => f.filingType === 'ORGANIZATION');
          if (this.orgFilings.length > 0) {
            this.selectedFilingId = this.orgFilings[0].id ?? 0;
            this.onFilingChange();
          }
        });
      }
    });
  }

  onFilingChange(): void {
    this.uploadedByCategory = {};
    const filingId = Number(this.selectedFilingId);
    if (!filingId) return;

    const filingDocs = this.documents.filter(d => d.taxFiling?.id === filingId);
    for (const doc of filingDocs) {
      if (doc.documentCategory) {
        this.uploadedByCategory[doc.documentCategory] = doc.fileName;
      }
    }
  }

  onFileSelected(event: Event, category: DocumentCategory): void {
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
    this.documentService.getAll().subscribe((data) => {
      const userId = this.authService.currentUser()?.id;
      const orgCats: DocumentCategory[] = ['ORGANIZATION_CERTIFICATE', 'INCOME_CERTIFICATE', 'OWNER_CERTIFICATE'];
      this.documents = (this.authService.isAdmin()
        ? data
        : data.filter(d => d.taxFiling?.user?.id === userId)
      ).filter(d => orgCats.includes(d.documentCategory as DocumentCategory));
      this.applyFilters();
      this.onFilingChange();
    });
  }

  applyFilters(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredDocuments = this.documents.filter(
      (d) => d.fileName.toLowerCase().includes(term)
    );
    this.totalPages = Math.max(1, Math.ceil(this.filteredDocuments.length / this.pageSize));
    this.paginate();
  }

  paginate(): void {
    const start = (this.page - 1) * this.pageSize;
    this.pagedDocuments = this.filteredDocuments.slice(start, start + this.pageSize);
  }

  remove(id: number): void {
    if (!confirm('Delete this document?')) return;
    this.documentService.delete(id).subscribe(() => this.loadDocuments());
  }

  formatCategory(cat?: string): string {
    if (!cat) return '—';
    return cat.replace(/_/g, ' ');
  }
}
