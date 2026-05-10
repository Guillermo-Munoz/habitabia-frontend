import { Component, ElementRef, inject, OnInit, signal, ViewChild, AfterViewChecked } from '@angular/core';
import { MessageServices } from '../../services/message.services';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Message } from '../../models/message.model';
import { UserService } from '../../../users/services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message-view',
  imports: [FormsModule, RouterLink],
  templateUrl: './message-view.html',
  styleUrl: './message-view.css',
})
export class MessageView implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  private messageService = inject(MessageServices);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  newMessage = '';
  messages = signal<Message[]>([]);
  currentUserId = signal<string | null>(null);
  private bookingId = this.route.snapshot.paramMap.get('bookingId');

  ngOnInit(): void {
    this.messageService.getMessages(this.bookingId!).subscribe({
      next: (data) => {
        this.messages.set(data);
        setTimeout(() => this.scrollToBottom(), 0);
      },
      error: () => {}
    });
    this.userService.getMe().subscribe({
      next: (user) => this.currentUserId.set(user.id),
      error: () => {}
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch {}
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;
    this.messageService.sendMessage(this.bookingId!, this.newMessage).subscribe({
      next: (data) => {
        this.messages.update(list => [...list, data]);
        this.newMessage = '';
      },
      error: (err) => {
        if (err.status === 409) alert('Mensaje bloqueado: contiene lenguaje inapropiado.');
        else alert('No se pudo enviar el mensaje.');
        this.newMessage = '';
      }
    });
  }
}
