// frontend/src/app/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    console.log('🔍 AuthGuard verificação...');
    return this.authService.checkAuth().pipe(
      map(authenticated => {
        if (authenticated) {
          console.log('✅ Usuário autenticado, liberando rota');
          return true;
        } else {
          console.log('❌ Usuário não autenticado, redirecionando para /login');
          this.router.navigate(['/login']);
          return false;
        }
      }),
      catchError(err => {
        console.error('❌ Erro ao checar auth', err);
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
