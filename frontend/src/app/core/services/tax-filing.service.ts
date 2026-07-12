import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';
import { TaxFiling, TaxFilingRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class TaxFilingService {
  private readonly baseUrl = `${API_BASE_URL}/tax-filings`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<TaxFiling[]> {
    return this.http.get<TaxFiling[]>(this.baseUrl);
  }

  getById(id: number): Observable<TaxFiling> {
    return this.http.get<TaxFiling>(`${this.baseUrl}/${id}`);
  }

  getByStatus(status: string): Observable<TaxFiling[]> {
    return this.http.get<TaxFiling[]>(`${API_BASE_URL}/tax-types/status`, { params: { status } });
  }

  getByYear(year: string): Observable<TaxFiling[]> {
    return this.http.get<TaxFiling[]>(`${API_BASE_URL}/tax-types/year`, { params: { year } });
  }

  getByUser(userId: number): Observable<TaxFiling[]> {
    return this.http.get<TaxFiling[]>(`${API_BASE_URL}/tax-types/user/${userId}`);
  }

  getFiledByUser(userId: number): Observable<TaxFiling[]> {
    return this.http.get<TaxFiling[]>(`${API_BASE_URL}/tax-types/user/${userId}`);
  }

  getByTaxType(taxTypeId: number): Observable<TaxFiling[]> {
    return this.http.get<TaxFiling[]>(`${API_BASE_URL}/tax-types/tax-type/${taxTypeId}`);
  }

  create(request: TaxFilingRequest): Observable<TaxFiling> {
    return this.http.post<TaxFiling>(this.baseUrl, request);
  }

  update(id: number, request: TaxFilingRequest): Observable<TaxFiling> {
    return this.http.put<TaxFiling>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  approve(id: number): Observable<TaxFiling> {
    return this.http.post<TaxFiling>(`${this.baseUrl}/${id}/approve`, {});
  }

  reject(id: number, feedback: string): Observable<TaxFiling> {
    return this.http.post<TaxFiling>(`${this.baseUrl}/${id}/reject`, { feedback });
  }

  submit(id: number): Observable<TaxFiling> {
    return this.http.post<TaxFiling>(`${this.baseUrl}/${id}/submit`, {});
  }
}
