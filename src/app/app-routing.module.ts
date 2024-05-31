import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ShopComponent } from "./components/header/navbar/shop/shop.component";
import {BrowserModule} from "@angular/platform-browser";

const routes: Routes = [
  { path: '', component: HomeComponent },
  // Add routes for other components here if needed
  { path: 'shop', component: ShopComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    ShopComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
