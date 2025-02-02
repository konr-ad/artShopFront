import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  filters: any = {
    paintings: []
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const type = params['type'];
      if (type) {
        this.filters.paintings = Array.isArray(type) ? type : [type];
      } else {
        this.filters.paintings = [];
      }
    });
  }

  onFiltersChange(filters: any): void {
    this.filters = filters;
    const queryParams: any = this.filters.paintings.length ? { type: this.filters.paintings } : {};
    if (this.filters.priceFrom) queryParams.priceFrom = this.filters.priceFrom;
    if (this.filters.priceTo) queryParams.priceTo = this.filters.priceTo;
    this.router.navigate(['/shop'], { queryParams });
  }
}
