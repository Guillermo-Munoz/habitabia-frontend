import { Component, inject } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  protected readonly modal = inject(ModalService);

  dismiss(): void {
    this.modal.state()?.resolve(false);
  }

  ok(): void {
    this.modal.state()?.resolve(true);
  }
}
