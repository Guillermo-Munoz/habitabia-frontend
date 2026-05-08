import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'bookingStatus', standalone: true })
export class StatePiped implements PipeTransform {
  transform(value: string): string {
   
    const map: Record<string, string> = {
        REQUESTED: 'Pendiente',
        ACCEPTED:  'Aceptada',
        CANCELLED: 'Cancelada',
        COMPLETED:  'Completada',
        REJECTED:  'Rechazada' 
        };
    return map[value] ?? value;

  }
}

