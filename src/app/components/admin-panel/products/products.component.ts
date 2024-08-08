import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AdminProductListComponent } from './product-list/admin-product-list.component';
import { AdminProductDetailsComponent } from "./admin-product-details/admin-product-details.component";
import { AddProductModalComponent } from './add-product-modal/add-product-modal.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    AdminProductListComponent,
    AdminProductDetailsComponent,
    AddProductModalComponent
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  selectedProduct: any;
  isAddProductModalOpen = false;

  onProductSelected(product: any) {
    this.selectedProduct = product;
    console.log('Selected product:', product); // Debug log
  }

  openAddProductModal() {
    this.isAddProductModalOpen = true;
  }

  handleProductAdded(newProduct: any) {
    console.log('Product added:', newProduct);
    this.isAddProductModalOpen = false; // Close the modal after product is added
  }
}
