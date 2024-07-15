import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css']
})
export class StepperComponent implements OnInit {
  activeStep: string = '';

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setActiveStep(event.urlAfterRedirects);
      }
    });
  }

  ngOnInit(): void {
    this.setActiveStep(this.router.url);
  }

  setActiveStep(url: string): void {
    if (url.includes('/cart')) {
      this.activeStep = 'cart';
    } else if (url.includes('/checkout')) {
      this.activeStep = 'checkout';
    } else if (url.includes('/payment')) {
      this.activeStep = 'payment';
    } else {
      this.activeStep = '';
    }
  }
}
