import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LiveRoutingModule} from './live-routing.module';
import {LiveComponent} from './live.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [LiveComponent],
  imports: [CommonModule, LiveRoutingModule, HttpClientModule, FormsModule]
})
export class LiveModule {
}
