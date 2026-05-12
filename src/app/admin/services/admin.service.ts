import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { BannedWord, FlaggedReview } from '../models/admin.models';

@Injectable({
  providedIn: 'root',
})

// GET    /api/v1/admin/reviews/flagged       → getFlaggedReviews()
// PATCH  /api/v1/admin/reviews/{id}/approve  → approveReview(id)
// PATCH  /api/v1/admin/reviews/{id}/reject   → rejectReview(id)
// GET    /api/v1/admin/banned-words          → getBannedWords()
// POST   /api/v1/admin/banned-words          → addBannedWord(word, sureness)
// DELETE /api/v1/admin/banned-words/{id}     → deleteBannedWord(id)

export class AdminService{
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getFlaggedReviews(): Observable<FlaggedReview[]>{
    return this.http.get<FlaggedReview[]>(`${this.apiUrl}/api/v1/admin/reviews/flagged`);

  }
  approvedReview(id: string): Observable<FlaggedReview>{
    return this.http.patch<FlaggedReview>(`${this.apiUrl}/api/v1/admin/reviews/${id}/approve`, {});
  }
  rejectReview(id: string): Observable<FlaggedReview>{
    return this.http.patch<FlaggedReview>(`${this.apiUrl}/api/v1/admin/reviews/${id}/reject`, {});
  }
  getBannedWords(): Observable<BannedWord[]>{
    return this.http.get<BannedWord[]>(`${this.apiUrl}/api/v1/admin/banned-words`)
  }
  addBannedWord(word: string, sureness: number): Observable<BannedWord> {
  return this.http.post<BannedWord>(
    `${this.apiUrl}/api/v1/admin/banned-words?word=${word}&sureness=${sureness}`, {}
  );
 }
  deleteBannedWord(id: string): Observable<void>{
  return this.http.delete<void>(`${this.apiUrl}/api/v1/admin/banned-words/${id}`);
  }
}