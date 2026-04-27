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
export class RoomList  {
  private roomService = inject(RoomService);
  private search = inject(SearchService);
  rooms = signal<Room[]>([]);

  constructor() {
    effect(() => {
      this.roomService.getAllRooms(this.search.city(), this.search.guests()).subscribe({
        next: (data) => { this.rooms.set(data); },
        error: (err) => console.error('Error:', err)
      });
    });
  }

  getStars(rating: number): string[] {
    const stars: string[] = [];
    for (let i = 0; i < 5; i++) {
      if (rating >= 1) {
        stars.push('full');
      } else if (rating > 0) {
        stars.push('half');
      } else {
        stars.push('empty');
      }
      rating--;
    }
    return stars;
  }
}
