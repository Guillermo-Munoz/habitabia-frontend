import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Amenity, Room } from '../models/room.model';
import { RoomService } from '../services/room.service';
import { BookingCalendar, Booking as BookedRange } from '../../shared/components/booking-calendar/booking-calendar';
import { Booking as BookingService } from '../services/booking';
import { ReviewServices } from '../../reviews/services/review.services';
import { Review } from '../../reviews/models/rating.model';
import { FormsModule } from '@angular/forms';

import * as L from 'leaflet';

@Component({
  selector: 'app-room-detail',
  imports: [RouterLink, BookingCalendar, FormsModule],
  templateUrl: './room-detail.html',
  styleUrl: './room-detail.css',
})
export class RoomDetail implements OnInit {

  private route = inject(ActivatedRoute);
  private roomService = inject(RoomService);
  private bookingService = inject(BookingService);
  private reviewService = inject(ReviewServices);
  private roomId = this.getRoomId();
  room = signal<Room | null>(null);
  bookedRanges = signal<BookedRange[]>([]);
  reviews = signal<Review[]>([]);
  userBookingId = signal<string | null>(null);
  submittingReview = signal(false);
  reviewError = signal('');
  reviewForm = { rating: 5, comment: '' };

  selectedDates: { startDate: Date, endDate: Date } | null = null;

  onDatesSelected(dates: { startDate: Date, endDate: Date }) {
    this.selectedDates = dates;
  }

  ngOnInit(): void {
    this.roomService.getRoomById(this.roomId!).subscribe({
      next: (data) => {
        this.room.set(data);
      }
    });

    this.bookingService.getBookingDates(this.roomId!).subscribe({
      next: (data) => {
        this.bookedRanges.set(data);
      },
      error: () => {
        this.bookedRanges.set([]);
      }
    });

    this.reviewService.getReviewsByRoomId(this.roomId!).subscribe({
      next: (page) => this.reviews.set(page.content),
      error: () => {}
    });

    this.bookingService.getMyBookings().subscribe({
      next: (bookings) => {
        const booking = bookings.find(b => b.roomId === this.roomId);
        if (booking) this.userBookingId.set(booking.id);
      },
      error: () => {}
    });

  }

  submitReview(): void {
    if (this.submittingReview() || !this.userBookingId()) return;
    this.submittingReview.set(true);
    this.reviewError.set('');
    this.reviewService.createReview({
      bookingId: this.userBookingId()!,
      rating: this.reviewForm.rating,
      comment: this.reviewForm.comment,
      isReviewForHost: false,
      isPublic: true,
    }).subscribe({
      next: (review) => {
        this.reviews.update(list => [review, ...list]);
        this.userBookingId.set(null);
        this.submittingReview.set(false);
        this.reviewForm = { rating: 5, comment: '' };
      },
      error: () => {
        this.reviewError.set('No se pudo publicar la reseña. Es posible que ya hayas reseñado esta habitación.');
        this.submittingReview.set(false);
      }
    });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  }
 constructor() {
    effect( () => {
    const r = this.room();
      if(r && r.latitude && r.longitude) {
        setTimeout(() => this.initMap(r.latitude, r.longitude), 0);
     }
    });
 }
 private initMap(lat: number, lng: number): void {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    var map = L.map('map').setView([lat, lng], 13);
    const title = (this.room()?.title ?? '').slice(0, 30);


    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([lat, lng]).addTo(map)

        .bindPopup(`<b>${title}</b><br>⭐ ${this.room()?.averageRating}`)

  }

  
  getRoomId(): string | null {
    return this.route.snapshot.paramMap.get('id');
  }

  getStars(rating: number) {
    const stars: string[] = [];
    for (let i = 0; i < 5; i++) {
      if (rating >= 1) {
        stars.push('full');
      } else if (rating < 1 && rating > 0) {
        stars.push('half');
      } else {
        stars.push('empty');
      }
      rating--;
    }
    return stars;
  }

  reservar(): void {
  if (!this.selectedDates || !this.room()) return;
  
  const checkIn = this.selectedDates.startDate.toLocaleDateString('sv');
  const checkOut = this.selectedDates.endDate.toLocaleDateString('sv');
  
  this.bookingService.createBooking(this.roomId!, this.room()!.hostId, checkIn, checkOut).subscribe({
    next: () => alert('Reserva creada'),
    error: () => alert('Error al reservar')
    
  });
  
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
