import { Component, inject, OnInit, signal } from '@angular/core';
import { UserModel } from '../../models/User.model';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile.component',
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit{

  public isEditMode = signal(false);
  private userService = inject(UserService);
  user = signal<UserModel | null>(null);
  editFormData = {fullName : '', bio: ''};

  ngOnInit(): void {
    this.userService.getMe()
      .subscribe({
    next: (data) => {
      this.user.set(data)
      this.editFormData = {
        fullName: data.fullName,
        bio: data.bio ?? '',
      };

    }
  });
  
  }
  toggleEdit() {
    this.isEditMode.set(!this.isEditMode());
  }

  saveProfile() {
  this.userService.updateMe(this.editFormData).subscribe({
    next: (data) => {
      this.user.set(data);
      this.toggleEdit();
    }
  });
}


}
