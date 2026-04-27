import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Amenity, Room } from '../models/room.model';
import { RoomService } from '../services/room.service';

@Component({
  selector: 'app-room-detail',
  imports: [RouterLink],
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

  getStars(rating: number) {
     const stars: string[] = []

    for (let i = 0; i < 5; i++) {
      if(rating >= 1) {
        stars.push("full");
      } else if (rating < 1 && rating > 0) {
        stars.push("half");
      } else if (rating <= 0) {
        stars.push("empty");
      }
      rating --;
    }
    return stars;
}
   

  amenityIcons: Record<Amenity, string> = {
    WIFI:             'icons/amenities/wifi.svg',
    WASHING_MACHINE:  'icons/amenities/washing-machine.svg',
    HEATING:          'icons/amenities/heating.svg',
    AC:               'icons/amenities/ac.svg',
    SHARED_KITCHEN:   'icons/amenities/shared-kitchen.svg',
    PRIVATE_KITCHEN:  'icons/amenities/private-kitchen.svg',
    SHARED_BATHROOM:  'icons/amenities/shared-bathroom.svg',
    PRIVATE_BATHROOM: 'icons/amenities/private-bathroom.svg',
    STUDY_DESK:       'icons/amenities/study-desk.svg',
    BIKE_PARKING:     'icons/amenities/bike-parking.svg',
  };
}
