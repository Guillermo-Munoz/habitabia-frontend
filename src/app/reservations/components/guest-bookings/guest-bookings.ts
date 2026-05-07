import { Component, inject, OnInit, signal } from '@angular/core';
import { ReservationService } from '../../services/booking.service';
import { Reservation } from '../../models/reservation.model';

@Component({
  selector: 'app-guest-bookings',
  imports: [],
  templateUrl: './guest-bookings.html',
  styleUrl: './guest-bookings.css',
})
export class GuestBookings implements OnInit{

    private reservation = inject(ReservationService);
    reservations = signal<Reservation[]>([]);

  ngOnInit(): void {
    this.reservation.getMyBooking().subscribe({
      next: (reservation) => {
        this.reservations.set(reservation)

      }
    })
  }
}
