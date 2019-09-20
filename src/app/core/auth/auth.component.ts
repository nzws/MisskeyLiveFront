import {Component, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  token: string;

  constructor(
    private cookieService: CookieService,
    private httpClient: HttpClient,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.httpClient.get(`${environment.api}/auth/data`, {withCredentials: true})
      .subscribe((data: any) => {
        this.cookieService.set('i', data.i);
        this.router.navigate(['/']);
      });
  }
}