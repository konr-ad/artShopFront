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
        this.filters.paintings = [type];
      } else {
        this.filters.paintings = [];
      }
    });
  }

  onFiltersChange(filters: any): void {
    this.filters = filters;
    const queryParams = this.filters.paintings.length ? { type: this.filters.paintings[0] } : {};
    this.router.navigate(['/shop'], { queryParams });
  }
}
