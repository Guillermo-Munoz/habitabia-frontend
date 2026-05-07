export interface Reservation{
     id: string;
     roomId: string;
     guestId: string;
     hostId: string;
     checkIn: string;
     checkOut: string;
     guests: number;
     status: string;
     message: string;
     createdAt: string;
}