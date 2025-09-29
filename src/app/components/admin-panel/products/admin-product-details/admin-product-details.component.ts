import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-product-details',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './admin-product-details.component.html',
  styleUrls: ['./admin-product-details.component.css'],
})
export class AdminProductDetailsComponent implements OnChanges {
  @Input() product: any;
  @Output() edit = new EventEmitter<number>();
  imageSrc = 'assets/placeholder.png';
  constructor(private router: Router) {}
  ngOnChanges(): void {
    const p = this.product;
    this.imageSrc =
      (p?.imageUrl && p.imageUrl.trim()) ||
      (p?.image ? `data:image/jpeg;base64,${p.image}` : 'assets/placeholder.png');
  }

  goToPublic(id?: number) {
    if (!id) return;
    this.router.navigate(['/painting', id]); // absolutny route
  }
}
