import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { AuthService } from "../../auth/services/auth.service";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";

export const authInterceptor : HttpInterceptorFn = (req, next) => {

    const authService = inject(AuthService);
    const token = authService.getToken();
    const cloneReq = (token && !req.url.includes('/auth/'))
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    return next(cloneReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if ((error.status === 401 || error.status === 403) && !req.url.includes('/auth/')) {
                authService.logout();
            }
            return throwError(() => error);
        })
    );
}
