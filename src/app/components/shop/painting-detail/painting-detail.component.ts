import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaintingDetailsDto, PaintingService } from 'src/app/services/painting.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-painting-detail',
  templateUrl: './painting-detail.component.html',
  styleUrls: ['./painting-detail.component.css'],
})
export class PaintingDetailComponent implements OnInit {
  painting?: PaintingDetailsDto;

  // UI-only state
  heroUrl: string | null = null;
  thumbUrls: string[] = [];
  selectedIndex = 0;
  selectedImgUrl?: string;

  buttonText = 'Add to Cart';
  isButtonDisabled = false;
  isExpanded = false;

  constructor(
    private route: ActivatedRoute,
    private paintingService: PaintingService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(({ id }) => this.loadPainting(+id));
  }

  private loadPainting(id: number) {
    this.paintingService.details(id).subscribe(dto => {
      this.painting = dto;

      const sorted = (dto.media ?? [])
        .sort((a, b) => (Number(b.isPrimary) - Number(a.isPrimary)) || (a.sortOrder - b.sortOrder));

      this.thumbUrls = sorted
        .map(m => this.paintingService.fullUrl(m.url)!)
        .filter(Boolean);

      this.selectedIndex = 0;
      this.heroUrl = this.thumbUrls[0] ?? null;
      this.selectedImgUrl = this.heroUrl ?? undefined;
    });
  }

  selectThumb(i: number) {
    this.selectedIndex = i;
    this.selectedImgUrl = this.thumbUrls[i];
  }

  addToCart(): void {
    if (!this.painting) return;

    // Dopasuj do modelu koszyka – tu przykład minimalny
    this.cartService.addItem({
      id: this.painting.id,
      name: this.painting.name,
      price: Number(this.painting.price),
      imageUrl: this.selectedImgUrl || this.heroUrl || undefined,
      quantity: 1,
    } as any);

    this.buttonText = 'Added!';
    this.isButtonDisabled = true;
    setTimeout(() => {
      this.buttonText = 'Add to Cart';
      this.isButtonDisabled = false;
    }, 1500);
  }

  toggleList() { this.isExpanded = !this.isExpanded; }

  trackByIndex = (_: number, __: unknown) => _;
}
