import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Rating } from '../models/rating.model';


@Injectable({
  providedIn: 'root',
})
export class ReviewServices {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getReviewsByRoomId(roomId: string): Observable<Rating> {
    return this.http.get<Rating>(`${this.apiUrl}/api/v1/reviews/room/${roomId}/rating`);
  }
}
