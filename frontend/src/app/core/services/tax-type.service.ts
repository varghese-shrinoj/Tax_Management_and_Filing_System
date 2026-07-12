import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';
import { TaxType } from '../models';

@Injectable({ providedIn: 'root' })
export class TaxTypeService {
  private readonly baseUrl = `${API_BASE_URL}/tax-types`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<TaxType[]> {
    return this.http.get<TaxType[]>(this.baseUrl);
  }

  getById(id: number): Observable<TaxType> {
    return this.http.get<TaxType>(`${this.baseUrl}/${id}`);
  }

  search(name: string): Observable<TaxType[]> {
    return this.http.get<TaxType[]>(`${this.baseUrl}/search`, { params: { name } });
  }

  create(taxType: TaxType): Observable<TaxType> {
    return this.http.post<TaxType>(this.baseUrl, taxType);
  }

  update(id: number, taxType: TaxType): Observable<TaxType> {
    return this.http.put<TaxType>(`${this.baseUrl}/${id}`, taxType);
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }
}
