import {Component, OnInit} from '@angular/core';
import {SessionService} from './core/service/session.service';
import {environment} from '../environments/environment';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  apiUrl = environment.api;
  staticSessionService = SessionService;

  constructor(
    private sessionService: SessionService
  ) {}
}
