import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Booking {
  private http: HttpClient = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  
  getBookingDates(roomId: string){
    return this.http.get<{checkIn: string, checkOut: string}[]>(`${this.apiUrl}/api/v1/rooms/${roomId}/booked-dates`);

  }
  
  createBooking(roomId: string, hostId: string, checkIn: string, checkOut: string, guests: number = 1) {
    return this.http.post(`${this.apiUrl}/api/v1/bookings`, {roomId, hostId, checkIn, checkOut, guests});
  }
}
