import { Component, inject, OnInit, signal } from '@angular/core';
import { Room } from '../models/room.model';
import { RoomService } from '../services/room.service';
import { JsonPipe } from '@angular/common';


@Component({
  selector: 'app-room-list',
  imports: [JsonPipe],
  templateUrl: './room-list.html',
  styleUrl: './room-list.css',
  
})
export class RoomList implements OnInit{
private roomService = inject(RoomService);
  rooms = signal<Room[]>([]);

ngOnInit(): void {
  this.roomService.getAllRooms('Madrid').subscribe({
    next: (data) => {
      console.log('Rooms:', data);
      this.rooms.set(data);
    },
    error: (err) => console.error('Error:', err)
  });
}


}
