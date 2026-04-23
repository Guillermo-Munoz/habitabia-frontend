import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../../auth/services/auth.service";

export const AuthGuard:
  CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    if (authService.getToken() === null) {
      router.navigate(['/login']);
      return false;
    }else{
      const token = authService.getToken();
      return !!token; 
    }
  }
