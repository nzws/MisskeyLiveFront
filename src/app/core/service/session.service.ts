import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private cookieService: CookieService) {
  }

  isLogin() {
    return this.cookieService.check('live-token');
  }

  getToken() {
    return this.isLogin() ? this.cookieService.get('live-token') : null;
  }
}
