import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  MediaFileDto,
  PaintingDetailsDto,
  PaintingService, PaintingType
} from 'src/app/services/painting.service';
import { CartService } from 'src/app/services/cart.service';
import {LanguageService} from "../../../services/language.service";

@Component({
  selector: 'app-painting-detail',
  templateUrl: './painting-detail.component.html',
  styleUrls: ['./painting-detail.component.css'],
})
export class PaintingDetailComponent implements OnInit {
  @ViewChild('mainImg') mainImgRef!: ElementRef<HTMLImageElement>;
  @ViewChild('imgWrap') imgWrapRef!: ElementRef<HTMLDivElement>;
  details: PaintingDetailsDto | null = null;
  added: boolean = false;
  isLocked = false;
  canAddMore = true;

  // stan galerii
  thumbUrls: string[] = [];
  selectedIndex = 0;
  selectedImgUrl: string | null = null;

  // UI
  isButtonDisabled = false;
  isExpanded = false;

  lightboxOpen = false;

  fillMode: 'object-contain' | 'object-cover' = 'object-contain';
  private naturalW = 0;
  private naturalH = 0

  constructor(
    private route: ActivatedRoute,
    private paintingService: PaintingService,
    private cartService: CartService,
    private lang: LanguageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.paintingService.details(id).subscribe(dto => {
        this.details = dto;
        this.isLocked = dto.state !== 'AVAILABLE';
        console.log('this.isLocked',this.isLocked)
        this.buildGallery(dto);
        this.recomputeAddState();
      });
    });

    // nasłuchuj zmian koszyka, aby dynamicznie blokować/przywracać przycisk
    this.cartService.getItems().subscribe(() => this.recomputeAddState());
  }

  addToCart(): void {
    if (!this.details) return;

    const type = this.details.type as PaintingType;
    if (!this.cartService.canAddMore(this.details.id, type)) {
      // już w koszyku i typ pojedynczy – nic nie rób
      this.added = true;
      this.isButtonDisabled = true;
      return;
    }

    const primaryUrl = this.details.media?.find(m => m.isPrimary)?.url
      ?? this.details.media?.[0]?.url ?? null;
    const full = this.paintingService.fullUrl(primaryUrl);

    this.cartService.addItem({
      id: this.details.id,
      name: this.details.name,
      price: this.details.price,
      imageUrl: full || undefined,
      type
    });

    // feedback UI
    this.added = true;

    // dla typów pojedynczych – zostaw przycisk trwale zablokowany
    if (type !== 'PRINT' && type !== 'DIGITAL') {
      this.isButtonDisabled = true;
      return;
    }

    this.isButtonDisabled = true;
    setTimeout(() => {
      this.added = false;
      this.isButtonDisabled = false;
    }, 2000);
  }

  private recomputeAddState() {
    if (!this.details) { this.canAddMore = false; return; }
    const type = this.details.type as PaintingType;
    this.canAddMore = this.cartService.canAddMore(this.details.id, type);
    this.isButtonDisabled = !this.canAddMore;
    this.added = !this.canAddMore;
  }

  onMainImgLoad(e: Event) {
    this.fillMode = 'object-contain';
  }

  @HostListener('window:resize')
  onResize() {
    this.computeFillMode();
  }

  private computeFillMode() {
    this.fillMode = 'object-contain';
  }

  get description(): string {
    const pl = this.details?.descriptionPl ?? '';
    const en = this.details?.descriptionEn ?? '';

    if (this.lang.currentLang === 'pl') return pl || en;
    return en || pl;
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

  toggleList() { this.isExpanded = !this.isExpanded; }

  trackByIndex = (i: number) => i;

  openLightbox() { if (this.thumbUrls.length) this.lightboxOpen = true; }
  closeLightbox() { this.lightboxOpen = false; }

  // Nawigacja w obrębie listy obrazów
  nextImage() {
    if (!this.thumbUrls.length) return;
    this.selectedIndex = (this.selectedIndex + 1) % this.thumbUrls.length;
    this.selectedImgUrl = this.thumbUrls[this.selectedIndex];
  }
  prevImage() {
    if (!this.thumbUrls.length) return;
    this.selectedIndex = (this.selectedIndex - 1 + this.thumbUrls.length) % this.thumbUrls.length;
    this.selectedImgUrl = this.thumbUrls[this.selectedIndex];
  }

  // Klawiatura: Esc zamyka, strzałki nawigują
  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    if (!this.lightboxOpen) return;
    if (e.key === 'Escape') this.closeLightbox();
    if (e.key === 'ArrowRight') this.nextImage();
    if (e.key === 'ArrowLeft') this.prevImage();
  }

}
