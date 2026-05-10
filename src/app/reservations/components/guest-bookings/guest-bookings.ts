import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReservationService } from '../../services/booking.service';
import { Reservation } from '../../models/reservation.model';
import { StatePiped } from '../../../shared/pipes/booking-status.pipe';

@Component({
  selector: 'app-guest-bookings',
  imports: [StatePiped, RouterLink],
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
      },
      error: (err) => console.error('Error cargando reservas', err)

    })
  }
  cancelReservation(id: string, msg: string){
    if (!window.confirm(msg)) return;
    this.reservation.cancel(id).subscribe({
      next: (update) => {
        this.reservations.update(list =>
          list.map(s => s.id === id ? update : s)
        );
      },
      error: () => alert('No se pudo cancelar la reserva')
    });
  }
}
