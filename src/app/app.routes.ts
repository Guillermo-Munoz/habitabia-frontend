import { Routes } from '@angular/router';

export const routes: Routes = [
{
    path: 'rooms',
    loadChildren: () => import('./rooms/rooms.routes').then(m => m.ROOMS_ROUTES)
},
{
  path: 'login',
  loadComponent: () => import('./auth/login/login').then(m => m.Login)
},
{
  path:  'profile',
  loadChildren: () => import('./users/users.routes').then(m => m.USERS_ROUTES)
}

];
