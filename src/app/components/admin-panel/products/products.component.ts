import { Component, ViewChild } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AdminProductListComponent } from './product-list/admin-product-list.component';
import { AdminProductDetailsComponent } from './admin-product-details/admin-product-details.component';
import { AddProductModalComponent } from './add-product-modal/add-product-modal.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    SidebarComponent,
    AdminProductListComponent,
    AdminProductDetailsComponent,
    AddProductModalComponent,
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  @ViewChild('adminList') adminProductListComponent!: AdminProductListComponent;

  selectedProduct: any;
  isAddOpen = false;

  onProductSelected(product: any) {
    this.selectedProduct = product;
  }

  openAddProductModal() {
    this.isAddOpen = true;
  }

  handleProductAdded(newProduct: any) {
    this.isAddOpen = false;
    this.adminProductListComponent.refreshProducts();
  }
}
