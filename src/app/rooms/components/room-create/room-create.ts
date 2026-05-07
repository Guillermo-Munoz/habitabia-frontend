import { Component, AfterViewInit, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RoomService } from '../../services/room.service';
import { Router } from '@angular/router';
import { Amenity } from '../../models/room.model';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import * as L from 'leaflet';

@Component({
  selector: 'app-room-create',
  imports: [FormsModule],
  templateUrl: './room-create.html',
  styleUrl: './room-create.css',
})
export class RoomCreate implements AfterViewInit {
  private roomService = inject(RoomService);
  private router = inject(Router);
  private http = inject(HttpClient);

  private map!: L.Map;
  private marker?: L.Marker;
  private viewReady = signal(false);
  submitting = signal(false);

  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024;
  private readonly MAX_FILES = 4;
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png'];

  searchQuery = '';
  searchResults: any[] = [];
  selectedFiles: File[] = [];
  fileErrors: string[] = [];
  isDragging = false;

  formData = {
    title: '',
    description: '',
    street: '',
    city: '',
    country: '',
    latitude: 0,
    longitude: 0,
    priceAmount: 0,
    priceCurrency: '',
    maxGuests: 0,
    amenities: [] as Amenity[]
  };

  allAmenities: { value: Amenity; label: string }[] = [
    { value: 'WIFI', label: 'WiFi' },
    { value: 'WASHING_MACHINE', label: 'Lavadora' },
    { value: 'HEATING', label: 'Calefacción' },
    { value: 'AC', label: 'Aire acondicionado' },
    { value: 'SHARED_KITCHEN', label: 'Cocina compartida' },
    { value: 'PRIVATE_KITCHEN', label: 'Cocina privada' },
    { value: 'SHARED_BATHROOM', label: 'Baño compartido' },
    { value: 'PRIVATE_BATHROOM', label: 'Baño privado' },
    { value: 'STUDY_DESK', label: 'Escritorio de estudio' },
    { value: 'BIKE_PARKING', label: 'Parking de bicicletas' },
  ];

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

    this.map = L.map('create-map').setView([40.4168, -3.7038], 6);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.whenReady(() => {
      setTimeout(() => this.map.invalidateSize(), 100);
    });

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.setMarker(e.latlng.lat, e.latlng.lng);
      this.reverseGeocode(e.latlng.lat, e.latlng.lng);
    });
  }

  private setMarker(lat: number, lng: number): void {
    this.formData.latitude = lat;
    this.formData.longitude = lng;
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }
  }

  searchAddress(): void {
    if (!this.searchQuery.trim()) return;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(this.searchQuery)}&format=json&limit=5&addressdetails=1`;
    this.http.get<any[]>(url).subscribe(results => this.searchResults = results);
  }

  selectResult(result: any): void {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    this.map.flyTo([lat, lng], 15);
    this.setMarker(lat, lng);
    this.searchResults = [];
    this.searchQuery = result.display_name;

    const addr = result.address;
    if (addr) {
      const city = addr.city || addr.town || addr.village || addr.municipality || '';
      this.formData.city    = this.capitalize(city);
      this.formData.country = this.capitalize(addr.country || '');
      if (addr.road) {
        const num = addr.house_number ? ` ${addr.house_number}` : '';
        this.formData.street = addr.road + num;
      }
    }
  }

  private reverseGeocode(lat: number, lng: number): void {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
    this.http.get<any>(url).subscribe(result => {
      const addr = result.address;
      if (!addr) return;
      const city = addr.city || addr.town || addr.village || addr.municipality || '';
      this.formData.city    = this.capitalize(city);
      this.formData.country = this.capitalize(addr.country || '');
      if (addr.road) {
        const num = addr.house_number ? ` ${addr.house_number}` : '';
        this.formData.street = addr.road + num;
      }
    });
  }

  private capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  isSelected(value: Amenity): boolean {
    return this.formData.amenities.includes(value);
  }

  toggleAmenity(value: Amenity): void {
    const index = this.formData.amenities.indexOf(value);
    if (index === -1) {
      this.formData.amenities.push(value);
    } else {
      this.formData.amenities.splice(index, 1);
    }
  }

  cancel(): void {
    this.router.navigate(['/rooms']);
  }

  submit(): void {
    if (this.submitting()) return;
    this.submitting.set(true);
    this.formData.city    = this.capitalize(this.formData.city.trim());
    this.formData.country = this.capitalize(this.formData.country.trim());

    this.roomService.createRoom(this.formData).subscribe({
      next: (room) => {
        const uploads = this.selectedFiles.map(file => this.roomService.uploadImage(room.id, file));

        if (uploads.length > 0) {
          forkJoin(uploads).subscribe({
            next: () => this.router.navigate(['/rooms/' + room.id]),
            error: () => this.router.navigate(['/rooms/' + room.id])
          });
        } else {
          this.router.navigate(['/rooms/' + room.id]);
        }
      },
      error: () => this.submitting.set(false)
    });
  }

  removeFile(file: File): void {
    this.selectedFiles = this.selectedFiles.filter(f => f !== file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(_event: DragEvent): void {
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files) {
      this.processFiles(Array.from(event.dataTransfer.files));
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    this.processFiles(Array.from(input.files));
  }

  private processFiles(files: File[]): void {
    this.fileErrors = [];
    this.selectedFiles = [];

    if (files.length > this.MAX_FILES) {
      this.fileErrors.push(`Máximo ${this.MAX_FILES} imágenes. Se ignorarán las que sobran.`);
    }

    files.slice(0, this.MAX_FILES).forEach(file => {
      if (!this.ALLOWED_TYPES.includes(file.type)) {
        this.fileErrors.push(`"${file.name}" rechazado: solo se permiten JPG y PNG`);
      } else if (file.size > this.MAX_FILE_SIZE) {
        this.fileErrors.push(`"${file.name}" rechazado: supera los 5MB`);
      } else {
        this.selectedFiles.push(file);
      }
    });
  }



}
