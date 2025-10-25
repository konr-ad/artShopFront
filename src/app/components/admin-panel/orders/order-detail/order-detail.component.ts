import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminOrderDto } from '../../../../services/order.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
})
export class OrderDetailComponent implements OnChanges {
  @Input() order: AdminOrderDto | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['order']) {
      console.log('OrderDetailComponent: received order', this.order);
    }
  }

}
