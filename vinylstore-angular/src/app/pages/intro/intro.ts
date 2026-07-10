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
  slides = signal<string[]>([]);//no hard code lol
    // '/covers/pornography.jpg',
    // '/covers/luis-miguel-20-anos.jpg',
    // '/covers/flatfield.jpg',
    // '/covers/Misfits.jpg',
    // '/covers/kissme.jpg',
    // '/covers/korn.jpg',
    // '/covers/metallica.jpg',
    // '/covers/ser-humano.jpg',
    // '/covers/thriller.png',
    // '/covers/antitodo.jpg',

shuffle(arr: string[]): string[] {
  return arr.sort(() => Math.random() - 0.5);
}
  
  currentSlide = signal(0);
  top3 = signal<any[]>([]);
  private interval: any;

  // ngOnInit() {
  //   this.interval = setInterval(() => {
  //     this.currentSlide.update(i => (i + 1) % this.slides.length);
  //   }, 3000);

  //   this.loadTop3();
  // }

  ngOnInit() {
  this.http.get<any[]>('http://localhost:3000/products').subscribe(data => {
    const covers = this.shuffle(data.map((p: any) => p.cover).filter(Boolean));
    this.slides.set(covers);


    this.interval = setInterval(() => {
      this.currentSlide.update(i => (i + 1) % this.slides().length);
    }, 3000);
  });

  this.loadTop3();
}

  loadTop3() {
  const top = this.purchasesService.getTop3(); //lee de db.json 
  if (top.length === 0) return;

  this.http.get<any[]>('http://localhost:3000/products').subscribe(data => {
    const result = top.map(p => {
      const vinyl = data.find((v: any) => v.id === p.id);
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