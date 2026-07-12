import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';
import { AuthResponse, AuthUser, LoginRequest, ProfileUpdateRequest, SignupRequest, User } from '../models';

const AUTH_KEY = 'tax_auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSignal = signal<AuthUser | null>(this.loadUser());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);
  readonly isAdmin = computed(() => this.currentUserSignal()?.role === 'ADMIN');
  readonly isTaxpayer = computed(() => this.currentUserSignal()?.role === 'TAXPAYER');
  readonly isVerifier = computed(() => this.currentUserSignal()?.role === 'VERIFIER');

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  login(request: LoginRequest): Observable<string> {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/login`, request).pipe(
      map((response) => {
        if (response.message !== 'Login Successful' || !response.token || !response.userId || !response.role) {
          return response.message;
        }

        const authUser: AuthUser = {
          id: response.userId,
          fullName: response.fullName ?? '',
          email: response.email ?? request.email,
          role: response.role,
          token: response.token
        };
        this.persistUser(authUser);
        return response.message;
      })
    );
  }

  signup(request: SignupRequest): Observable<string> {
    return this.http.post(`${API_BASE_URL}/auth/signup`, request, { responseType: 'text' });
  }

  logout(): void {
    localStorage.removeItem(AUTH_KEY);
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.currentUserSignal()?.token ?? null;
  }

  updateProfile(request: ProfileUpdateRequest): Observable<AuthUser> {
    return this.http.put<Omit<User, 'password'>>(`${API_BASE_URL}/users/profile`, request).pipe(
      map((user) => {
        const current = this.currentUserSignal();
        if (!current) {
          throw new Error('Not logged in');
        }
        const updated: AuthUser = {
          ...current,
          fullName: user.fullName,
          email: user.email
        };
        this.persistUser(updated);
        return updated;
      })
    );
  }

  private persistUser(user: AuthUser): void {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    this.currentUserSignal.set(user);
  }

  private loadUser(): AuthUser | null {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}
