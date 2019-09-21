import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  static login = false;
  static token: string = null;

  constructor(private cookieService: CookieService) {
    this.refresh();
  }

  refresh() {
    SessionService.login = this.cookieService.check('live-token');
    SessionService.token = SessionService.login ? this.cookieService.get('live-token') : null;
  }

  logout() {
    this.cookieService.delete('live-token');
    this.refresh();
  }
}
