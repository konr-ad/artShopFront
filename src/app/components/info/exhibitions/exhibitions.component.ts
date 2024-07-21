import { Component } from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-exhibitions',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './exhibitions.component.html',
  styleUrl: './exhibitions.component.css'
})
export class ExhibitionsComponent {
  lightboxOpen = false;
  lightboxImage: string | undefined;
  currentImageIndex: number = 0;
  images: string[] = [
    'assets/exhibitions/Wystawa1.jpg',
    'assets/exhibitions/Wystawa2.jpg',
    'assets/exhibitions/Wystawa3.jpg',
    'assets/exhibitions/Wystawa4.jpg',
    'assets/exhibitions/Wystawa5.jpg',
    'assets/exhibitions/Wystawa6.jpg',
    'assets/exhibitions/Wystawa7.jpg',
    'assets/exhibitions/Wystawa8.jpg'
  ];

  openLightbox(index: number): void {
    this.currentImageIndex = index;
    this.lightboxImage = this.images[index];
    this.lightboxOpen = true;
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
  }

  prevImage(): void {
    this.currentImageIndex = (this.currentImageIndex === 0) ? this.images.length - 1 : this.currentImageIndex - 1;
    this.lightboxImage = this.images[this.currentImageIndex];
  }

  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex === this.images.length - 1) ? 0 : this.currentImageIndex + 1;
    this.lightboxImage = this.images[this.currentImageIndex];
  }
}
