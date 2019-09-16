import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndexRoutingModule } from './index-routing.module';
import { IndexComponent } from './index.component';
import { LiveInfoCardComponent } from '../core/component/cards/live-info-card/live-info-card.component';

@NgModule({
  declarations: [IndexComponent, LiveInfoCardComponent],
  imports: [
    CommonModule,
    IndexRoutingModule
  ]
})
export class IndexModule { }
