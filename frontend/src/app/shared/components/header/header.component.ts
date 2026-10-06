import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-header',
  imports: [MenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
