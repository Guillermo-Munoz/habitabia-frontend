import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../services/room.service';
import { Amenity } from '../../models/room.model';

@Component({
  selector: 'app-room-edit',
  imports: [FormsModule],
  templateUrl: './room-edit.html',
  styleUrl: './room-edit.css',
})
export class RoomEdit implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private roomService = inject(RoomService);

  roomId = this.route.snapshot.paramMap.get('id')!;
  submitting = signal(false);
  loading = signal(true);

  formData = {
    title: '',
    description: '',
    street: '',
    city: '',
    country: '',
    priceAmount: 0,
    priceCurrency: 'EUR',
    maxGuests: 1,
    amenities: [] as Amenity[],
  };

  allAmenities: { value: Amenity; label: string }[] = [
    { value: 'WIFI', label: 'WiFi' },
    { value: 'WASHING_MACHINE', label: 'Lavadora' },
    { value: 'HEATING', label: 'Calefacción' },
    { value: 'AC', label: 'Aire acondicionado' },
    { value: 'SHARED_KITCHEN', label: 'Cocina compartida' },
    { value: 'PRIVATE_KITCHEN', label: 'Cocina privada' },
    { value: 'SHARED_BATHROOM', label: 'Baño compartido' },
    { value: 'PRIVATE_BATHROOM', label: 'Baño privado' },
    { value: 'STUDY_DESK', label: 'Escritorio de estudio' },
    { value: 'BIKE_PARKING', label: 'Parking de bicicletas' },
  ];

  ngOnInit(): void {
    this.roomService.getRoomById(this.roomId).subscribe({
      next: (room) => {
        this.formData = {
          title: room.title,
          description: room.description,
          street: '',
          city: room.city,
          country: room.country,
          priceAmount: room.priceAmount,
          priceCurrency: room.priceCurrency,
          maxGuests: room.maxGuests,
          amenities: [...room.amenities],
        };
        this.loading.set(false);
      },
      error: () => this.router.navigate(['/rooms']),
    });
  }

  isSelected(value: Amenity): boolean {
    return this.formData.amenities.includes(value);
  }

  toggleAmenity(value: Amenity): void {
    const index = this.formData.amenities.indexOf(value);
    if (index === -1) this.formData.amenities.push(value);
    else this.formData.amenities.splice(index, 1);
  }

  submit(): void {
    if (this.submitting()) return;
    this.submitting.set(true);
    this.roomService.updateRoom(this.roomId, this.formData).subscribe({
      next: () => this.router.navigate(['/rooms', this.roomId]),
      error: () => this.submitting.set(false),
    });
  }

  cancel(): void {
    this.router.navigate(['/rooms', this.roomId]);
  }
}
