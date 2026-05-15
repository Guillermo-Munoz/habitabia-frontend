import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { AdminStats, BannedWord, BannedWordPage, FlaggedReview, FlaggedReviewPage } from '../models/admin.models';

@Injectable({
  providedIn: 'root',
})
export class AdminService{
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/api/v1/admin/stats`);
  }
  getFlaggedReviews(page = 0): Observable<FlaggedReviewPage> {
    return this.http.get<FlaggedReviewPage>(`${this.apiUrl}/api/v1/admin/reviews/flagged?page=${page}&size=10`);
  }
  approvedReview(id: string): Observable<FlaggedReview> {
    return this.http.patch<FlaggedReview>(`${this.apiUrl}/api/v1/admin/reviews/${id}/approve`, {});
  }
  rejectReview(id: string): Observable<FlaggedReview> {
    return this.http.patch<FlaggedReview>(`${this.apiUrl}/api/v1/admin/reviews/${id}/reject`, {});
  }
  getBannedWords(page = 0): Observable<BannedWordPage> {
    return this.http.get<BannedWordPage>(`${this.apiUrl}/api/v1/admin/banned-words?page=${page}&size=15`);
  }
  addBannedWord(word: string, sureness: number): Observable<BannedWord> {
    return this.http.post<BannedWord>(
      `${this.apiUrl}/api/v1/admin/banned-words?word=${word}&sureness=${sureness}`, {}
    );
  }
  deleteBannedWord(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/v1/admin/banned-words/${id}`);
  }
}
