import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="page-header">
      <h1>Edit Profile</h1>
      <p>Manage your account settings and update your profile details</p>
    </section>

    <div class="panel">
      <h2>Profile Details</h2>
      <form [formGroup]="form" (ngSubmit)="save()" class="form-grid">
        <div class="field">
          <label for="fullName">Full Name *</label>
          <input id="fullName" type="text" formControlName="fullName" placeholder="Your full name" />
          @if (fullName.touched && fullName.invalid) {
            <small class="error">Full Name is required</small>
          }
        </div>

        <div class="field">
          <label for="email">Email Address *</label>
          <input id="email" type="email" formControlName="email" placeholder="Your email address" />
          @if (email.touched && email.invalid) {
            <small class="error">Please enter a valid email</small>
          }
        </div>

        <div class="field">
          <label for="oldPassword">Old Password (required to change password)</label>
          <input id="oldPassword" type="password" formControlName="oldPassword" placeholder="Current password" />
        </div>

        <div class="field">
          <label for="newPassword">New Password (leave empty to keep current)</label>
          <input id="newPassword" type="password" formControlName="newPassword" placeholder="New password" />
          @if (newPassword.touched && newPassword.invalid) {
            <small class="error">Password must be at least 6 characters</small>
          }
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" [disabled]="form.invalid || loading">
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>

      @if (message) {
        <div class="message" [class.error-msg]="isError">
          {{ message }}
        </div>
      }
    </div>
  `,
  styles: `
    .form-grid {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      max-width: 480px;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .field label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
    }
    .field input {
      padding: 0.7rem 0.9rem;
      border: 1.5px solid var(--border-light);
      border-radius: 10px;
      font-size: 0.9rem;
      background: #fff;
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
      width: 100%;
    }
    .field input:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px var(--primary-glow);
      outline: none;
    }
    .form-actions {
      margin-top: 0.5rem;
    }
    .btn {
      padding: 0.75rem 1.5rem;
      font-size: 0.9rem;
      font-weight: 600;
      border-radius: 10px;
      cursor: pointer;
      border: none;
      transition: background-color var(--transition-fast);
    }
    .btn-primary {
      background: var(--primary-gradient);
      color: #fff;
    }
    .btn-primary:hover {
      background: var(--primary-hover-gradient);
    }
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .error {
      color: var(--danger-color);
      font-size: 0.8rem;
      margin-top: 0.2rem;
    }
    .message {
      margin-top: 1.5rem;
      padding: 0.85rem 1.25rem;
      border-radius: 10px;
      font-size: 0.9rem;
      border: 1px solid var(--success-border);
      background: var(--success-bg);
      color: var(--success-text);
      max-width: 480px;
    }
    .message.error-msg {
      border-color: var(--danger-border);
      background: var(--danger-bg);
      color: var(--danger-text);
    }
  `
})
export class ProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  loading = false;
  message = '';
  isError = false;

  readonly form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    oldPassword: [''],
    newPassword: ['', [Validators.minLength(6)]]
  });

  get fullName() {
    return this.form.controls.fullName;
  }

  get email() {
    return this.form.controls.email;
  }

  get newPassword() {
    return this.form.controls.newPassword;
  }

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.form.patchValue({
        fullName: user.fullName,
        email: user.email
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.message = '';
    this.isError = false;

    const val = this.form.getRawValue();

    if (val.newPassword && !val.oldPassword) {
      this.loading = false;
      this.isError = true;
      this.message = 'Please enter your old password to set a new password.';
      return;
    }

    const payload = {
      fullName: val.fullName,
      email: val.email,
      ...(val.newPassword ? { oldPassword: val.oldPassword, newPassword: val.newPassword } : {})
    };

    this.authService.updateProfile(payload).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Profile updated successfully!';
        this.form.patchValue({
          oldPassword: '',
          newPassword: ''
        });
      },
      error: (err) => {
        this.loading = false;
        this.isError = true;
        this.message = err?.error?.message || err?.message || 'Failed to update profile. Make sure your old password is correct.';
      }
    });
  }
}
