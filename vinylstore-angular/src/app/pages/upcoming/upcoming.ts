import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-upcoming',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './upcoming.html',
  styleUrl: './upcoming.css',
})
export class Upcoming implements OnInit {
  private http = inject(HttpClient);
  releases = signal<any[]>([]);

ngOnInit() {
  this.http.get<any>('https://ianhazecure.github.io/vinyl-api/upcoming.json')
    .subscribe(data => {
      this.releases.set(data.upcoming);
    });
}
}