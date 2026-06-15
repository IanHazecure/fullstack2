import { Component } from '@angular/core';
import { Header } from '../../../components/header/header';
import { CategoryNav } from '../../../components/category-nav/category-nav';

@Component({
  selector: 'app-pop',
  imports: [Header, CategoryNav],
  templateUrl: './pop.html',
  styleUrl: './pop.css',
})
export class Pop {}
