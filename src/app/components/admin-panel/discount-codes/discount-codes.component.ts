import { Component, OnInit, ViewChild } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { OrderDetailComponent } from '../orders/order-detail/order-detail.component';
import { OrderListComponent } from '../orders/order-list/order-list.component';
import { DiscountCodeDto, DiscountCodeService } from '../../../services/discount-code.service';
import { CurrencyPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddCodeModalComponent } from './add-code-modal/add-code-modal.component';
import {DiscountCodeListComponent} from "./discount-code-list/discount-code-list.component";

@Component({
  selector: 'app-discount-codes',
  standalone: true,
  imports: [
    SidebarComponent,
    OrderDetailComponent,
    OrderListComponent,
    CurrencyPipe,
    DatePipe,
    NgForOf,
    FormsModule,
    NgIf,
    AddCodeModalComponent,
    DiscountCodeListComponent,
  ],
  templateUrl: './discount-codes.component.html',
  styleUrl: './discount-codes.component.css',
})
export class DiscountCodesComponent implements OnInit {
  discountCodes: DiscountCodeDto[] = [];
  checkedIndexes: boolean[] = [];
  message: string | null = null;

  @ViewChild(AddCodeModalComponent) addCodeModal!: AddCodeModalComponent;

  constructor(private discountCodeService: DiscountCodeService) {}

  ngOnInit(): void {
    this.getDiscountCodes();
  }

  openAddCodeModal() {
    this.addCodeModal.open();
  }

  onModalClosed() {
    this.getDiscountCodes();
  }

  getDiscountCodes(): void {
    this.discountCodeService.getAllDiscountCodes().subscribe(
      (codes) => {
        console.log(codes);
        this.discountCodes = codes;
        this.checkedIndexes = new Array(codes.length).fill(false);
      },
      (error) => {
        this.message = 'Error fetching discount codes';
      }
    );
  }
}
