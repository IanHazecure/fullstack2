import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../components/header/header';
import { PreordersJsonServerService, Preorder } from '../../services/preorders-json-server';
import { resolveCoverUrl } from '../../utils/cover-url';

@Component({
  selector: 'app-upcoming',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './upcoming.html',
  styleUrl: './upcoming.css',
})
export class Upcoming implements OnInit {
  private service = inject(PreordersJsonServerService);
  releases = signal<Preorder[]>([]);

  ngOnInit() {
    this.service.getAll().subscribe({
      next: data => this.releases.set(data),
      error: () => this.releases.set([])
    });
  }

  coverUrl(cover: string | undefined | null): string {
    return resolveCoverUrl(cover);
  }
}