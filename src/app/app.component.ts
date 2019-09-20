import {Component, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {SessionService} from './core/service/session.service';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLogin = false;
  i: string;
  apiUrl = environment.api;

  constructor(private sessionService: SessionService) {
  }

  ngOnInit() {
    this.isLogin = this.sessionService.isLogin();
    this.i = this.sessionService.getToken();
  }
}
