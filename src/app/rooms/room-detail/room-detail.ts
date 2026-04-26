import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Room } from '../models/room.model';
import { RoomService } from '../services/room.service';

@Component({
  selector: 'app-room-detail',
  imports: [],
  templateUrl: './room-detail.html',
  styleUrl: './room-detail.css',
})
export class RoomDetail implements OnInit {
 
  private route = inject(ActivatedRoute);
  private roomService = inject(RoomService);
  private roomId = this.getRoomId();
  room = signal<Room | null>(null);

  ngOnInit(): void {
     this.roomService.getRoomById(this.roomId!).subscribe({
      next: (data) => {
        this.room.set(data);
    }
    });
  }

  getRoomId(): string | null {
    return this.route.snapshot.paramMap.get('id');
  }

}