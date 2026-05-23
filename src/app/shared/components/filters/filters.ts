import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RoomService } from '../../../rooms/services/room.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-filters',
  imports: [RouterLink],
  templateUrl: './filters.html',
  styleUrl: './filters.css',
})
export class Filters implements OnInit {
  private cities = inject(RoomService).getCities();
  search = inject(SearchService)
  citiesList = signal<string[]>([]);

  ngOnInit(): void {
    this.cities.subscribe({
      next: (data) => {
        this.citiesList.set(data);
      },
      error: (err) => console.error('Error:', err)
    });
  }
  onCityChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedCity = selectElement.value;
    this.search.city.set(selectedCity);
  }

  onGuestsChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const guests = parseInt(inputElement.value, 10);
    this.search.guests.set(guests);
  }

  onCheckInChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search.checkIn.set(value);
    const currentCheckOut = this.search.checkOut();
    if (!value || (currentCheckOut && currentCheckOut <= value)) {
      this.search.checkOut.set('');
    }
  }

  onCheckOutChange(event: Event): void {
    this.search.checkOut.set((event.target as HTMLInputElement).value);
  }

  get today(): string {
    return new Date().toLocaleDateString('sv');
  }

  get minCheckOut(): string {
    const ci = this.search.checkIn();
    if (!ci) return this.today;
    const d = new Date(ci);
    d.setDate(d.getDate() + 1);
    return d.toLocaleDateString('sv');
  }
}
