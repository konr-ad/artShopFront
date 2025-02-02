import {Component, OnInit} from '@angular/core';
import {CartItem, CartService} from "../../services/cart.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements  OnInit {

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
  checkoutForm: FormGroup;
  formSubmitted: boolean = false;

  constructor(private fb: FormBuilder, private cartService: CartService, private router: Router, private route: ActivatedRoute) {
    this.checkoutForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      country: ['', Validators.required],
      state: [''],
      address: ['', Validators.required],
      apartmentNumber: [''],
      city: ['', Validators.required],
      zip: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cartService.getItems().subscribe(items => this.cartItems = items);
    this.cartService.getTotalAmount().subscribe(amount => this.totalAmount = amount);

    // Populate form with data from query parameters
    this.route.queryParams.subscribe(params => {
      this.checkoutForm.patchValue({
        email: params['email'] || '',
        firstName: params['firstName'] || '',
        lastName: params['lastName'] || '',
        country: params['country'] || '',
        state: params['state'] || '',
        address: params['address'] || '',
        apartmentNumber: params['apartmentNumber'] || '',
        city: params['city'] || '',
        zip: params['zip'] || '',
        phone: params['phone'] || ''
      });
    });
  }


  onCountryChange(event: any) {
    this.selectedCountry = event.target.value;
    this.availableStates = this.statesProvinces[this.selectedCountry] || [];
  }

  onSubmit() {
    this.checkoutForm.markAllAsTouched();
    if (this.checkoutForm.valid) {
      this.router.navigate(['/payment'], { state: { ...this.checkoutForm.value } });
    }
  }

  fillTestData() {
    this.checkoutForm.patchValue({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      country: 'United States',
      state: 'California',
      address: '123 Main St',
      apartmentNumber: 'Apt 1',
      city: 'Los Angeles',
      zip: '90001',
      phone: '933330001'
    });
    this.selectedCountry = 'United States';
    this.availableStates = this.statesProvinces[this.selectedCountry];
  }
}
