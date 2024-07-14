import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ShopComponent } from "./components/shop/shop.component";
import { BrowserModule } from "@angular/platform-browser";
import { PaintingDetailComponent } from "./components/shop/painting-detail/painting-detail.component";
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from "./components/checkout/checkout.component";
import { AddPaintingComponent } from './add-painting/add-painting.component';
import {BioComponent} from "./components/info/bio/bio.component";
import {MagazinesComponent} from "./components/info/magazines/magazines.component";
import {ExhibitionsComponent} from "./components/info/exhibitions/exhibitions.component";
import {ArtistStatementComponent} from "./components/info/artist-statement/artist-statement.component";
import {ContactComponent} from "./components/info/contact/contact.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cart', component: CartComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'all', component: ShopComponent },
  { path: 'painting/:id', component: PaintingDetailComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'bio', component: BioComponent },
  { path: 'magazines', component: MagazinesComponent },
  { path: 'exhibitions', component: ExhibitionsComponent },
  { path: 'artistStatement', component: ArtistStatementComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'add', component: AddPaintingComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
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
