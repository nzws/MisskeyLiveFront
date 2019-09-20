import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private login: boolean;
  private token: string;

  constructor(private cookieService: CookieService) {
    this.login = this.cookieService.check('live-token');
    this.token = this.login ? this.cookieService.get('live-token') : null;
  }

  isLogin() {
    return this.login;
  }

  getToken() {
    return this.token;
  }
}
