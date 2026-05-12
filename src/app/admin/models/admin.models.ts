export interface BannedWord {
  id: string;
  word: string;
  sureness: number; // 0, 1 o 2
  createdAt: string;
}
export interface FlaggedReview {
    id: string;
    bookingId: string;
    reviewerId: string;
    rating: number;
    comment: string; 
    flagReason: string | null;
    isApproved: boolean; 
    createdAt: string; 
}