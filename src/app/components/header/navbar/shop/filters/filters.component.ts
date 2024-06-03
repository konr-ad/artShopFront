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
    paintings: []
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const type = params['type'];
      if (type) {
        this.filters.paintings = [type];
      } else {
        this.filters.paintings = [];
      }
      this.filtersChange.emit(this.filters);
    });
  }

  onFilterChange(filterType: string, filterValue: string, event: any): void {
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
    this.filtersChange.emit({ ...this.filters });
  }

  isChecked(filterType: string, filterValue: string): boolean {
    return this.filters[filterType].includes(filterValue);
  }
}
