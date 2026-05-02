import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    if (authService.getToken()) {
    router.navigate(['/rooms']);
    return false;
    }
    return true;

};
