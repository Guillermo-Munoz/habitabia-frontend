export type RoomStatus = 'ACTIVE' | 'INACTIVE' | 'DELETED';

export interface Room {
  id: string;
  hostId: string;
  title: string;
  description: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  priceAmount: number;
  priceCurrency: string;
  maxGuests: number;
  status: RoomStatus;
  imageUrls: string[];
  amenities: Amenity[];
  averageRating: number;
  totalReviews: number;
}

export type Amenity =
  | 'WIFI'
  | 'WASHING_MACHINE'
  | 'HEATING'
  | 'AC'
  | 'SHARED_KITCHEN'
  | 'PRIVATE_KITCHEN'
  | 'SHARED_BATHROOM'
  | 'PRIVATE_BATHROOM'
  | 'STUDY_DESK'
  | 'BIKE_PARKING';


