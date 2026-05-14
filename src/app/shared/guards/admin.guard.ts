import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../../auth/services/auth.service";

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.getRole() === 'ADMIN') return true;
  router.navigate(['/rooms']);
  return false;
};
