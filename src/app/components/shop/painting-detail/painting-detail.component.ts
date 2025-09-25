import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  MediaFileDto,
  PaintingDetailsDto,
  PaintingService, PaintingType
} from 'src/app/services/painting.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-painting-detail',
  templateUrl: './painting-detail.component.html',
  styleUrls: ['./painting-detail.component.css'],
})
export class PaintingDetailComponent implements OnInit {
  details: PaintingDetailsDto | null = null;

  // stan galerii
  thumbUrls: string[] = [];
  selectedIndex = 0;
  selectedImgUrl: string | null = null;

  // UI
  buttonText = 'Add to Cart';
  isButtonDisabled = false;
  isExpanded = false;

  constructor(
    private route: ActivatedRoute,
    private paintingService: PaintingService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.paintingService.details(id).subscribe(dto => {
        this.details = dto;
        this.buildGallery(dto);
      });
    });
  }

  private buildGallery(dto: PaintingDetailsDto) {
    const media = (dto.media ?? [])
      .slice()
      .sort((a, b) =>
        Number(b.isPrimary) - Number(a.isPrimary) ||
        (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
      );

    this.thumbUrls = media
      .map(m => this.paintingService.fullUrl(m.url))
      .filter((u): u is string => !!u);

    this.selectedIndex = 0;
    this.selectedImgUrl = this.thumbUrls[0] ?? null;
  }

  selectThumb(i: number) {
    this.selectedIndex = i;
    this.selectedImgUrl = this.thumbUrls[i] ?? null;
  }

  addToCart(): void {
    if (!this.details) return;

    // spróbuj wziąć primary → pierwszy
    const primaryUrl = this.details.media?.find((m: MediaFileDto) => m.isPrimary)?.url
      ?? this.details.media?.[0]?.url
      ?? null;

    const full = this.paintingService.fullUrl(primaryUrl);

    this.cartService.addItem({
      id: this.details.id,
      name: this.details.name,
      price: this.details.price,
      imageUrl: full || undefined,
      type: this.details.type as PaintingType
    });

    this.buttonText = 'Added!';
    this.isButtonDisabled = true;
    setTimeout(() => {
      this.buttonText = 'Add to Cart';
      this.isButtonDisabled = false;
    }, 2000);
  }

  toggleList() { this.isExpanded = !this.isExpanded; }

  trackByIndex = (i: number) => i;
}
