import { Component } from '@angular/core';
import {CartItem, CartService} from "../../services/cart.service";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

  countries: string[] = [
    "Albania", "Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus", "Belgium", "Bosnia and Herzegovina",
    "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Georgia",
    "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Kazakhstan", "Kosovo", "Latvia", "Liechtenstein",
    "Lithuania", "Luxembourg", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", "North Macedonia",
    "Norway", "Poland", "Portugal", "Romania", "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia",
    "Spain", "Sweden", "Switzerland", "Turkey", "Ukraine", "United Kingdom", "United States", "Canada"
  ];

  statesProvinces: { [key: string]: string[] } = {
    "United States": [
      "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
      "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
      "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
      "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
      "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
      "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
    ],
    "Canada": [
      "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Nova Scotia",
      "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan"
    ]
  };
  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  selectedCountry: string = '';
  availableStates: string[] = [];
  showNoteInput: boolean = false;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.getItems().subscribe(items => this.cartItems = items);
    this.cartService.getTotalAmount().subscribe(amount => this.totalAmount = amount);
  }

  onCountryChange(event: any) {
    this.selectedCountry = event.target.value;
    this.availableStates = this.statesProvinces[this.selectedCountry] || [];
  }

  toggleNoteInput() {
    this.showNoteInput = !this.showNoteInput;
  }
}
