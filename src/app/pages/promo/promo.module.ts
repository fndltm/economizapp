import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PromoPageRoutingModule } from './promo-routing.module';
import { PromoPage } from './promo.page';
import { CommentsComponent } from 'src/app/components/comments/comments.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PromoPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [PromoPage, CommentsComponent]
})
export class PromoPageModule {}
