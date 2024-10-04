import {Component, OnInit} from '@angular/core';
import {SidebarComponent} from "../sidebar/sidebar.component";
import {OrderDetailComponent} from "../orders/order-detail/order-detail.component";
import {OrderListComponent} from "../orders/order-list/order-list.component";
import {DiscountCodeDto, DiscountCodeService} from "../../../services/discount-code.service";
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

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
    NgIf
  ],
  templateUrl: './discount-codes.component.html',
  styleUrl: './discount-codes.component.css'
})
export class DiscountCodesComponent implements OnInit {
  discountCodes: DiscountCodeDto[] = [];
  discountCodesToRemove: DiscountCodeDto[] = [];
  checkedIndexes: boolean[] = [];

  constructor(private discountCodeService: DiscountCodeService) {
  }

  ngOnInit(): void {
    this.getDiscountCodes();
  }

  getDiscountCodes(): void {
    this.discountCodeService.getAllDiscountCodes()
      .subscribe(
        (codes) => {
          console.log(codes)
          this.discountCodes = codes;
          this.checkedIndexes = new Array(codes.length).fill(false);
        },
        (error) => {
          console.error("Error fetching discount codes:", error)
        }
      )
  }

  getCheckedItems(): DiscountCodeDto[] {
    return this.discountCodes.filter((_, index) => this.checkedIndexes[index]);
  }

  isRemoveButtonVisible(): boolean {
    return this.checkedIndexes.some(checked => checked);
  }

  removeCheckedItems(): void {
    this.discountCodesToRemove = this.discountCodes.filter((_, index) => this.checkedIndexes[index]);
    console.log(this.discountCodesToRemove)
  }
}
