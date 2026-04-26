import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Room } from '../models/room.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
  
})
export class RoomService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAllRooms(city: string | undefined, guests: number | undefined): Observable<Room[]> {
    const params: any = {};

    if (city) { params[`city`] = city; }
    if(guests) { params[`guests`] = guests; }

  return this.http.get<Room[]>(`${this.apiUrl}/api/v1/rooms`, {params});
}

getCities(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/api/v1/rooms/cities`);
}

getRoomById(id: string): Observable<Room> {
  return this.http.get<Room>(`${this.apiUrl}/api/v1/rooms/${id}`);

}
}