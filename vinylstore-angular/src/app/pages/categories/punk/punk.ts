import { Component } from '@angular/core';
import { Header } from '../../../components/header/header';
import { CategoryNav } from '../../../components/category-nav/category-nav';

@Component({
  selector: 'app-punk',
  imports: [Header, CategoryNav],
  templateUrl: './punk.html',
  styleUrl: './punk.css',
})
export class Punk {}
