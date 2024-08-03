import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent implements OnChanges {
  @Input() order: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['order']) {
      console.log('Order detail input:', this.order);
    }
  }
}
