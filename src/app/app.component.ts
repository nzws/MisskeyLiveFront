import {Component, OnInit} from '@angular/core';
import {SessionService} from './core/service/session.service';
import {environment} from '../environments/environment';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLogin = false;
  apiUrl = environment.api;

  constructor(
    private sessionService: SessionService,
    private cookieService: CookieService
    ) {
  }

  ngOnInit() {
    this.isLogin = this.sessionService.isLogin();
  }

  logout() {
    this.cookieService.delete('live-token');
    this.isLogin = false;
  }
}
