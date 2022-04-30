import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PromoPageRoutingModule } from './promo-routing.module';
import { PromoPage } from './promo.page';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PromoPageRoutingModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule
  ],
  declarations: [PromoPage]
})
export class PromoPageModule { }
