import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { HomePage } from './pages/home/home.page';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['']);

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule),
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: '',
    component: HomePage,
    ...canActivate(redirectUnauthorizedToLogin),
    children: [
      {
        path: 'profile',
        ...canActivate(redirectUnauthorizedToLogin),
        children: [
          {
            path: '',
            loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule),
            ...canActivate(redirectUnauthorizedToLogin),
          }
        ]
      },
      {
        path: 'promos',
        ...canActivate(redirectUnauthorizedToLogin),
        children: [
          {
            path: '',
            loadChildren: () => import('./pages/promos/promos.module').then(m => m.PromosPageModule),
            ...canActivate(redirectUnauthorizedToLogin),
          }
        ]
      },
      {
        path: 'promo',
        ...canActivate(redirectUnauthorizedToLogin),
        children: [
          {
            path: '',
            loadChildren: () => import('./pages/promo/promo.module').then(m => m.PromoPageModule),
            ...canActivate(redirectUnauthorizedToLogin),
          }
        ]
      }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
