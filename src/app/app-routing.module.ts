import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ShopComponent } from './components/shop/shop.component';
import { BrowserModule } from '@angular/platform-browser';
import { PaintingDetailComponent } from './components/shop/painting-detail/painting-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { BioComponent } from './components/info/bio/bio.component';
import { MagazinesComponent } from './components/info/magazines/magazines.component';
import { ExhibitionsComponent } from './components/info/exhibitions/exhibitions.component';
import { ArtistStatementComponent } from './components/info/artist-statement/artist-statement.component';
import { ContactComponent } from './components/info/contact/contact.component';
import { PaymentComponent } from './components/payment/payment.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';
import { LoginComponent } from './components/admin-panel/login/login.component';
import { DashboardComponent } from './components/admin-panel/dashboard.component';
import { OrdersComponent } from './components/admin-panel/orders/orders.component';
import { ProductsComponent } from './components/admin-panel/products/products.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { DiscountCodesComponent } from './components/admin-panel/discount-codes/discount-codes.component';
import {TermsComponent} from "./components/terms/terms.component";
import { AuthGuard} from "./services/AuthGuard";
import {PrivacyComponent} from "./components/privacy/privacy.component";

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
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
  { path: 'login', loadComponent: () => import('./components/admin-panel/login/login.component').then(m => m.LoginComponent) },
  { path: 'terms', component: TermsComponent },
  { path: 'privacy', component: PrivacyComponent },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./components/admin-panel/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'orders',    loadComponent: () => import('./components/admin-panel/orders/orders.component').then(m => m.OrdersComponent) },
      { path: 'products',  loadComponent: () => import('.//components/admin-panel/products/products.component').then(m => m.ProductsComponent) },
      { path: 'discountcodes', loadComponent: () => import('./components/admin-panel/discount-codes/discount-codes.component').then(m => m.DiscountCodesComponent) },
      { path: 'customers', loadComponent: () => import('./components/admin-panel/customers/admin-customers.component').then(m => m.AdminCustomersComponent) },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
    ]
  },
  // { path: 'admin/products', component:  },
  { path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 0],
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
