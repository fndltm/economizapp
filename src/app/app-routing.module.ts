import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { HomePage } from './pages/home/home.page';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['home']);

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
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
    path: 'home',
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
