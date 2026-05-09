import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Message } from "../models/message.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";



@Injectable({
    providedIn: 'root',
})


export class MessageServices{
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;
   
 getMessages(bookingId: string): Observable<Message[]>{
    return this.http.get<Message[]>(`${this.apiUrl}/api/v1/conversations/${bookingId}/messages`)
 }

 sendMessage(bookingId: string, content: string): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/api/v1/conversations/${bookingId}/messages`, {content});
 }




}