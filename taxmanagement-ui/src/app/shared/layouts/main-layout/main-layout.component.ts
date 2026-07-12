import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="layout">
      <aside class="sidebar" [class.collapsed]="isCollapsed()">
        <div class="brand">
          <div class="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          @if (!isCollapsed()) {
            <div class="brand-text">
              <h1>TaxManager</h1>
              <p>Filing System</p>
            </div>
          }
          <button class="collapse-btn" (click)="isCollapsed.set(!isCollapsed())">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
        </div>

        <div class="user-chip">
          <div class="avatar">{{ initials() }}</div>
          @if (!isCollapsed()) {
            <div class="user-info">
              <span class="user-name">{{ authService.currentUser()?.fullName }}</span>
              <span class="user-role">{{ authService.currentUser()?.role }}</span>
            </div>
          }
        </div>

        <nav>
          @if (!isCollapsed()) {
            <span class="nav-section">Main</span>
          }
          <a routerLink="/dashboard" routerLinkActive="active" [title]="isCollapsed() ? 'Dashboard' : ''">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            @if (!isCollapsed()) { <span>Dashboard</span> }
          </a>
          @if (!authService.isAdmin() && !authService.isVerifier()) {
            <a routerLink="/tax-filings" routerLinkActive="active" [title]="isCollapsed() ? 'Individual Filings' : ''">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <circle cx="10" cy="13" r="2"/>
                <path d="M6 20c0-2 2-3 4-3s4 1 4 3"/>
              </svg>
              @if (!isCollapsed()) { <span>Individual Filings</span> }
            </a>
            <a routerLink="/org-filings" routerLinkActive="active" [title]="isCollapsed() ? 'Organisation Filings' : ''">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="7" width="18" height="13" rx="2"/>
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
              @if (!isCollapsed()) { <span>Organisation Filings</span> }
            </a>
            <a routerLink="/payments" routerLinkActive="active" [title]="isCollapsed() ? 'Payments' : ''">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              @if (!isCollapsed()) { <span>Payments</span> }
            </a>
            <a routerLink="/documents" routerLinkActive="active" [title]="isCollapsed() ? 'Documents' : ''">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
              @if (!isCollapsed()) { <span>Documents</span> }
            </a>
            <a routerLink="/org-documents" routerLinkActive="active" [title]="isCollapsed() ? 'Org Documents' : ''">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
              </svg>
              @if (!isCollapsed()) { <span>Org Documents</span> }
            </a>
            <a routerLink="/profile" routerLinkActive="active" [title]="isCollapsed() ? 'Profile' : ''">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              @if (!isCollapsed()) { <span>Edit Profile</span> }
            </a>
          }

          @if (authService.isVerifier()) {
            @if (!isCollapsed()) {
              <span class="nav-section">Verifier</span>
            }
            <a routerLink="/verifier-filings" routerLinkActive="active" [title]="isCollapsed() ? 'Verify Filings' : ''">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              @if (!isCollapsed()) { <span>Verify Filings</span> }
            </a>
          }

          @if (authService.isAdmin()) {
            @if (!isCollapsed()) {
              <span class="nav-section">Admin</span>
            }
            <a routerLink="/tax-types" routerLinkActive="active" [title]="isCollapsed() ? 'Tax Types' : ''">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              @if (!isCollapsed()) { <span>Tax Types</span> }
            </a>
          }
        </nav>

        <div class="sidebar-footer">
          <button type="button" class="logout-btn" (click)="authService.logout()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            @if (!isCollapsed()) { <span>Logout</span> }
          </button>
        </div>
      </aside>

      <div class="content-area">
        <header class="topbar">
          <div class="topbar-left">
            <h2 class="page-title">Welcome back, <strong>{{ authService.currentUser()?.fullName }}</strong></h2>
          </div>
          <div class="topbar-right">
            <span class="role-chip" [class.admin]="authService.isAdmin()">
              {{ authService.currentUser()?.role }}
            </span>
          </div>
        </header>
        <main class="page-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: `
    .layout { display: flex; min-height: 100vh; }

    /* ─── Sidebar ─── */
    .sidebar {
      width: 240px;
      background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
      color: #cbd5e1;
      padding: 1.25rem 0.85rem;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      transition: width 0.25s ease;
      position: relative;
      box-shadow: 2px 0 12px rgba(0,0,0,0.15);
    }
    .sidebar.collapsed { width: 68px; }

    /* Brand */
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
      padding: 0.25rem 0.5rem;
      position: relative;
    }
    .brand-icon {
      width: 40px; height: 40px; border-radius: 10px;
      background: linear-gradient(135deg, #2563eb, #7c3aed);
      color: #fff;
      display: grid; place-items: center;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
    }
    .brand-text h1 { margin: 0; font-size: 0.95rem; font-weight: 700; color: #f1f5f9; }
    .brand-text p { margin: 0; font-size: 0.7rem; color: #94a3b8; }
    .collapse-btn {
      position: absolute; right: -10px; top: 50%; transform: translateY(-50%);
      width: 22px; height: 22px; border-radius: 50%; border: 1px solid #334155;
      background: #1e293b; cursor: pointer; display: grid; place-items: center;
      color: #94a3b8; padding: 0; transition: background 0.2s;
    }
    .collapse-btn:hover { background: #334155; color: #f1f5f9; }
    .sidebar.collapsed .collapse-btn svg { transform: rotate(180deg); }

    /* User Chip */
    .user-chip {
      display: flex; align-items: center; gap: 0.65rem;
      padding: 0.6rem 0.5rem; margin-bottom: 1rem;
      background: rgba(255,255,255,0.04); border-radius: 10px;
    }
    .avatar {
      width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg, #2563eb, #7c3aed);
      color: #fff; font-size: 0.8rem; font-weight: 700;
      display: grid; place-items: center;
    }
    .user-name { display: block; font-size: 0.82rem; font-weight: 600; color: #f1f5f9; }
    .user-role { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; }

    /* Nav */
    .nav-section {
      display: block; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em;
      color: #475569; text-transform: uppercase; padding: 0.75rem 0.5rem 0.25rem;
    }
    nav { display: flex; flex-direction: column; gap: 0.15rem; flex: 1; }
    nav a {
      display: flex; align-items: center; gap: 0.75rem;
      color: #94a3b8; text-decoration: none;
      padding: 0.6rem 0.75rem; border-radius: 9px;
      transition: background 0.15s, color 0.15s;
      font-size: 0.875rem; font-weight: 500;
      white-space: nowrap;
    }
    nav a:hover { background: rgba(255,255,255,0.07); color: #f1f5f9; }
    nav a.active { background: rgba(37, 99, 235, 0.2); color: #60a5fa; }
    nav a.active svg { stroke: #60a5fa; }
    nav a svg { flex-shrink: 0; }

    /* Sidebar Footer */
    .sidebar-footer { margin-top: auto; padding-top: 0.75rem; border-top: 1px solid #1e293b; }
    .logout-btn {
      width: 100%; display: flex; align-items: center; gap: 0.75rem;
      background: transparent; border: none; cursor: pointer;
      color: #94a3b8; padding: 0.6rem 0.75rem; border-radius: 9px;
      font: inherit; font-size: 0.875rem; font-weight: 500;
      transition: background 0.15s, color 0.15s;
    }
    .logout-btn:hover { background: rgba(239, 68, 68, 0.12); color: #f87171; }

    /* Content Area */
    .content-area { flex: 1; display: flex; flex-direction: column; min-width: 0; }

    /* Topbar */
    .topbar {
      background: #fff; padding: 0.85rem 1.75rem;
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 1px solid #f1f5f9;
      box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    }
    .page-title { margin: 0; font-size: 0.95rem; font-weight: 400; color: #64748b; }
    .page-title strong { color: #0f172a; }
    .role-chip {
      font-size: 0.72rem; font-weight: 700;
      background: #dbeafe; color: #1d4ed8;
      padding: 0.25rem 0.7rem; border-radius: 999px;
      text-transform: uppercase; letter-spacing: 0.05em;
    }
    .role-chip.admin { background: #ede9fe; color: #7c3aed; }

    .page-content { padding: 1.75rem; flex: 1; overflow: auto; }
  `
})
export class MainLayoutComponent {
  readonly authService = inject(AuthService);
  readonly isCollapsed = signal(false);

  initials(): string {
    const name = this.authService.currentUser()?.fullName ?? '';
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  }
}
