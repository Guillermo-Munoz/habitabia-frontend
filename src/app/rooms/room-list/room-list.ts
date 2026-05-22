import { Component, effect, inject, signal } from '@angular/core';
import { Room } from '../models/room.model';
import { RoomService } from '../services/room.service';
import { SearchService } from '../../shared/services/search.service';
import { RouterLink } from '@angular/router';
import { Filters } from '../../shared/components/filters/filters';

@Component({
  selector: 'app-room-list',
  imports: [RouterLink, Filters],
  templateUrl: './room-list.html',
  styleUrl: './room-list.css',
})
export class RoomList {
  private roomService = inject(RoomService);
  private search = inject(SearchService);

  rooms = signal<Room[]>([]);
  currentPage = signal(0);
  totalPages = signal(1);

  constructor() {
    effect(() => {
      const city = this.search.city();
      const guests = this.search.guests();
      const checkIn = this.search.checkIn();
      const checkOut = this.search.checkOut();
      this.currentPage.set(0);
      this.loadRooms(city, guests, checkIn, checkOut, 0);
    });
  }

  loadRooms(city: string, guests: number | undefined, checkIn: string, checkOut: string, page: number): void {
    const request$ = (checkIn && checkOut)
      ? this.roomService.getAvailableRooms(checkIn, checkOut, guests, page)
      : this.roomService.getAllRooms(city, guests, page);

    request$.subscribe({
      next: (data) => {
        this.rooms.set(data.content);
        this.currentPage.set(data.number);
        this.totalPages.set(data.totalPages);
      },
      error: (err) => console.error('Error:', err)
    });
  }

  goToPage(page: number): void {
    this.loadRooms(
      this.search.city(), this.search.guests(),
      this.search.checkIn(), this.search.checkOut(),
      page
    );
  }

  getStars(rating: number): string[] {
    const stars: string[] = [];
    for (let i = 0; i < 5; i++) {
      if (rating >= 1) stars.push('full');
      else if (rating > 0) stars.push('half');
      else stars.push('empty');
      rating--;
    }
    return stars;
  }
}
