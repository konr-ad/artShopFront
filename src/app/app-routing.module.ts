import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ShopComponent } from "./components/shop/shop.component";
import { BrowserModule } from "@angular/platform-browser";
import {PaintingDetailComponent} from "./components/shop/painting-detail/painting-detail.component";
import { CartComponent } from './components/cart/cart.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cart', component: CartComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'all', component: ShopComponent },
  { path: 'painting/:id', component: PaintingDetailComponent },
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
