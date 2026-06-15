import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-intro',
  imports: [RouterLink, Header],
  templateUrl: './intro.html',
  styleUrl: './intro.css',
})
export class Intro {}