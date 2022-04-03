import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountPageRoutingModule } from './account-routing.module';

import { AccountPage } from './account.page';
import { ProfileComponent } from './profile/profile.component';
import { SignupPage } from '../signup/signup.page';
import { SignupPageModule } from '../signup/signup.module';
import { LoginPageModule } from '../login/login.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountPageRoutingModule,
    ReactiveFormsModule,
    LoginPageModule
  ],
  declarations: [AccountPage, ProfileComponent]
})
export class AccountPageModule { }
