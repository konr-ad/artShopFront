import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Painting, PaintingService } from 'src/app/services/painting.service';

@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-product-list.component.html',
  styleUrls: ['./admin-product-list.component.css']
})
export class AdminProductListComponent implements OnInit {
  products: any[] = [];
  selectedProductId: any;
  @Output() productSelected = new EventEmitter<any>();

  constructor(private paintingService: PaintingService) {}

  ngOnInit(): void {
    this.paintingService.getPaintings().subscribe((products: any[]) => {
      this.products = products.map(product => ({
        ...product,
        imageUrl: 'data:image/jpeg;base64,' + product.image
      }));
    });
  }

  selectProduct(product: Painting) {
    this.selectedProductId = product.id;
    this.productSelected.emit(product);
    console.log('Emitting product:', product); // Debug log
  }
}
