import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "../../../environments/environment";
import { NotificationModel, NotificationPage } from "../models/notification.nodels";

@Injectable({
    providedIn: 'root'
})

export class NotificationService {

    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    getNotification() {
        return this.http.get<NotificationPage>(`${this.apiUrl}/api/v1/notifications`)
            .pipe(map(page => page.content));
    }
    markAsRead(id: string){
        return this.http.patch<NotificationModel>(`${this.apiUrl}/api/v1/notifications/${id}/read`, null);
    }

}