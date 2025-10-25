import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminOrderDto, OrderService } from '../../../../services/order.service';

type SortKey = 'id' | 'contactEmail' | 'paymentStatus' | 'createdAt' | 'totalAmount';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css',
})
export class OrderListComponent implements OnInit {
  orders: AdminOrderDto[] = [];
  selectedOrderId: number | null = null;

  // toolbar state
  searchTerm = '';
  sortKey: SortKey = 'id';
  sortDir: SortDir = 'asc';

  @Output() orderSelected = new EventEmitter<AdminOrderDto>();

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe((data: AdminOrderDto[]) => {
      this.orders = data ?? [];
    });
  }

  selectOrder(order: AdminOrderDto) {
    this.selectedOrderId = order.id;
    this.orderSelected.emit(order);
    // console.debug('Emitting order:', order);
  }

  trackById = (_: number, o: AdminOrderDto) => o.id;

  sortBy(key: SortKey) {
    if (this.sortKey === key) {
      // toggle direction
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDir = 'asc';
    }
  }

  filteredAndSorted(): AdminOrderDto[] {
    const term = this.searchTerm.trim().toLowerCase();

    // 1) filter
    let res = !term
      ? this.orders.slice()
      : this.orders.filter(o => {
        // dopasowanie po emailu, statusie, id
        const idStr = String(o.id);
        const email = (o.contactEmail ?? '').toString().toLowerCase();
        const status = (o.paymentStatus ?? '').toString().toLowerCase();
        return (
          idStr.includes(term) ||
          email.includes(term) ||
          status.includes(term)
        );
      });

    // 2) sort
    res.sort((a, b) => this.compare(a, b, this.sortKey, this.sortDir));
    return res;
  }

  private compare(a: AdminOrderDto, b: AdminOrderDto, key: SortKey, dir: SortDir): number {
    let va: any = a[key] as any;
    let vb: any = b[key] as any;

    // specjalne traktowanie pól
    if (key === 'totalAmount') {
      va = Number(va);
      vb = Number(vb);
    } else if (key === 'createdAt') {
      // sortuj po dacie
      va = new Date(va).getTime();
      vb = new Date(vb).getTime();
    } else if (key === 'contactEmail' || key === 'paymentStatus') {
      va = (va ?? '').toString().toLowerCase();
      vb = (vb ?? '').toString().toLowerCase();
    } else if (key === 'id') {
      va = Number(va);
      vb = Number(vb);
    }

    const cmp = va < vb ? -1 : va > vb ? 1 : 0;
    return dir === 'asc' ? cmp : -cmp;
  }
}
