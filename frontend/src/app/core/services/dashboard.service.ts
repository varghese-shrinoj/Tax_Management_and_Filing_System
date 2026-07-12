import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';
import { DashboardResponse, ReportResponse, TaxDocument, Payment, TaxFiling, User } from '../models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private readonly http: HttpClient) {}

  getDashboard(userId?: number): Observable<DashboardResponse> {
    const url = userId ? `${API_BASE_URL}/dashboard?userId=${userId}` : `${API_BASE_URL}/dashboard`;
    return this.http.get<DashboardResponse>(url);
  }
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(private readonly http: HttpClient) {}

  getSummary(): Observable<ReportResponse> {
    return this.http.get<ReportResponse>(`${API_BASE_URL}/reports/summary`);
  }

  getUsersReport(): Observable<User[]> {
    return this.http.get<User[]>(`${API_BASE_URL}/reports/users`);
  }

  getTaxFilingsReport(): Observable<TaxFiling[]> {
    return this.http.get<TaxFiling[]>(`${API_BASE_URL}/reports/tax-filings`);
  }

  getPaymentsReport(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${API_BASE_URL}/reports/payments`);
  }

  getDocumentsReport(): Observable<TaxDocument[]> {
    return this.http.get<TaxDocument[]>(`${API_BASE_URL}/reports/documents`);
  }

  getRevenue(): Observable<number> {
    return this.http.get<number>(`${API_BASE_URL}/reports/revenue`);
  }
}
