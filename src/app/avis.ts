import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Aviss {
  id?: number;
  nom: string;
  message: string;
  note: number;
  dateCreation?: string;
}

@Injectable({ providedIn: 'root' })
export class AvisService {

  private apiUrl = 'http://localhost:8080/api/avis';

  constructor(private http: HttpClient) {}

  getAvis(): Observable<Aviss[]> {
    return this.http.get<Aviss[]>(this.apiUrl);
  }

  addAvis(avis: Aviss): Observable<Aviss> {
    return this.http.post<Aviss>(this.apiUrl, avis);
  }

  // NOUVEAU : modifier
  updateAvis(id: number, avis: Aviss): Observable<Aviss> {
    return this.http.put<Aviss>(`${this.apiUrl}/${id}`, avis);
  }

  // NOUVEAU : supprimer
  deleteAvis(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
