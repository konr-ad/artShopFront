import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './shop/shop.component';
import { InfoComponent } from './info/info.component';
import { CartComponent } from './cart/cart.component';

const routes: Routes = [
  { path: 'shop', component: ShopComponent },
  { path: 'info', component: InfoComponent },
  { path: 'cart', component: CartComponent },
  { path: '', redirectTo: '/shop', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

