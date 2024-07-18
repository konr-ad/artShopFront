import { Component } from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent {
  lightboxOpen = false;
  lightboxImage: string | null = null;

  openLightbox(src: string) {
    this.lightboxImage = src;
    this.lightboxOpen = true;
  }

  closeLightbox() {
    this.lightboxOpen = false;
    this.lightboxImage = null;
  }
}
