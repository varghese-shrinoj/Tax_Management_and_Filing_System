import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Role, SignupRequest } from '../../../core/models';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-left">
        <div class="hero-content">
          <div class="hero-logo">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1>Join TaxManager</h1>
          <p>Create your account and start managing your taxes efficiently with our secure platform.</p>
          <div class="steps">
            <div class="step"><span class="step-num">1</span><span>Create your account</span></div>
            <div class="step"><span class="step-num">2</span><span>Log in to the dashboard</span></div>
            <div class="step"><span class="step-num">3</span><span>File your tax returns</span></div>
          </div>
        </div>
      </div>

      <div class="auth-right">
        <div class="auth-card">
          <div class="card-header">
            <h2>Create account</h2>
            <p>Register as a taxpayer to get started</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form">
            <div class="field">
              <label for="signup-name">Full Name</label>
              <input id="signup-name" type="text" formControlName="fullName" placeholder="John Doe" autocomplete="name" />
              @if (form.controls.fullName.touched && form.controls.fullName.invalid) {
                <small class="error">Full name is required</small>
              }
            </div>
            <div class="field">
              <label for="signup-email">Email address</label>
              <input id="signup-email" type="email" formControlName="email" placeholder="you@example.com" autocomplete="email" />
              @if (form.controls.email.touched && form.controls.email.invalid) {
                <small class="error">A valid email is required</small>
              }
            </div>
            <div class="field">
              <label for="signup-password">Password</label>
              <input id="signup-password" type="password" formControlName="password" placeholder="Minimum 6 characters" autocomplete="new-password" />
              @if (form.controls.password.touched && form.controls.password.invalid) {
                <small class="error">Password must be at least 6 characters</small>
              }
            </div>

            <div class="field">
              <label>Register As</label>
              <div class="role-toggle">
                <button type="button" class="role-btn" [class.active]="form.controls.role.value === 'TAXPAYER'" (click)="form.controls.role.setValue('TAXPAYER')">
                  👤 Taxpayer
                </button>
                <button type="button" class="role-btn" [class.active]="form.controls.role.value === 'VERIFIER'" (click)="form.controls.role.setValue('VERIFIER')">
                  🔍 Tax Verifier
                </button>
              </div>
            </div>

            @if (message) {
              <div class="message" [class.error-msg]="isError">{{ message }}</div>
            }

            <button type="submit" id="signup-btn" class="btn btn-primary submit-btn" [disabled]="form.invalid || loading">
              @if (loading) {
                <span class="spinner"></span> Creating account...
              } @else {
                Create Account
              }
            </button>
          </form>

          <p class="footer-link">Already have an account? <a routerLink="/login">Sign in</a></p>
        </div>
      </div>
    </div>
  `,
  styles: `
    .auth-page { min-height: 100vh; display: flex; }
    .auth-left {
      flex: 1; background: linear-gradient(145deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%);
      display: flex; align-items: center; justify-content: center;
      padding: 3rem; position: relative; overflow: hidden;
    }
    .auth-left::before {
      content: ''; position: absolute; width: 400px; height: 400px;
      background: rgba(255,255,255,0.03); border-radius: 50%; top: -100px; right: -100px;
    }
    .hero-content { position: relative; z-index: 1; max-width: 380px; }
    .hero-logo {
      width: 60px; height: 60px; border-radius: 14px;
      background: rgba(255,255,255,0.12); display: grid; place-items: center;
      margin-bottom: 1.5rem; border: 1px solid rgba(255,255,255,0.15);
    }
    .hero-content h1 { font-size: 2rem; font-weight: 800; color: #fff; margin: 0 0 1rem; }
    .hero-content > p { color: rgba(255,255,255,0.7); font-size: 0.95rem; line-height: 1.6; margin-bottom: 2rem; }
    .steps { display: flex; flex-direction: column; gap: 1rem; }
    .step { display: flex; align-items: center; gap: 0.85rem; color: rgba(255,255,255,0.85); font-size: 0.9rem; }
    .step-num {
      width: 28px; height: 28px; border-radius: 50%;
      background: rgba(255,255,255,0.15); color: #fff;
      display: grid; place-items: center; font-size: 0.8rem; font-weight: 700; flex-shrink: 0;
    }
    .auth-right {
      width: 480px; display: flex; align-items: center;
      justify-content: center; padding: 2rem; background: #f8fafc;
    }
    .auth-card { width: 100%; max-width: 400px; }
    .card-header { margin-bottom: 1.75rem; }
    .card-header h2 { margin: 0; font-size: 1.6rem; font-weight: 700; color: #0f172a; }
    .card-header p { margin: 0.35rem 0 0; color: #64748b; font-size: 0.9rem; }
    .auth-form { display: flex; flex-direction: column; gap: 1rem; }
    .field { display: flex; flex-direction: column; gap: 0.4rem; }
    .field label { font-size: 0.85rem; font-weight: 600; color: #374151; }
    .field input {
      padding: 0.7rem 0.9rem; border: 1.5px solid #e5e7eb; border-radius: 10px;
      font-size: 0.9rem; transition: border-color 0.15s, box-shadow 0.15s; width: 100%;
    }
    .field input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.12); outline: none; }
    .message {
      padding: 0.7rem 1rem; border-radius: 10px;
      background: #f0fdf4; color: #15803d; font-size: 0.875rem; border: 1px solid #bbf7d0;
    }
    .error-msg { background: #fef2f2; color: #b91c1c; border-color: #fecaca; }
    .submit-btn {
      width: 100%; padding: 0.8rem; font-size: 0.95rem; border-radius: 10px;
      margin-top: 0.25rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    }
    .spinner {
      width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4);
      border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .footer-link { margin-top: 1.25rem; text-align: center; color: #64748b; font-size: 0.875rem; }
    .footer-link a { color: #2563eb; font-weight: 600; }
    .role-toggle { display: flex; gap: 0.5rem; }
    .role-btn {
      flex: 1; padding: 0.65rem 0.5rem; border: 2px solid #e5e7eb; border-radius: 10px;
      background: #fff; cursor: pointer; font-size: 0.875rem; font-weight: 600; color: #64748b;
      transition: all 0.15s;
    }
    .role-btn.active { border-color: #2563eb; background: #eff6ff; color: #1d4ed8; }
    @media (max-width: 768px) {
      .auth-page { flex-direction: column; }
      .auth-left { flex: none; padding: 2rem; }
      .auth-right { width: 100%; }
    }
  `
})
export class SignupComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;
  message = '';
  isError = false;

  readonly form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['TAXPAYER', Validators.required]
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    const raw = this.form.getRawValue();
    const payload: SignupRequest = {
      fullName: raw.fullName,
      email: raw.email,
      password: raw.password,
      role: raw.role as Role
    };
    this.authService.signup(payload).subscribe({
      next: (response) => {
        this.loading = false;
        if (response === 'Signup Successful') {
          this.message = '✓ Account created! Redirecting to login...';
          this.isError = false;
          setTimeout(() => this.router.navigate(['/login']), 1500);
          return;
        }
        this.isError = true;
        this.message = response;
      },
      error: () => {
        this.loading = false;
        this.isError = true;
        this.message = 'Signup failed. Please try again.';
      }
    });
  }
}
