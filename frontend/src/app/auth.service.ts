// frontend/src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  checkAuth(): Observable<boolean> {
    return this.http.get<any>(`${this.apiUrl}/user`, { withCredentials: true })
      .pipe(map(res => !!res.authenticated));
  }

  logout(): void {
    window.location.href = 'http://localhost:3000/logout';
  }
}
