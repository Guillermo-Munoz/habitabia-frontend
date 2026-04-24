import { Component, effect, inject, signal } from '@angular/core';
import { Room } from '../models/room.model';
import { RoomService } from '../services/room.service';
import { JsonPipe } from '@angular/common';
import { SearchService } from '../../shared/services/search.service';


@Component({
  selector: 'app-room-list',
  imports: [JsonPipe],
  templateUrl: './room-list.html',
  styleUrl: './room-list.css',
  
})
export class RoomList  {
  private roomService = inject(RoomService);
  private search = inject(SearchService);
  rooms = signal<Room[]>([]);

  constructor() {
    effect(() => {
      this.roomService.getAllRooms(this.search.city()).subscribe({
      next: (data) => {
        console.log('Rooms:', data);
        this.rooms.set(data);
      },
      error: (err) => console.error('Error:', err)
    });
    });
  }



}
