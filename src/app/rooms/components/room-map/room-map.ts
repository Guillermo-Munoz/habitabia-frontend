import { Component, AfterViewInit, inject, signal, effect } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { Room } from '../../models/room.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-room-map',
  imports: [],
  templateUrl: './room-map.html',
  styleUrl: './room-map.css',
})
export class RoomMap implements AfterViewInit {
  private roomService = inject(RoomService);
  private router = inject(Router);
  private map!: L.Map;
  private viewReady = signal(false);

  constructor() {
    effect(() => {
      if (this.viewReady()) {
        setTimeout(() => this.initMap(), 0);
      }
    });
  }

  ngAfterViewInit(): void {
    this.viewReady.set(true);
  }

  private initMap(): void {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    this.map = L.map('room-map').setView([40.4168, -3.7038], 6);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.whenReady(() => {
      setTimeout(() => this.map.invalidateSize(), 100);
    });

    this.roomService.getAllRooms(undefined, undefined).subscribe({
      next: (rooms) => this.addMarkers(rooms)
    });
  }

  private addMarkers(rooms: Room[]): void {
    rooms
      .filter(r => r.latitude !== 0 && r.longitude !== 0)
      .forEach(room => {
        const popup = `
          <div style="min-width:180px;font-family:inherit;line-height:1.6">
            <strong style="font-size:1rem">${room.title}</strong><br>
            <span style="color:#888">${room.city}</span><br>
            <b style="color:#1F3B69">${room.priceAmount}€</b> / noche<br><br>
            <a href="/rooms/${room.id}"
               style="display:inline-block;background:#1F3B69;color:#fff;padding:6px 14px;border-radius:8px;text-decoration:none;font-weight:700;font-size:0.9rem">
              Ver detalle →
            </a>
          </div>`;
        L.marker([room.latitude, room.longitude])
          .addTo(this.map)
          .bindPopup(popup);
      });
  }

  back(): void {
    this.router.navigate(['/rooms']);
  }
}
