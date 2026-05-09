import { Component, inject, OnInit, signal } from '@angular/core';
import { MessageServices } from '../../services/message.services';
import { ActivatedRoute } from '@angular/router';
import { Message } from '../../models/message.model';

@Component({
  selector: 'app-message-view',
  imports: [],
  templateUrl: './message-view.html',
  styleUrl: './message-view.css',
})
export class MessageView implements OnInit{
  private messageService = inject(MessageServices);
  private route = inject(ActivatedRoute);
  messages = signal<Message[]>([]);
  newMessage = '';
  private bookingId = this.route.snapshot.paramMap.get('bookingId');

  ngOnInit(): void {
    this.messageService.getMessages(this.bookingId!).subscribe({
      next: (data) => this.messages.set(data),
      error: () => {}
    });
  }
  sendMessage(): void{
    this.messageService.sendMessage(this.bookingId!, this.newMessage).subscribe({
      next: (data) => {this.messages.update(list => [...list, data]);
      this.newMessage = '';
      },
      error: () => {}
    });
  }


}
