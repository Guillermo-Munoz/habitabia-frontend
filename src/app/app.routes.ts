import { Routes } from '@angular/router';
import { guestGuard } from './shared/guards/guest-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'rooms',
    pathMatch: 'full'
  },
  {
    path: 'rooms',
    loadChildren: () => import('./rooms/rooms.routes').then(m => m.ROOMS_ROUTES)
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then(m => m.Login),
    canActivate: [guestGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./users/users.routes').then(m => m.USERS_ROUTES)
  }
];
