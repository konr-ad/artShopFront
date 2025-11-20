import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CommonModule} from '@angular/common';
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-thankyou',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './thankyou.component.html',
  styleUrl: './thankyou.component.css',
})
export class ThankyouComponent implements OnInit {
  orderId?: string | null;
  email?: string | null;

  constructor(private route: ActivatedRoute, private cart: CartService) {
  }

  ngOnInit(): void {
    this.orderId = sessionStorage.getItem('lastOrderId')
    this.email = sessionStorage.getItem('lastOrderEmail')
  }
}
