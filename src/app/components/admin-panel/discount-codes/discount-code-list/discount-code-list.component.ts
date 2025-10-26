import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiscountCodeDto, DiscountCodeService } from '../../../../services/discount-code.service';
import { Subscription } from 'rxjs';

type SortKey = 'code' | 'isActive' | 'discountType' | 'discountValue' | 'minimumOrderValue' | 'usageLimit' | 'timesUsed' | 'validFrom' | 'validTo';

@Component({
  selector: 'app-discount-code-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './discount-code-list.component.html'
})
export class DiscountCodeListComponent implements OnInit, OnDestroy {
  @Output() addCode = new EventEmitter<void>();

  message: string | null = null;
  checkedIndexes: boolean[] = [];
  discountCodes: DiscountCodeDto[] = [];
  searchTerm = '';
  selected: Record<number, boolean> = {};
  sortKey: SortKey = 'code';
  sortDir: 'asc' | 'desc' = 'asc';

  private sub?: Subscription;

  constructor(private discountCodeService: DiscountCodeService) {}

  ngOnInit(): void {
    this.load();
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  load(): void {
    this.sub = this.discountCodeService.getAllDiscountCodes().subscribe((res: DiscountCodeDto[]) => {
      this.discountCodes = res ?? [];
      this.selected = {};
    });
  }

  trackById = (_: number, x: DiscountCodeDto) => x.id;

  toggleAll(checked: boolean) {
    this.discountCodes.forEach(c => this.selected[c.id] = checked);
  }
  anySelected(): boolean {
    return Object.entries(this.selected).some(([_, v]) => v);
  }
  selectedIds(): number[] {
    return Object.entries(this.selected)
      .filter(([_, v]) => v)
      .map(([k]) => +k);
  }

  removeCheckedItems(): void {
    const selectedDiscountCodes = this.getSelectedDiscountCodes();

    const selectedIds = selectedDiscountCodes.map((code) => code.id);

    this.discountCodeService.deleteDiscountCodes(selectedIds).subscribe(
      () => {
        this.discountCodes = this.discountCodes.filter((code) => !selectedIds.includes(code.id));
        this.checkedIndexes = new Array(this.discountCodes.length).fill(false);
        this.message = 'Wybrane kody zostały pomyślnie usunięte.';
        setTimeout(() => {
          this.message = null;
        }, 4000);
      },
      () => {
        this.message = 'Wystąpił błąd przy usuwaniu kodów.';
        setTimeout(() => {
          this.message = null;
        }, 4000);
      }
    );
  }

  getSelectedDiscountCodes(): DiscountCodeDto[] {
    return this.discountCodes.filter((_, index) => this.checkedIndexes[index]);
  }

  sortBy(key: SortKey) {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDir = 'asc';
    }
  }

  filteredAndSorted(): DiscountCodeDto[] {
    const term = this.searchTerm.trim().toLowerCase();
    const filtered = !term
      ? this.discountCodes
      : this.discountCodes.filter(c =>
        c.code.toLowerCase().includes(term) ||
        (c.discountType || '').toLowerCase().includes(term)
      );

    const dir = this.sortDir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const ka = (a as any)[this.sortKey];
      const kb = (b as any)[this.sortKey];

      // Daty jako porównywalne liczby
      const va = (ka instanceof Date) ? +ka : (typeof ka === 'string' ? ka.toLowerCase() : ka);
      const vb = (kb instanceof Date) ? +kb : (typeof kb === 'string' ? kb.toLowerCase() : kb);

      if (va == null && vb == null) return 0;
      if (va == null) return -1 * dir;
      if (vb == null) return  1 * dir;
      return va > vb ? dir : va < vb ? -dir : 0;
    });
  }
}
