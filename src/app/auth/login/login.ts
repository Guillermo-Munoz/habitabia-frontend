import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { LoginRequest } from '../models/auth.models';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  submitting = signal(false);
  loginError = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.loginForm.invalid || this.submitting()) return;

    this.submitting.set(true);
    this.loginError.set(null);

    const credentials = this.loginForm.value as LoginRequest;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.router.navigate(['/rooms']);
      },
      error: (error) => {
        this.submitting.set(false);
        this.loginError.set(
          error.status === 401 ? 'Email o contraseña incorrectos' : 'Error al iniciar sesión. Inténtalo de nuevo.'
        );
      }
    });
  }

  register(){
    return this.router.navigate(['/register']);
  }
}
 register(){
    return this.router.navigate(['/register']);
  }

}
