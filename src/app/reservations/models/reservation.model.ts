export interface Reservation{
     roomTitle: string;
     id: string;
     roomId: string;
     guestId: string;
     hostId: string;
     checkIn: string;
     checkOut: string;
     guests: number;
     status: string;
     message: string;
     roomImageUrl: string;
     createdAt: string;
}