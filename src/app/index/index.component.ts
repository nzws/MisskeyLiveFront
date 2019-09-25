import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

interface LiveInfo {
  username: string;
  created: string;
  title: string;
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  liveInfo: LiveInfo[];
  apiUrl = environment.api;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  ngOnInit() {
    this.httpClient.get<LiveInfo[]>(`${this.apiUrl}/api/streams/list`)
      .subscribe(data => {
        this.liveInfo = data;
      })
  }
}
