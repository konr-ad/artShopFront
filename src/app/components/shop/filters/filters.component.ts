import { Component, EventEmitter, Output, OnInit, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
})
export class FiltersComponent implements OnInit, OnDestroy {
  @Output() filtersChange = new EventEmitter<any>();
  filters: any = { paintings: [], priceFrom: null, priceTo: null };
  paintingTypeDropdownOpen = false;
  priceDropdownOpen = false;

  private hoverCloseTimer?: any;

  constructor(private route: ActivatedRoute, private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const type = params['type'];
      const priceFrom = params['priceFrom'];
      const priceTo = params['priceTo'];

      this.filters.paintings = type ? (Array.isArray(type) ? type : [type]) : [];
      this.filters.priceFrom = priceFrom ? +priceFrom : null;
      this.filters.priceTo   = priceTo ? +priceTo   : null;
      this.applyFilters();
    });
  }

  ngOnDestroy(): void {
    if (this.hoverCloseTimer) clearTimeout(this.hoverCloseTimer);
  }

  // --- outside click / Esc
  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    if (!this.el.nativeElement.contains(ev.target as Node)) this.closeAll();
  }

  @HostListener('document:keydown.escape')
  onEsc() { this.closeAll(); }

  private closeAll() {
    this.paintingTypeDropdownOpen = false;
    this.priceDropdownOpen = false;
  }

  // --- hover leave/enter (zamykanie po wyjechaniu myszą)
  onDropdownEnter() {
    if (this.hoverCloseTimer) {
      clearTimeout(this.hoverCloseTimer);
      this.hoverCloseTimer = undefined;
    }
  }

  onDropdownLeave() {
    this.hoverCloseTimer = setTimeout(() => this.closeAll(), 180);
  }

  // --- Twoje istniejące metody
  togglePaintingTypeDropdown() { this.paintingTypeDropdownOpen = !this.paintingTypeDropdownOpen; }
  togglePriceDropdown() { this.priceDropdownOpen = !this.priceDropdownOpen; }

  onFilterChange(filterType: string, event: any): void {
    const filterValue = event.target.value;
    if (filterType === 'priceFrom' || filterType === 'priceTo') {
      this.filters[filterType] = filterValue ? +filterValue : null;
    } else {
      if (event.target.checked) {
        if (!this.filters[filterType].includes(filterValue)) this.filters[filterType].push(filterValue);
      } else {
        const i = this.filters[filterType].indexOf(filterValue);
        if (i > -1) this.filters[filterType].splice(i, 1);
      }
    }
    this.applyFilters();
  }

  isChecked(filterType: string, filterValue: string): boolean {
    return this.filters[filterType].includes(filterValue);
  }

  applyFilters(): void { this.filtersChange.emit({ ...this.filters }); }

  resetFilters(): void {
    this.filters = { paintings: [], priceFrom: null, priceTo: null };
    this.applyFilters();
  }

  onInputChange(filterType: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.onFilterChange(filterType, { target: input });
  }
}
