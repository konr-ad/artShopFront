import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Painting,                 // legacy typ dla koszyka
  PaintingDetailsDto,
  PaintingService
} from 'src/app/services/painting.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-painting-detail',
  templateUrl: './painting-detail.component.html',
  styleUrls: ['./painting-detail.component.css'],
})
export class PaintingDetailComponent implements OnInit {
  // do koszyka używamy legacy kształtu
  painting?: Painting;

  // galeria
  mediaUrls: string[] = [];
  selectedIndex = 0;

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
    this.route.params.subscribe(p => {
      const id = +p['id'];
      if (!Number.isFinite(id)) return;

      this.paintingService.details(id).subscribe((dto: PaintingDetailsDto) => {
        // zbuduj listę URL-i do galerii
        const urls = (dto.media ?? []).map(m => this.paintingService.fullUrl(m.url)).filter(Boolean) as string[];
        this.mediaUrls = urls;

        // wybierz primary -> jeśli brak, to 0
        const primaryIdx = (dto.media ?? []).findIndex(m => m.isPrimary);
        this.selectedIndex = primaryIdx >= 0 ? primaryIdx : 0;

        // legacy „Painting” na potrzeby koszyka
        this.painting = {
          id: dto.id,
          name: dto.name,
          type: dto.type,
          state: dto.state ?? null,
          price: Number(dto.price),
          description: dto.description ?? null,
          image: '', // dawniej base64 – już nie używamy
          imageUrl: this.mediaUrls[this.selectedIndex] ?? undefined,
        };
      });
    });
  }

  select(i: number) {
    this.selectedIndex = i;
    if (this.painting) {
      this.painting.imageUrl = this.mediaUrls[i]; // aktualizuj miniaturę używaną w koszyku
    }
  }

  addToCart(): void {
    if (!this.painting) return;
    this.cartService.addItem(this.painting);
    this.buttonText = 'Added!';
    this.isButtonDisabled = true;
    setTimeout(() => {
      this.buttonText = 'Add to Cart';
      this.isButtonDisabled = false;
    }, 2000);
  }

  toggleList() { this.isExpanded = !this.isExpanded; }
}
