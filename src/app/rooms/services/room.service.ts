import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Room } from '../models/room.model';


@Injectable({
  providedIn: 'root',
  
})
export class RoomService {
  private http = inject(HttpClient);

  getAllRooms(city: string, guests: number = 1): Observable<Room[]> {
  return this.http.get<Room[]>('http://localhost:8080/api/v1/rooms', {
    params: { city, guests }
  });
}

getCities(): Observable<string[]> {
  return this.http.get<string[]>('http://localhost:8080/api/v1/rooms/cities');

}
}