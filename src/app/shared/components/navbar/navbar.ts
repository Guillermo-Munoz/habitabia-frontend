import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../../users/services/user.service';
import { UserModel } from '../../../users/models/User.model';
import { AuthService } from '../../../auth/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../../notifications/services/notification.service';
import { NotificationModel } from '../../../notifications/models/notification.nodels';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, DatePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit{

  private userService = inject(UserService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);


  notifications = signal<NotificationModel[] | null>(null);
  user = signal<UserModel | null>(null);

  //Obtener numero de notificaciones no leidas
  unreadCount = computed(() => { 
    const notifis = this.notifications();
    if(!notifis) return 0;
    return notifis.filter(n => !n.isRead).length;
   });  

  dropdownOpen = signal(false);
  notificationOpen = signal(false);
  
  isLoggedIn = () => !!this.authService.getToken();

  ngOnInit(): void {
    if (!this.authService.getToken()) return;
    this.userService.getMe().subscribe({
      next: (data) => this.user.set(data)
    });
    this.notificationService.getNotification().subscribe({
      next: (data) => this.notifications.set(data)
    })

  }
  navigateTo(notif: NotificationModel): void {
    this.notificationOpen.set(false);
    this.notificationService.markAsRead(notif.id).subscribe();
    this.notifications.update(list =>
      list?.map(n => n.id === notif.id ? { ...n, isRead: true } : n) ?? null
    );
    if (notif.type === 'MESSAGE_RECEIVED') {
      this.router.navigate(['/messages', notif.referenceId]);
      return;
    }
    const routes: Record<string, string> = {
      REVIEW_RECEIVED: '/hosting',
      REVIEW_APPROVED: '/hosting',
      REVIEW_RESPONSE: '/hosting',
      BOOKING_ACCEPTED: '/reservations',
      BOOKING_REJECTED: '/reservations',
    };
    const route = routes[notif.type];
    if (route) this.router.navigate([route]);
  }
  logout(): void {
    this.authService.logout();
}
















}
