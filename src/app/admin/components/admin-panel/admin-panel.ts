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
export class AdminPanel implements OnInit {

  private adminService = inject(AdminService);

  bannedWords = signal<BannedWord[]>([]);
  wordsPage = signal(0);
  wordsTotalPages = signal(1);

  review = signal<FlaggedReview[]>([]);
  reviewsPage = signal(0);
  reviewsTotalPages = signal(1);

  stats = signal<AdminStats | null>(null);
  newWord = '';
  newSureness = 1;
  activeSection = signal('dashboard');

  ngOnInit(): void {
    this.loadWords(0);
    this.loadReviews(0);
    this.adminService.getStats().subscribe({
      next: (data) => this.stats.set(data),
      error: () => {}
    });
  }

  loadWords(page: number): void {
    this.adminService.getBannedWords(page).subscribe({
      next: (data) => {
        this.bannedWords.set(data.content);
        this.wordsPage.set(data.number);
        this.wordsTotalPages.set(data.totalPages);
      },
      error: () => {}
    });
  }

  loadReviews(page: number): void {
    this.adminService.getFlaggedReviews(page).subscribe({
      next: (data) => {
        this.review.set(data.content);
        this.reviewsPage.set(data.number);
        this.reviewsTotalPages.set(data.totalPages);
      },
      error: () => {}
    });
  }

  approbedReview(id: string): void {
    this.adminService.approvedReview(id).subscribe({
      next: () => {
        this.review.update(list => list.filter(r => r.id !== id));
      }
    });
  }

  rejectReview(id: string): void {
    this.adminService.rejectReview(id).subscribe({
      next: () => {
        this.review.update(list => list.filter(r => r.id !== id));
      }
    });
  }

  deleteBannedWord(id: string): void {
    this.adminService.deleteBannedWord(id).subscribe({
      next: () => {
        this.bannedWords.update(list => list.filter(r => r.id !== id));
      }
    });
  }

  addBannedWord(): void {
    if (!this.newWord.trim()) return;
    this.adminService.addBannedWord(this.newWord.trim(), this.newSureness).subscribe({
      next: () => {
        this.newWord = '';
        this.loadWords(this.wordsPage());
      }
    });
  }
}
