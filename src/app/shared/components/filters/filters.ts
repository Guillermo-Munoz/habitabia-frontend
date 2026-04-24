import { Component, inject, OnInit, signal } from '@angular/core';
import { RoomService } from '../../../rooms/services/room.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-filters',
  imports: [],
  templateUrl: './filters.html',
  styleUrl: './filters.css',
})
export class Filters implements OnInit {
  private cities = inject(RoomService).getCities();
  private search = inject(SearchService)
  citiesList = signal<string[]>([]);

  ngOnInit(): void {
    this.cities.subscribe({
      next: (data) => {
        console.log('Cities:', data);
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
}
