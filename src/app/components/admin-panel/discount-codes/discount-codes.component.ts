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
  checkedIndexes: boolean[] = [];
  message: string | null = null;


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
          this.message = "Error fetching discount codes"
        }
      )
  }

  getSelectedDiscountCodes(): DiscountCodeDto[] {
    return this.discountCodes.filter((_, index) => this.checkedIndexes[index]);
  }

  isRemoveButtonVisible(): boolean {
    return this.checkedIndexes.some(checked => checked);
  }

  removeCheckedItems(): void {
    const selectedDiscountCodes = this.getSelectedDiscountCodes();

    const selectedIds = selectedDiscountCodes.map((code) => code.id);

    this.discountCodeService.deleteDiscountCodes(selectedIds).subscribe(
      () => {
        this.discountCodes = this.discountCodes.filter((code) => !selectedIds.includes(code.id));
        this.checkedIndexes = new Array(this.discountCodes.length).fill(false);
        this.message = "Selected discount codes deleted successfully";
        setTimeout(() => {
          this.message = null;
        }, 5000);
      },
      () => {
        this.message = "Error deleting discount codes";
        setTimeout(() => {
          this.message = null;
        }, 5000);
      },
    );
  }
}
