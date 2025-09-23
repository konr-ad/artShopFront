import { Component, HostListener } from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-exhibitions',
  standalone: true,
  imports: [NgClass, TranslatePipe, NgForOf],
  templateUrl: './exhibitions.component.html',
  styleUrl: './exhibitions.component.css',
})
export class ExhibitionsComponent {
  lightboxOpen = false;
  lightboxImage?: string;
  currentImageIndex = 0;

  images: string[] = [
    '/assets/exhibitions/Wystawa1.jpg',
    '/assets/exhibitions/Wystawa2.jpg',
    '/assets/exhibitions/Wystawa3.jpg',
    '/assets/exhibitions/Wystawa4.jpg',
    '/assets/exhibitions/Wystawa5.jpg',
    '/assets/exhibitions/Wystawa6.jpg',
    '/assets/exhibitions/Wystawa7.jpg',
    '/assets/exhibitions/Wystawa8.jpg',
  ];

  onImgError(i: number) {
    console.warn('Brak pliku obrazu:', this.images[i]);
  }

  openLightbox(index: number) {
    this.currentImageIndex = index;
    this.lightboxImage = this.images[index];
    this.lightboxOpen = true;
  }
  closeLightbox() { this.lightboxOpen = false; }

  prevImage() {
    if (!this.lightboxOpen) return;
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    this.lightboxImage = this.images[this.currentImageIndex];
  }
  nextImage() {
    if (!this.lightboxOpen) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    this.lightboxImage = this.images[this.currentImageIndex];
  }

  // UX: ESC/←/→
  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (!this.lightboxOpen) return;
    if (e.key === 'Escape') this.closeLightbox();
    if (e.key === 'ArrowLeft') this.prevImage();
    if (e.key === 'ArrowRight') this.nextImage();
  }
}
