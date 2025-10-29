import {Component, OnInit, signal} from '@angular/core';
import {CustomerDto, CustomerService} from "../../../../services/customer.service";
import {AdminOrderDto} from "../../../../services/order.service";
import {Router} from "@angular/router";
import {CommonModule, CurrencyPipe} from "@angular/common";

@Component({
  selector: 'app-admin-customers-list',
  standalone: true,
  imports: [
    CurrencyPipe,
    CommonModule
  ],
  templateUrl: './admin-customers-list.component.html',
  styleUrl: './admin-customers-list.component.css'
})
export class AdminCustomersListComponent implements OnInit {
  customers = signal<CustomerDto[]>([]);
  expandedId = signal<number | null>(null);
  ordersByCustomer = signal<Record<number, AdminOrderDto[]>>({});
  total = signal(0);
  page = signal(0);
  size = signal(20);
  loading = signal(false);

  constructor(private cs: CustomerService, private router: Router) {}

  ngOnInit(): void { this.load(); }

  load() {
    this.loading.set(true);
    this.cs.getCustomers(this.page(), this.size()).subscribe({
      next: res => {
        this.customers.set(res.content);
        this.total.set(res.totalElements);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  toggle(c: CustomerDto) {
    const id = c.id;
    this.expandedId.set(this.expandedId() === id ? null : id);
    if (this.expandedId() === id && !this.ordersByCustomer()[id]) {
      this.cs.getCustomerOrders(id, 0, 5).subscribe(res => {
        this.ordersByCustomer.set({ ...this.ordersByCustomer(), [id]: res.content });
      });
    }
  }

  isExpanded(id: number) { return this.expandedId() === id; }

  goDetails(id: number) { this.router.navigate(['/admin/customers', id]); }
}
