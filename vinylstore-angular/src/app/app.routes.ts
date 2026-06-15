import { Routes } from '@angular/router';

import { Intro } from './pages/intro/intro';
import { Rock } from './pages/categories/rock/rock';

export const routes: Routes = [

    { path: '', component: Intro },
    { path: 'categories/rock', component: Rock }

];
