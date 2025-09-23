// product-list.component.ts
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { PaintingService, PaintingListItem, Page } from 'src/app/services/painting.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, OnChanges {
  @Input() filters: any;

  pageData?: Page<PaintingListItem>;
  items: Array<PaintingListItem & { imageUrl?: string }> = [];
  loading = false;

  // paging
  page = 0;
  size = 9; // 9 = 3x3 w gridzie; zmień wg uznania
  sort = 'createdAt,desc';

  constructor(
    private paintingService: PaintingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchPage(0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters'] && !changes['filters'].firstChange) {
      this.fetchPage(0);
    }
  }

  fetchPage(p: number): void {
    this.loading = true;
    this.page = p;

    // Backend przyjmuje JEDEN type (EPaintingType). UI pozwala zaznaczyć wiele,
    // więc tu bierzemy pierwszy wybrany, a jak jest >1 – nie wysyłamy type (pokaż wszystko).
    const types: string[] = this.filters?.paintings || [];
    const type = types.length === 1 ? types[0] : undefined;

    const minPrice = this.filters?.priceFrom ?? undefined;
    const maxPrice = this.filters?.priceTo ?? undefined;

    this.paintingService.getPaintingsPage({
      page: this.page,
      size: this.size,
      sort: this.sort,
      type,
      minPrice,
      maxPrice
    }).subscribe({
      next: (pg) => {
        this.pageData = pg;
        // zmapuj url miniatury
        this.items = pg.content.map(it => ({
          ...it,
          imageUrl: this.paintingService.imageUrl(it.thumbnailUrl || '')
        }));
        this.loading = false;
      },
      error: () => {
        this.items = [];
        this.loading = false;
      }
    });
  }

  prev() {
    if (!this.pageData || this.pageData.first) return;
    this.fetchPage(this.page - 1);
  }
  next() {
    if (!this.pageData || this.pageData.last) return;
    this.fetchPage(this.page + 1);
  }

  viewPainting(id: number): void {
    this.router.navigate(['/painting', id]);
  }
}
