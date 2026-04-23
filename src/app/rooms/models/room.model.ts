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
}


