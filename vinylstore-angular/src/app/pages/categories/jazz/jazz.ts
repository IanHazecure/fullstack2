import { Component } from '@angular/core';
import { Header } from '../../../components/header/header';
import { CategoryNav } from '../../../components/category-nav/category-nav';
@Component({
  selector: 'app-jazz',
  imports: [Header, CategoryNav],
  templateUrl: './jazz.html',
  styleUrl: './jazz.css',
})
export class Jazz {}
