import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule } from "@angular/forms";
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { AdditionalElementsComponent } from './components/header/additional-elements/additional-elements.component';
import { NavbarComponent } from './components/header/navbar/navbar.component';
import { LogoComponent } from './components/header/logo/logo.component';
import { FiltersComponent } from './components/shop/filters/filters.component';
import { ProductListComponent } from './components/shop/product-list/product-list.component';
import { ShopComponent } from './components/shop/shop.component';
import { PaintingDetailComponent } from './components/shop/painting-detail/painting-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TuiRootModule} from '@taiga-ui/core';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    TuiRootModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
