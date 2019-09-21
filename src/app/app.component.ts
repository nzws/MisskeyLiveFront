import {Component} from '@angular/core';
import {SessionService} from './core/service/session.service';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  apiUrl = environment.api;
  staticSessionService = SessionService;
  isCollapsed = true;

  constructor(
    private sessionService: SessionService
  ) {
  }
}
