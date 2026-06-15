import { Routes } from '@angular/router';
import { Intro } from './pages/intro/intro';
import { Rock } from './pages/categories/rock/rock';
import { Jazz } from './pages/categories/jazz/jazz';
import { Pop } from './pages/categories/pop/pop';
import { Punk } from './pages/categories/punk/punk';
import { Login } from './pages/auth/login/login';
import { Recovery } from './pages/auth/recovery/recovery';
import { Register } from './pages/auth/register/register';
import { Profile } from './pages/user/profile/profile';

export const routes: Routes = [
  { path: '', component: Intro },
  { path: 'categories/rock', component: Rock },
  { path: 'categories/jazz', component: Jazz },
  { path: 'categories/pop', component: Pop },
  { path: 'categories/punk', component: Punk },
  { path: 'login', component: Login },
  { path: 'recovery', component: Recovery },
  { path: 'register', component: Register },
  { path: 'profile', component: Profile },
];