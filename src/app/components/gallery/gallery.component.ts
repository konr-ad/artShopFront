import { Component, OnInit } from '@angular/core';
import { Painting, PaintingService } from '../../services/painting.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {
  lightboxOpen = false;
  lightboxImage: string | null = null;

  constructor(private paintingService: PaintingService) {}

  openLightbox(imageUrl: string | undefined): void {
    if (imageUrl) {
      this.lightboxImage = imageUrl;
      this.lightboxOpen = true;
    } else {
      console.error('Image URL is undefined');
    }
  }

  closeLightbox() {
    this.lightboxOpen = false;
    this.lightboxImage = null;
  }
}
