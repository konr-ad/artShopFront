import {Component, OnInit} from '@angular/core';
import {CartService, CartItem} from 'src/app/services/cart.service';
import {DiscountCodeService} from "../../services/discount-code.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  discountCode: string = "";
  resultMessage: string = "";
  isDiscountCodeVisible: boolean = false;
  isDiscountCodeValid: boolean | null = null;
  isDiscountCodeApplied: boolean = false;

  constructor(private cartService: CartService, private discountCodeService: DiscountCodeService) {
  }

  ngOnInit(): void {
    this.cartService.getItems().subscribe(items => this.cartItems = items);
    this.cartService.getTotalAmount().subscribe(amount => this.totalAmount = amount);
  }

  removeItem(productId: number) {
    this.cartService.removeItem(productId);
  }

  incrementQuantity(item: CartItem) {
    item.quantity += 1;
    this.cartService.updateItem(item);
  }

  decrementQuantity(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.cartService.updateItem(item);
    }
  }

  applyDiscountCode() {
    if (!this.isDiscountCodeApplied) {
      this.resultMessage = "";
      this.discountCodeService.validateDiscountCode(this.discountCode)
        .subscribe(
          (response) => {
            this.isDiscountCodeValid = response.valid;
            if (this.isDiscountCodeValid) {
              if (!this.isDiscountCodeApplied) {
                this.isDiscountCodeApplied = true;
                this.totalAmount -= response.discountValue
              }
              this.resultMessage = "Discount code applied!";
            } else {
              this.resultMessage = response.message;
            }
          },
          (error) => {
            this.isDiscountCodeValid = false;
            this.resultMessage = "An error occurred while validating the discount code";
          }
        );
    }
  }

  showDiscountCode() {
   this.isDiscountCodeVisible = !this.isDiscountCodeVisible
  }
}
