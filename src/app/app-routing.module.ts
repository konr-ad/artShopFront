import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ShopComponent } from "./components/shop/shop.component";
import { BrowserModule } from "@angular/platform-browser";
import { PaintingDetailComponent } from "./components/shop/painting-detail/painting-detail.component";
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from "./components/checkout/checkout.component";
import {BioComponent} from "./components/info/bio/bio.component";
import {MagazinesComponent} from "./components/info/magazines/magazines.component";
import {ExhibitionsComponent} from "./components/info/exhibitions/exhibitions.component";
import {ArtistStatementComponent} from "./components/info/artist-statement/artist-statement.component";
import {ContactComponent} from "./components/info/contact/contact.component";
import {PaymentComponent} from "./components/payment/payment.component";
import {GalleryComponent} from "./components/gallery/gallery.component";
import {ThankyouComponent} from "./components/thankyou/thankyou.component";
import {LoginComponent} from "./components/admin-panel/login/login.component";
import {DashboardComponent} from "./components/admin-panel/dashboard.component";
import {OrdersComponent} from "./components/admin-panel/orders/orders.component";
import {ProductsComponent} from "./components/admin-panel/products/products.component";
import {NotfoundComponent} from "./components/notfound/notfound.component";
import {DiscountCodesComponent} from "./components/admin-panel/discount-codes/discount-codes.component";

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'cart', component: CartComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'all', component: ShopComponent },
  { path: 'painting/:id', component: PaintingDetailComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'bio', component: BioComponent },
  { path: 'magazines', component: MagazinesComponent },
  { path: 'exhibitions', component: ExhibitionsComponent },
  { path: 'artistStatement', component: ArtistStatementComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'thankyou', component: ThankyouComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin/dashboard', component: DashboardComponent },
  { path: 'admin/orders', component: OrdersComponent },
  { path: 'admin/products', component: ProductsComponent },
  { path: 'admin/discountcodes', component: DiscountCodesComponent },
  // { path: 'admin/products', component:  },
  { path: '**', component: NotfoundComponent  }
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
