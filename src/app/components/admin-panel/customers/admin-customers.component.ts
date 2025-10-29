import { Component } from '@angular/core';
import {OrderDetailComponent} from "../orders/order-detail/order-detail.component";
import {OrderListComponent} from "../orders/order-list/order-list.component";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {AdminCustomersListComponent} from "./admin-customers-list/admin-customers-list.component";

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [
    OrderDetailComponent,
    OrderListComponent,
    SidebarComponent,
    AdminCustomersListComponent
  ],
  templateUrl: './admin-customers.component.html',
  styleUrl: './admin-customers.component.css'
})
export class AdminCustomersComponent {

}
