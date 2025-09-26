import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Painting, PaintingService } from 'src/app/services/painting.service';

@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-product-list.component.html',
  styleUrls: ['./admin-product-list.component.css'],
})
export class AdminProductListComponent implements OnInit {
  @Output() productSelected = new EventEmitter<Painting>();
  @Output() addProduct = new EventEmitter<void>();

  products: (Painting & { imageUrl?: string })[] = [];
  selectedProductId?: number;

  // UI state
  searchTerm = '';
  typeFilter: 'ALL' | string = 'ALL';
  sortKey: 'id' | 'name' | 'price' = 'id';
  sortDir: 'asc' | 'desc' = 'desc';

  paintingTypes: string[] = ['OIL', 'MONOTYPE', 'PRINT'];

  constructor(private paintingService: PaintingService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.paintingService.getPaintings().subscribe((items: Painting[]) => {
      this.products = items.map(p => ({
        ...p,
        imageUrl: p.imageUrl ?? (p.image ? `data:image/jpeg;base64,${p.image}` : undefined),
      }));
    });
  }

  refreshProducts(): void {
    this.loadProducts();
  }

  selectProduct(p: Painting) {
    this.selectedProductId = p.id;
    this.productSelected.emit(p);
  }

  onAddClick() {
    this.addProduct.emit();
  }

  filteredAndSorted() {
    let data = this.products;

    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase();
      data = data.filter(p =>
        (p.name ?? '').toLowerCase().includes(q) ||
        (p.description ?? '').toLowerCase().includes(q)
      );
    }

    if (this.typeFilter !== 'ALL') {
      data = data.filter(p => (p as any).type === this.typeFilter);
    }

    data = [...data].sort((a: any, b: any) => {
      const dir = this.sortDir === 'asc' ? 1 : -1;
      if (this.sortKey === 'name') {
        return a.name.localeCompare(b.name) * dir;
      }
      if (this.sortKey === 'price') {
        return (a.price - b.price) * dir;
      }
      // id default
      return (a.id - b.id) * dir;
    });

    return data;
  }

  sortBy(key: 'id' | 'name' | 'price') {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDir = 'asc';
    }
  }

  trackById = (_: number, p: Painting) => p.id;
}
