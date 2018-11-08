import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from '../../app-routing.module';

@NgModule({
  declarations: [NavbarComponent],
  imports: [
    CommonModule,
    NgbCollapseModule,
    AppRoutingModule
  ],
  exports: [NavbarComponent]
})
export class NavbarModule { }
