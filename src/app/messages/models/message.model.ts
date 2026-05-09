export interface Message {
    id: string;
    senderId: string;
    content: string;
    sentAt: string;
    isRead: boolean;
}
export interface MessagePage {
  content: Message[];
  totalElements: number;
  totalPages: number;
  number: number;
}
