import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    console.log('🔹 LoginComponent iniciado');
    if (this.authService.isAuthenticated()) {
      console.log('Usuário já autenticado, redirecionando...');
      this.router.navigate(['/chat']);
    }
  }

  loginGoogle() {
    console.log('🟢 LoginGoogle acionado');
    window.location.href = 'http://localhost:3000/auth/google';
  }
}
