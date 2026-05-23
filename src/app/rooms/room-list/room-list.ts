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
  loadError = signal<string | null>(null);

  constructor() {
    effect(() => {
      const city = this.search.city();
      const guests = this.search.guests();
      const checkIn = this.search.checkIn();
      const checkOut = this.search.checkOut();
      this.currentPage.set(0);
      this.loadRooms(city, guests, checkIn, checkOut);
    });
  }

  loadRooms(city: string, guests: number | undefined, checkIn: string, checkOut: string): void {
    if (checkIn && checkOut) {
      this.roomService.getAvailableRooms(checkIn, checkOut, guests).subscribe({
        next: (rooms) => {
          this.loadError.set(null);
          this.rooms.set(rooms);
          this.currentPage.set(0);
          this.totalPages.set(1);
        },
        error: (err) => {
          console.error('Error cargando habitaciones:', err);
          this.loadError.set(`Error ${err.status}: ${err.message}`);
        }
      });
    } else {
      this.roomService.getAllRooms(city, guests).subscribe({
        next: (rooms) => {
          this.loadError.set(null);
          this.rooms.set(rooms);
          this.currentPage.set(0);
          this.totalPages.set(1);
        },
        error: (err) => {
          console.error('Error cargando habitaciones:', err);
          this.loadError.set(`Error ${err.status}: ${err.message}`);
        }
      });
    }
  }

  goToPage(): void {
    this.loadRooms(
      this.search.city(), this.search.guests(),
      this.search.checkIn(), this.search.checkOut()
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
