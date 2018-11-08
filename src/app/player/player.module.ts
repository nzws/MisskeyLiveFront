import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayerRoutingModule } from './player-routing.module';
import { PlayerComponent } from './player.component';
import {RandomcolorModule} from 'angular-randomcolor';

@NgModule({
  declarations: [PlayerComponent],
  imports: [
    CommonModule,
    PlayerRoutingModule,
    RandomcolorModule
  ]
})
export class PlayerModule { }
