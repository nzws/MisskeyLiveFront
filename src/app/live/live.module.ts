import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiveRoutingModule } from './live-routing.module';
import { LiveComponent } from './live.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [LiveComponent],
  imports: [CommonModule, LiveRoutingModule, HttpClientModule]
})
export class LiveModule {}
