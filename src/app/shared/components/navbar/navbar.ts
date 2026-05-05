import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../../users/services/user.service';
import { UserModel } from '../../../users/models/User.model';
import { AuthService } from '../../../auth/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit{

  private userService = inject(UserService);
  private authService = inject(AuthService);

  user = signal<UserModel | null>(null);
  dropdownOpen = signal(false);

  ngOnInit(): void {
    if (!this.authService.getToken()) return;
    this.userService.getMe().subscribe({
      next: (data) => this.user.set(data)
    });
  }


logout(): void {
    this.authService.logout();
}















}
