import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaxTypeService } from '../../core/services/tax-type.service';
import { TaxType } from '../../core/models';

@Component({
  selector: 'app-tax-types',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="page-header">
      <h1>Tax Types</h1>
      <p>Manage income tax, GST, and other tax categories</p>
    </section>

    <div class="panel">
      <form [formGroup]="form" (ngSubmit)="save()" class="form-grid">
        <input type="text" formControlName="taxName" placeholder="Tax Name" />
        <input type="text" formControlName="description" placeholder="Description" />
        <button type="submit" class="btn btn-primary">{{ editingId ? 'Update' : 'Add' }}</button>
        @if (editingId) {
          <button type="button" class="btn btn-outline" (click)="resetForm()">Cancel</button>
        }
      </form>
    </div>

    <div class="panel">
      <div class="toolbar">
        <input type="search" placeholder="Search tax types..." [value]="searchTerm"
          (input)="onSearch($any($event.target).value)" />
      </div>

      <table>
        <thead><tr><th>ID</th><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
        <tbody>
          @for (item of pagedItems; track item.id) {
            <tr>
              <td>{{ item.id }}</td>
              <td>{{ item.taxName }}</td>
              <td>{{ item.description }}</td>
              <td class="actions">
                <button class="btn btn-sm" (click)="edit(item)">Edit</button>
                <button class="btn btn-sm btn-danger" (click)="remove(item.id!)">Delete</button>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="4">No tax types found</td></tr>
          }
        </tbody>
      </table>

      <div class="pagination">
        <button class="btn btn-sm" [disabled]="page === 1" (click)="changePage(page - 1)">Prev</button>
        <span>Page {{ page }} / {{ totalPages }}</span>
        <button class="btn btn-sm" [disabled]="page >= totalPages" (click)="changePage(page + 1)">Next</button>
      </div>
    </div>
  `,
  styles: `
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; }
    .toolbar input { width: 100%; max-width: 320px; padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 0.75rem; border-bottom: 1px solid #e2e8f0; }
    .actions { display: flex; gap: 0.5rem; }
    .pagination { display: flex; gap: 1rem; align-items: center; margin-top: 1rem; }
  `
})
export class TaxTypesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly taxTypeService = inject(TaxTypeService);

  items: TaxType[] = [];
  pagedItems: TaxType[] = [];
  searchTerm = '';
  page = 1;
  pageSize = 5;
  totalPages = 1;
  editingId: number | null = null;

  readonly form = this.fb.nonNullable.group({
    taxName: ['', Validators.required],
    description: ['']
  });

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.taxTypeService.getAll().subscribe((data) => {
      this.items = data;
      this.paginate();
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    if (!term.trim()) {
      this.loadAll();
      return;
    }
    this.taxTypeService.search(term).subscribe((data) => {
      this.items = data;
      this.page = 1;
      this.paginate();
    });
  }

  paginate(): void {
    this.totalPages = Math.max(1, Math.ceil(this.items.length / this.pageSize));
    const start = (this.page - 1) * this.pageSize;
    this.pagedItems = this.items.slice(start, start + this.pageSize);
  }

  changePage(next: number): void {
    this.page = next;
    this.paginate();
  }

  save(): void {
    if (this.form.invalid) return;
    const payload = this.form.getRawValue();

    if (this.editingId) {
      this.taxTypeService.update(this.editingId, { ...payload, id: this.editingId }).subscribe(() => {
        this.resetForm();
        this.loadAll();
      });
      return;
    }

    this.taxTypeService.create(payload).subscribe(() => {
      this.resetForm();
      this.loadAll();
    });
  }

  edit(item: TaxType): void {
    this.editingId = item.id ?? null;
    this.form.patchValue(item);
  }

  remove(id: number): void {
    if (!confirm('Delete this tax type?')) return;
    this.taxTypeService.delete(id).subscribe(() => this.loadAll());
  }

  resetForm(): void {
    this.editingId = null;
    this.form.reset({ taxName: '', description: '' });
  }
}
