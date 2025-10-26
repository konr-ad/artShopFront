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

  // stan galerii
  thumbUrls: string[] = [];
  selectedIndex = 0;
  selectedImgUrl: string | null = null;

  // UI
  isButtonDisabled = false;
  isExpanded = false;

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
        this.buildGallery(dto);
      });
    });
  }

  onMainImgLoad(e: Event) {
    const img = e.target as HTMLImageElement;
    this.naturalW = img.naturalWidth || 0;
    this.naturalH = img.naturalHeight || 0;
    this.computeFillMode();
  }

  @HostListener('window:resize')
  onResize() {
    this.computeFillMode();
  }

  private computeFillMode() {
    const wrap = this.imgWrapRef?.nativeElement;
    if (!wrap || !this.naturalW || !this.naturalH) return;

    const r = wrap.getBoundingClientRect();
    const imgRatio = this.naturalW / this.naturalH;
    const boxRatio = r.width / Math.min(r.height, 600); // bo masz max-h:600px

    // Jeśli obraz jest „węższy” niż ramka → użyj cover, żeby nie było pasów
    this.fillMode = imgRatio < boxRatio ? 'object-cover' : 'object-contain';
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

    this.added = true;
    this.isButtonDisabled = true;

    setTimeout(() => {
      this.added = false;
      this.isButtonDisabled = false;
    }, 2000);
  }

  toggleList() { this.isExpanded = !this.isExpanded; }

  trackByIndex = (i: number) => i;
}
