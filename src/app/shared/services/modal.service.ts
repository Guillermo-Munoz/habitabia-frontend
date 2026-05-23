import { Injectable, signal } from '@angular/core';

export interface ModalState {
  message: string;
  type: 'alert' | 'confirm';
  confirmLabel: string;
  cancelLabel: string;
  resolve: (value: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  state = signal<ModalState | null>(null);

  alert(message: string): Promise<void> {
    return new Promise(resolve => {
      this.state.set({
        message,
        type: 'alert',
        confirmLabel: 'Aceptar',
        cancelLabel: '',
        resolve: () => { this.state.set(null); resolve(); },
      });
    });
  }

  confirm(message: string, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar'): Promise<boolean> {
    return new Promise(resolve => {
      this.state.set({
        message,
        type: 'confirm',
        confirmLabel,
        cancelLabel,
        resolve: (value) => { this.state.set(null); resolve(value); },
      });
    });
  }
}
