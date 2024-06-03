import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Painting, PaintingService } from 'src/app/services/painting.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnChanges {
  @Input() filters: any;
  paintings: Painting[] = [];
  filteredPaintings: Painting[] = [];

  constructor(private paintingService: PaintingService, private router: Router) { }

  ngOnInit(): void {
    this.fetchPaintings();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']) {
      this.applyFilters();
    }
  }

  fetchPaintings(): void {
    this.paintingService.getPaintings().subscribe((data: Painting[]) => {
      this.paintings = data.map(painting => ({
        ...painting,
        imageUrl: 'data:image/jpeg;base64,' + painting.image
      }));
      this.applyFilters();
    });
  }

  applyFilters(): void {
    if (!this.filters || !this.filters.paintings.length) {
      this.filteredPaintings = this.paintings;
    } else {
      this.filteredPaintings = this.paintings.filter(painting =>
        this.filters.paintings.includes(painting.type)
      );
    }
  }

  viewPainting(id: number | undefined): void {
    if (id !== undefined) {
      this.router.navigate(['/painting', id]);
    }
  }
}
