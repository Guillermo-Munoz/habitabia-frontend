import { Routes } from '@angular/router';
import { guestGuard } from './shared/guards/guest-guard';
import { AuthGuard } from './shared/guards/auth.guard';

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
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register').then(m => m.Register),
    canActivate: [guestGuard]
  },
  {
    path: 'reservations',
    loadComponent: () => import('./reservations/components/guest-bookings/guest-bookings').then(m => m.GuestBookings),
    canActivate: [AuthGuard]
  },
  {
    path: 'hosting',
    loadComponent: () => import('./reservations/components/host-bookings/host-bookings').then(m => m.HostBookings),
    canActivate: [AuthGuard]
  },
  {
    path: 'messages/:bookingId',
    loadComponent: () => import('./messages/components/message-view/message-view').then(m => m.MessageView),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/components/admin-panel/admin-panel').then(m => m.AdminPanel),
    canActivate: [AuthGuard]
  },

];
