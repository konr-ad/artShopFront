import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { OrderListComponent } from './order-list/order-list.component';
import {OrderDetailComponent} from "./order-detail/order-detail.component";

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    OrderListComponent,
    OrderDetailComponent
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  selectedOrder: any;

  onOrderSelected(order: any) {
    this.selectedOrder = order;
    console.log('Selected order:', order); // Debug log
  }
}
