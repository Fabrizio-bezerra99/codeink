import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer-component/footer-component';
import { NavbarComponent } from '../navbar-component/navbar-component';

@Component({
  selector: 'app-site-layout',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './site-layout-component.html',
  styleUrl: './site-layout-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteLayoutComponent {}
