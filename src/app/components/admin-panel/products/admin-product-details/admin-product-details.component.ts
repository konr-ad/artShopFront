import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {CommonModule, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-admin-product-details',
  standalone: true,
  imports:[
    CommonModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './admin-product-details.component.html',
  styleUrl: './admin-product-details.component.css'
})
export class AdminProductDetailsComponent implements OnChanges {
  @Input() product: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product']) {
      console.log('Product detail input:', this.product);
    }
  }
}
