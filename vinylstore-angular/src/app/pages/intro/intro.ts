import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../components/header/header';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-intro',
  imports: [CommonModule, Header, RouterLink],
  templateUrl: './intro.html',
  styleUrl: './intro.css',
})
export class Intro implements OnInit, OnDestroy {
  slides = [
    '/covers/pornography.jpg',
    '/covers/KindofBlue.jpg',
    '/covers/flatfield.jpg',
    '/covers/Misfits.jpg',
    '/covers/kissme.jpg',
  ];

  currentSlide = signal(0);
  private interval: any;

  ngOnInit() {
    this.interval = setInterval(() => {
      this.currentSlide.update(i => (i + 1) % this.slides.length);
    }, 3000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}