import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgForOf, NgIf, CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  templateUrl: './order-detail.component.html',
  imports: [
    CommonModule,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnChanges {
  @Input() order: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['order']) {
      console.log('Order detail input:', this.order);
    }
  }
}
