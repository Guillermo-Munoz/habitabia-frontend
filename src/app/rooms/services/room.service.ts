import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Amenity, CreateRoomsRequest, Room } from '../models/room.model';
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

createRoom(data: CreateRoomsRequest): Observable<Room> {
  return this.http.post<Room>(`${this.apiUrl}/api/v1/rooms`, data);
}

uploadImage(roomId: string, file: File): Observable<void>{
  const formData = new FormData();
  formData.append('file', file);
  return this.http.post<void>(`${this.apiUrl}/api/v1/rooms/${roomId}/images`, formData);
}


}