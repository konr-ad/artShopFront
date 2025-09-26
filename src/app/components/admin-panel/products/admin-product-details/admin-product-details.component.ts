import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-product-details',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './admin-product-details.component.html',
  styleUrls: ['./admin-product-details.component.css'],
})
export class AdminProductDetailsComponent implements OnChanges {
  @Input() product: any;
  imageSrc = 'assets/placeholder.png';
  ngOnChanges(): void {
    const p = this.product;
    this.imageSrc =
      (p?.imageUrl && p.imageUrl.trim()) ||
      (p?.image ? `data:image/jpeg;base64,${p.image}` : 'assets/placeholder.png');
  }

}
