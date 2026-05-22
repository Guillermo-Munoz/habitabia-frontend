import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class SearchService {
  city = signal<string>('');
  guests = signal<number | undefined>(undefined);
  checkIn = signal<string>('');
  checkOut = signal<string>('');
}