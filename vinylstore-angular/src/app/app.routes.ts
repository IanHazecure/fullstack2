import { Routes } from '@angular/router';
import { Intro } from './pages/intro/intro';
import { Login } from './pages/auth/login/login';
import { Recovery } from './pages/auth/recovery/recovery';
import { Register } from './pages/auth/register/register';
import { Profile } from './pages/user/profile/profile';
import { Upcoming } from './pages/upcoming/upcoming';
import { AdminDashboard } from './pages/user/admindashboard/admindashboard';
import { Catalog } from './pages/catalog/catalog';

export const routes: Routes = [
  { path: '', component: Intro },
  { path: 'login', component: Login },
  { path: 'recovery', component: Recovery },
  { path: 'register', component: Register },
  { path: 'profile', component: Profile },
  { path: 'upcoming', component: Upcoming },
  { path: 'admin', component: AdminDashboard },
  { path: 'catalog', component: Catalog },
];