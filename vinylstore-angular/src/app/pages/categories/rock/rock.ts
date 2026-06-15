import { Component } from '@angular/core';
import { Header } from '../../../components/header/header';
import { CategoryNav } from '../../../components/category-nav/category-nav';

@Component({
  selector: 'app-rock',
  imports: [Header  , CategoryNav],
  templateUrl: './rock.html',
  styleUrl: './rock.css',
})
export class Rock {}
