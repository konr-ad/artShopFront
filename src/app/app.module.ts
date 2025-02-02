import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {HttpClientModule, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {FormsModule} from "@angular/forms";
import {FooterComponent} from './components/footer/footer.component';
import {HeaderComponent} from './components/header/header.component';
import {AdditionalElementsComponent} from './components/header/additional-elements/additional-elements.component';
import {NavbarComponent} from './components/header/navbar/navbar.component';
import {LogoComponent} from './components/header/logo/logo.component';
import {FiltersComponent} from './components/shop/filters/filters.component';
import {ProductListComponent} from './components/shop/product-list/product-list.component';
import {ShopComponent} from './components/shop/shop.component';
import {PaintingDetailComponent} from './components/shop/painting-detail/painting-detail.component';
import {CartComponent} from './components/cart/cart.component';
import {CheckoutComponent} from './components/checkout/checkout.component';
import {StepperComponent} from "./components/stepper/stepper.component";
import {PaymentComponent} from "./components/payment/payment.component";
import {ReactiveFormsModule} from '@angular/forms';
import {GalleryComponent} from "./components/gallery/gallery.component";
import { CommonModule } from '@angular/common';
import {ConfigService} from "./services/config/ConfigService";

// Function to load configuration before app starts
export function loadConfig(configService: ConfigService) {
  return () => configService.loadConfig().toPromise();
}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    AdditionalElementsComponent,
    NavbarComponent,
    LogoComponent,
    ShopComponent,
    FiltersComponent,
    ProductListComponent,
    PaintingDetailComponent,
    CartComponent,
    CheckoutComponent,
    StepperComponent,
    PaymentComponent,
    GalleryComponent

  ],
  bootstrap: [AppComponent], imports: [BrowserModule,
    AppRoutingModule, ReactiveFormsModule, HttpClientModule,
    FormsModule, CommonModule], providers: [
      provideHttpClient(withInterceptorsFromDi()),
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [ConfigService],
      multi: true
    }
  ]
})
export class AppModule {
}
