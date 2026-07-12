import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { Role, User } from '../../core/models';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="page-header">
      <h1>User Management</h1>
      <p>Admin-only user CRUD operations</p>
    </section>

    <div class="panel">
      <h2>{{ editingId ? 'Edit User' : 'Add User' }}</h2>
      <form [formGroup]="form" (ngSubmit)="save()" class="form-grid">
        <input type="text" formControlName="fullName" placeholder="Full Name" />
        <input type="email" formControlName="email" placeholder="Email" />
        <input type="password" formControlName="password" placeholder="Password" />
        <select formControlName="role">
          <option value="ADMIN">ADMIN</option>
          <option value="TAXPAYER">TAXPAYER</option>
        </select>
        <button type="submit" class="btn btn-primary">{{ editingId ? 'Update' : 'Create' }}</button>
        @if (editingId) {
          <button type="button" class="btn btn-outline" (click)="resetForm()">Cancel</button>
        }
      </form>
    </div>

    <div class="panel">
      <div class="toolbar">
        <input type="search" placeholder="Search by name or email..." [value]="searchTerm"
          (input)="searchTerm = $any($event.target).value; applyFilters()" />
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (user of pagedUsers; track user.id) {
            <tr>
              <td>{{ user.id }}</td>
              <td>{{ user.fullName }}</td>
              <td>{{ user.email }}</td>
              <td><span class="badge">{{ user.role }}</span></td>
              <td class="actions">
                <button class="btn btn-sm" (click)="edit(user)">Edit</button>
                <button class="btn btn-sm btn-danger" (click)="remove(user.id!)">Delete</button>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="5">No users found</td></tr>
          }
        </tbody>
      </table>

      <div class="pagination">
        <button class="btn btn-sm" [disabled]="page === 1" (click)="changePage(page - 1)">Prev</button>
        <span>Page {{ page }} of {{ totalPages }}</span>
        <button class="btn btn-sm" [disabled]="page >= totalPages" (click)="changePage(page + 1)">Next</button>
      </div>
    </div>
  `,
  styles: `
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem; }
    .toolbar { margin-bottom: 1rem; }
    .toolbar input { width: 100%; max-width: 320px; padding: 0.6rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 0.75rem; border-bottom: 1px solid #e2e8f0; }
    .actions { display: flex; gap: 0.5rem; }
    .pagination { display: flex; align-items: center; gap: 1rem; margin-top: 1rem; }
  `
})
export class UsersComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);

  users: User[] = [];
  filteredUsers: User[] = [];
  pagedUsers: User[] = [];
  searchTerm = '';
  page = 1;
  pageSize = 5;
  totalPages = 1;
  editingId: number | null = null;

  readonly form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    role: ['TAXPAYER' as Role, Validators.required]
  });

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAll().subscribe((data) => {
      this.users = data;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(
      (u) => u.fullName.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
    );
    this.totalPages = Math.max(1, Math.ceil(this.filteredUsers.length / this.pageSize));
    if (this.page > this.totalPages) this.page = this.totalPages;
    const start = (this.page - 1) * this.pageSize;
    this.pagedUsers = this.filteredUsers.slice(start, start + this.pageSize);
  }

  changePage(next: number): void {
    this.page = next;
    this.applyFilters();
  }

  save(): void {
    if (this.form.invalid) return;
    const payload = this.form.getRawValue();

    if (this.editingId) {
      this.userService.update(this.editingId, { ...payload, id: this.editingId }).subscribe(() => {
        this.resetForm();
        this.loadUsers();
      });
      return;
    }

    this.userService.create(payload).subscribe(() => {
      this.resetForm();
      this.loadUsers();
    });
  }

  edit(user: User): void {
    this.editingId = user.id ?? null;
    this.form.patchValue({
      fullName: user.fullName,
      email: user.email,
      password: user.password ?? '',
      role: user.role
    });
  }

  remove(id: number): void {
    if (!confirm('Delete this user?')) return;
    this.userService.delete(id).subscribe(() => this.loadUsers());
  }

  resetForm(): void {
    this.editingId = null;
    this.form.reset({ fullName: '', email: '', password: '', role: 'TAXPAYER' });
  }
}
