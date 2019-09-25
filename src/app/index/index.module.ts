import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {IndexRoutingModule} from './index-routing.module';
import {IndexComponent} from './index.component';
import {LiveInfoCardComponent} from '../core/component/cards/live-info-card/live-info-card.component';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [IndexComponent, LiveInfoCardComponent],
  imports: [
    CommonModule,
    IndexRoutingModule,
    HttpClientModule,
  ]
})
export class IndexModule {
}
