import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AdminStats, BannedWord, FlaggedReview } from '../../models/admin.models';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-panel',
  imports: [FormsModule, DatePipe],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel implements OnInit{

  private adminService = inject(AdminService);
  bannedWords = signal<BannedWord[]>([]);
  review = signal<FlaggedReview[]>([]);
  stats = signal<AdminStats | null>(null);
  newWord = '';
  newSureness = 1;
  activeSection = signal('dashboard');

  ngOnInit(): void {
    this.adminService.getBannedWords().subscribe({
      next: (data) => this.bannedWords.set(data),
      error: () => {}
    });
    this.adminService.getFlaggedReviews().subscribe({
      next: (data) => this.review.set(data),
      error: () => {}
    });
    this.adminService.getStats().subscribe({
      next: (data) => this.stats.set(data),
      error: () => {}
    });
  }
  approbedReview(id: string){
    this.adminService.approvedReview(id).subscribe({
      next: () => {
        this.review.update(list => list.filter(r => r.id !== id));
      }
    })
  }
  rejectReview(id: string){
    this.adminService.rejectReview(id).subscribe({
      next: () => {
        this.review.update(list => list.filter(r => r.id !== id));
      }
    })
  }
  deleteBannedWord(id: string){
   this.adminService.deleteBannedWord(id).subscribe({
      next: () => {
        this.bannedWords.update(list => list.filter(r => r.id !== id));
      }
    })
  }
  addBannedWord(){
    this.adminService.addBannedWord(this.newWord, this.newSureness ).subscribe({
      next: (data) => {
        this.bannedWords.update(list => [...list, data]);
        this.newWord = '';
      }
    })
    }
  }

