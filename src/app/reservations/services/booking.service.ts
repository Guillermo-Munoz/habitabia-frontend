import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Reservation } from "../models/reservation.model";
import { Observable } from "rxjs";

@Injectable(
    {
        providedIn: 'root'
    }
)
export class ReservationService {
    private http: HttpClient = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    getMyBooking(){
        return this.http.get<Reservation[]>(`${this.apiUrl}/api/v1/bookings/guest/me`);
    }
  
  cancel(id: string): Observable<Reservation>{
    return this.http.patch<Reservation>(`${this.apiUrl}/api/v1/bookings/${id}/cancel`, {});
  }
}