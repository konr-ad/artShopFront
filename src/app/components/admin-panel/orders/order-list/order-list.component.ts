import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { OrderService } from '../../../../services/order.service';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent implements OnInit {
  orders: any[] = [];
  selectedOrderId: any;
  @Output() orderSelected = new EventEmitter<any>();

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe((data: any[]) => {
      this.orders = data;
    });
  }

  selectOrder(order: any) {
    this.selectedOrderId = order.id;
    this.orderSelected.emit(order);
  }
}
