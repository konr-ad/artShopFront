import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Painting, PaintingService, PaintingType} from 'src/app/services/painting.service';

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

  selected: Record<number, boolean> = {};
  message: string | null = null;
  products: (Painting & { imageUrl?: string })[] = [];
  selectedProductId?: number;

  // UI state
  searchTerm = '';
  typeFilter: 'ALL' | string = 'ALL';
  sortKey: 'id' | 'name' | 'price' = 'id';
  sortDir: 'asc' | 'desc' = 'desc';

  paintingTypes: PaintingType[] = ['MONOTYPE','PRINT','OIL','ACRYLIC','WATERCOLOR','DIGITAL'];

  stateLabels: Record<string, string> = {
    'AVAILABLE': 'DOSTĘPNY',
    'RESERVED': 'ZABLOKOWANY'
  }

  typeLabels: Record<PaintingType, string> = {
    MONOTYPE: 'Monotypia',
    PRINT: 'Druk',
    OIL: 'Olej',
    ACRYLIC: 'Akryl',
    WATERCOLOR: 'Akwarela',
    DIGITAL: 'Cyfrowy',
  };
  typeLabelsMap: Record<string, string> = this.typeLabels;

  constructor(private paintingService: PaintingService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.paintingService.getAllAdminPaintings().subscribe((items: Painting[]) => {
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

  allChecked(): boolean {
    const rows = this.filteredAndSorted();
    if (rows.length === 0) return false;
    return rows.every(p => this.selected[p.id!]);
  }

  toggleAll(checked: boolean) {
    this.filteredAndSorted().forEach(p => this.selected[p.id!] = checked);
  }

  trackById = (_: number, p: Painting) => p.id;
  anySelected(): boolean {
    return Object.values(this.selected).some(Boolean);
  }

  selectedIds(): number[] {
    return Object.entries(this.selected)
      .filter(([, v]) => v)
      .map(([k]) => +k);
  }

  lockSelected() {
    const ids = this.selectedIds();
    if (ids.length === 0) return;

    this.paintingService.lockPaintings(ids).subscribe({
      next: () => {
        this.message = 'Zablokowano zaznaczone obrazy.';
        // opcjonalnie: odśwież listę (jeśli stan widoku zależy od blokady)
        this.refreshProducts();
        // odznacz po akcji
        ids.forEach(id => delete this.selected[id]);
        setTimeout(() => this.message = null, 3000);
      },
      error: () => {
        this.message = 'Nie udało się zablokować obrazów.';
        setTimeout(() => this.message = null, 3000);
      }
    });
  }

  unlockSelected() {
    const ids = this.selectedIds();
    if (ids.length === 0) return;

    this.paintingService.unlockPaintings(ids).subscribe({
      next: () => {
        this.message = 'Odblokowano zaznaczone obrazy.';
        this.refreshProducts();
        ids.forEach(id => delete this.selected[id]);
        setTimeout(() => this.message = null, 3000);
      },
      error: () => {
        this.message = 'Nie udało się odblokować obrazów.';
        setTimeout(() => this.message = null, 3000);
      }
    });
  }

  labelForType(t: string): string {
    return this.typeLabelsMap[t] ?? t;
  }

}
