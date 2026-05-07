import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Rating, Review, ReviewPage } from '../models/rating.model';


@Injectable({
  providedIn: 'root',
})
export class ReviewServices {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getRating(roomId: string): Observable<Rating> {
    return this.http.get<Rating>(`${this.apiUrl}/api/v1/reviews/room/${roomId}/rating`);
  }

  getReviewsByRoomId(roomId: string): Observable<ReviewPage> {
    return this.http.get<ReviewPage>(`${this.apiUrl}/api/v1/reviews/room/${roomId}`);
  }

  createReview(request: {
    bookingId: string;
    rating: number;
    comment: string;
    isReviewForHost: boolean;
    isPublic: boolean;
  }): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/api/v1/reviews`, request);
  }
}
