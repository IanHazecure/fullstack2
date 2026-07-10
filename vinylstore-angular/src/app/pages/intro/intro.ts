import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Header } from '../../components/header/header';
import { PurchasesService } from '../../services/purchases';
import { resolveCoverUrl } from '../../utils/cover-url';
@Component({
  selector: 'app-intro',
  imports: [CommonModule, Header, RouterLink],
  templateUrl: './intro.html',
  styleUrl: './intro.css',
})
export class Intro implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private purchasesService = inject(PurchasesService);
  slides = [
    '/covers/pornography.jpg',
    '/covers/luis-miguel-20-anos.jpg',
    '/covers/flatfield.jpg',
    '/covers/Misfits.jpg',
    '/covers/kissme.jpg',
    '/covers/korn.jpg',
    '/covers/metallica.jpg',
    '/covers/ser-humano.jpg',
    '/covers/thriller.png',
    '/covers/antitodo.jpg',
  ];

  
  currentSlide = signal(0);
  top3 = signal<any[]>([]);
  private interval: any;

  ngOnInit() {
    this.interval = setInterval(() => {
      this.currentSlide.update(i => (i + 1) % this.slides.length);
    }, 3000);

    this.loadTop3();
  }

  loadTop3() {
    const top = this.purchasesService.getTop3();
    if (top.length === 0) return;

    this.http.get<any>('/vinyls.json').subscribe(data => {
      const all = [
        ...data.rock, ...data.pop, ...data.jazz,
        ...data.punk, ...(data.rap || []), ...(data.latina || [])
      ];
      const result = top.map(p => {
        const vinyl = all.find((v: any) => v.id === p.id);
        return vinyl ? { ...vinyl, unitsSold: p.quantity } : null;
      }).filter(Boolean);
      this.top3.set(result);
    });
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  formatPrice(price: number) {
    return price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  }

  coverUrl(cover: string | undefined | null): string {
    return resolveCoverUrl(cover);
  }
}