import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent {
  @Output() filtersChange = new EventEmitter<any>();
  filters: any = {
    paintings: []
  };

  onFilterChange(filterType: string, filterValue: string, event: any): void {
    if (event.target.checked) {
      this.filters[filterType].push(filterValue);
    } else {
      const index = this.filters[filterType].indexOf(filterValue);
      if (index > -1) {
        this.filters[filterType].splice(index, 1);
      }
    }
    this.filtersChange.emit(this.filters);
  }
}
