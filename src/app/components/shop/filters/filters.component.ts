import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  @Output() filtersChange = new EventEmitter<any>();
  filters: any = {
    paintings: [],
    priceFrom: null,
    priceTo: null
  };
  paintingTypeDropdownOpen: boolean = false;
  priceDropdownOpen: boolean = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const type = params['type'];
      const priceFrom = params['priceFrom'];
      const priceTo = params['priceTo'];

      if (type) {
        this.filters.paintings = Array.isArray(type) ? type : [type];
      } else {
        this.filters.paintings = [];
      }

      this.filters.priceFrom = priceFrom ? +priceFrom : null;
      this.filters.priceTo = priceTo ? +priceTo : null;
      this.applyFilters();
    });
  }

  togglePaintingTypeDropdown(): void {
    this.paintingTypeDropdownOpen = !this.paintingTypeDropdownOpen;
  }

  togglePriceDropdown(): void {  // Method to toggle price dropdown
    this.priceDropdownOpen = !this.priceDropdownOpen;
  }

  onFilterChange(filterType: string, event: any): void {
    const filterValue = event.target.value;
    if (filterType === 'priceFrom' || filterType === 'priceTo') {
      this.filters[filterType] = filterValue ? +filterValue : null;
    } else {
      if (event.target.checked) {
        if (!this.filters[filterType].includes(filterValue)) {
          this.filters[filterType].push(filterValue);
        }
      } else {
        const index = this.filters[filterType].indexOf(filterValue);
        if (index > -1) {
          this.filters[filterType].splice(index, 1);
        }
      }
    }
    this.applyFilters();
  }

  isChecked(filterType: string, filterValue: string): boolean {
    return this.filters[filterType].includes(filterValue);
  }

  applyFilters(): void {
    this.filtersChange.emit({ ...this.filters });
  }

  resetFilters(): void {
    this.filters = {
      paintings: [],
      priceFrom: null,
      priceTo: null
    };
    this.filtersChange.emit({ ...this.filters });
  }

  onInputChange(filterType: string, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.onFilterChange(filterType, { target: inputElement });
  }
}
