import { inject, Injectable } from '@angular/core';
import { UserModel } from '../models/User.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private http = inject(HttpClient);

  getMe(){
    return this.http.get<UserModel>(`${environment.apiUrl}/api/v1/users/me`);
  }

  updateMe(data: {fullName: string, bio: string}) {
    return this.http.patch<UserModel>(`${environment.apiUrl}/api/v1/users/me`, data);
  }
}
