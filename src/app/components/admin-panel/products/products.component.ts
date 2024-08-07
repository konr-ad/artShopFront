import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AdminProductListComponent } from './product-list/admin-product-list.component';
import {AdminProductDetailsComponent} from "./admin-product-details/admin-product-details.component";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    AdminProductListComponent,
    AdminProductDetailsComponent,
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  selectedProduct: any;

  onProductSelected(product: any) {
    this.selectedProduct = product;
    console.log('Selected product:', product); // Debug log
  }
}
