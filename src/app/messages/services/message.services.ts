import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Message, MessagePage } from "../models/message.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";



@Injectable({
    providedIn: 'root',
})


export class MessageServices{
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;
   
 getMessages(bookingId: string): Observable<Message[]>{
    return this.http.get<MessagePage>(`${this.apiUrl}/api/v1/conversations/${bookingId}/messages?page=0&size=50`)
      .pipe(map(page => page.content));
 }

 sendMessage(bookingId: string, content: string): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/api/v1/conversations/${bookingId}/messages`, {content});
 }




}