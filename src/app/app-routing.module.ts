import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { ProfileComponent } from './pages/account/profile/profile.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToPromos = () => redirectLoggedInTo(['promos']);

const routes: Routes = [
  {
    path: '',
    redirectTo: 'promos',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule),
  },
  {
    path: 'promos',
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/promos/promos.module').then(m => m.PromosPageModule)
      },
      {
        path: ':uid',
        loadChildren: () => import('./pages/promo/promo.module').then(m => m.PromoPageModule)
      }
    ]
  },
  {
    path: 'account',
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/account/account.module').then(m => m.AccountPageModule)
      },
      {
        path: 'profile',
        component: ProfileComponent,
        ...canActivate(redirectUnauthorizedToLogin),
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
