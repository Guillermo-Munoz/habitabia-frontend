export interface Rating {
    averageRating: number;
    totalReviews: number;
}

export interface Review {
  id: string;
  reviewerId: string;
  rating: number;
  comment: string;
  createdAt: string;
  isEdited: boolean;
  hostResponse: string | null;
  respondedAt: string | null;
}

export interface ReviewPage {
  content: Review[];
  totalElements: number;
  totalPages: number;
  number: number;
}