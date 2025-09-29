import { Component, ViewChild } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AdminProductListComponent } from './product-list/admin-product-list.component';
import { AdminProductDetailsComponent } from './admin-product-details/admin-product-details.component';
import { AddProductModalComponent } from './add-product-modal/add-product-modal.component';
import {PaintingDetailsDto, PaintingService} from "../../../services/painting.service";

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
  editModel?: PaintingDetailsDto;
  constructor(private paintingService: PaintingService) {}
  onProductSelected(product: any) {
    this.selectedProduct = product;
  }

  openAddProductModal() {
    this.editModel = undefined;
    this.isAddOpen = true;
  }

  openEditProductModal(id: number) {
    // pobierz pełne DTO z mediami do modala
    this.paintingService.details(id).subscribe(dto => {
      this.editModel = dto;
      this.isAddOpen = true;
    });
  }
  handleProductAdded(_: any) {
    this.isAddOpen = false;
    this.editModel = undefined;
    this.adminProductListComponent.refreshProducts();
  }
}
