import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class SearchService {
city = signal<string>('');
guests = signal<number>(1);

}