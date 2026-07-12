import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';
import { TaxDocument, DocumentRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly baseUrl = `${API_BASE_URL}/documents`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<TaxDocument[]> {
    return this.http.get<TaxDocument[]>(this.baseUrl);
  }

  getById(id: number): Observable<TaxDocument> {
    return this.http.get<TaxDocument>(`${this.baseUrl}/${id}`);
  }

  upload(request: DocumentRequest): Observable<TaxDocument> {
    return this.http.post<TaxDocument>(this.baseUrl, request);
  }

  update(id: number, request: DocumentRequest): Observable<TaxDocument> {
    return this.http.put<TaxDocument>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }
}
