import { NgModule } from '@angular/core';
import {APP_BASE_HREF, CommonModule} from '@angular/common';

import { IndexRoutingModule } from './index-routing.module';
import { IndexComponent } from './index.component';

@NgModule({
  declarations: [IndexComponent],
  imports: [
    CommonModule,
    IndexRoutingModule
  ],
  providers: [{provide: APP_BASE_HREF, useValue: '/'}]
})
export class IndexModule { }
