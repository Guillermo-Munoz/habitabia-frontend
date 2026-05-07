import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { RegisterRequest } from '../models/auth.models';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router  = inject(Router);
  errorMensage = signal('');

  registerForm = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.registerForm.valid) {
  
      const credentials = this.registerForm.value as RegisterRequest;
  
      this.authService.register(credentials).subscribe({
        next: (response) => {
          this.authService.saveToken(response.token);
          
          this.router.navigate(['/rooms']);
        },
        error: (error) => {
          if(error.status ===409){
            this.errorMensage.set('Este email ya está registrado. Inicia Sesión')
          }
        }
      });
    }
  }
 
}
