import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReservationService } from '../../services/booking.service';
import { Reservation } from '../../models/reservation.model';
import { StatePiped } from '../../../shared/pipes/booking-status.pipe';
import { ModalService } from '../../../shared/services/modal.service';

@Component({
  selector: 'app-guest-bookings',
  imports: [StatePiped, RouterLink],
  templateUrl: './guest-bookings.html',
  styleUrl: './guest-bookings.css',
})
export class GuestBookings implements OnInit{

    private reservation = inject(ReservationService);
    private modal = inject(ModalService);
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
    this.modal.confirm(msg).then(ok => {
      if (!ok) return;
      this.reservation.cancel(id).subscribe({
        next: (update) => {
          this.reservations.update(list =>
            list.map(s => s.id === id ? update : s)
          );
        },
        error: () => this.modal.alert('No se pudo cancelar la reserva.')
      });
    });
  }

  confirmStay(id: string) {
    this.modal.confirm('¿Confirmar tu estancia?').then(ok => {
      if (!ok) return;
      this.reservation.confirm(id).subscribe({
        next: (update) => {
          this.reservations.update(list =>
            list.map(s => s.id === id ? update : s)
          );
        },
        error: () => this.modal.alert('No se pudo confirmar la estancia.')
      });
    });
  }
}
