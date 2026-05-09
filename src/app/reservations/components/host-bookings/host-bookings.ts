import { Component, inject, OnInit, signal } from '@angular/core';
import { StatePiped } from '../../../shared/pipes/booking-status.pipe';
import { ReservationService } from '../../services/booking.service';
import { Reservation } from '../../models/reservation.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-host-bookings',
  imports: [StatePiped],
  templateUrl: './host-bookings.html',
  styleUrl: './host-bookings.css',
})
export class HostBookings implements OnInit {

    reservationSvc = inject(ReservationService);
    reservations = signal<Reservation[]>([]);

    ngOnInit(): void {
    this.reservationSvc.getMyBookingsAsHost().subscribe({
      next: (data) => {
        this.reservations.set(data)
      },
      error: (err) => console.error('Error cargando reservas', err)

    })
  }
    updateStatus(id: string, action: (id: string) => Observable<Reservation>, errorMsg: string) {
    action(id).subscribe({
      next: (update) => {
        this.reservations.update(list =>
          list.map(s => s.id === id ? { ...s, ...update } : s)
        );
      },
      error: () => alert(errorMsg)
    });
  }



}
