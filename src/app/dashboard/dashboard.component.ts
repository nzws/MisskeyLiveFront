import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SessionService} from '../core/service/session.service';
import {environment} from '../../environments/environment';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';

interface ArchiveList {
  id: string;
  title: string;
  timestamp: string;
  thumbnail: string;
  duration: number;
}

interface UserData {
  i?: string;
  server?: string;
  live_token?: string;
  title: string;
  description: string;
  auto_post: boolean;
  post_text: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('title', {static: false}) title: ElementRef;
  @ViewChild('desc', {static: false}) desc: ElementRef;
  @ViewChild('updated', {static: false}) updated: SwalComponent;

  video: SafeResourceUrl;
  userName: string;
  userData: UserData;
  archiveData: ArchiveList[] = [];

  constructor(
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer,
  ) {
  }

  ngOnInit() {
    if (!SessionService.user) {
      return;
    }
    this.userName = SessionService.user.username;
    this.video = this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.api}/embed/${this.userName}`);
    this.httpClient.get<UserData>(`${environment.api}/api/data/${this.userName}?i=${SessionService.token}`)
      .subscribe(data => {
        this.userData = data;
      });
    this.httpClient.get<ArchiveList[]>(`${environment.api}/api/archives/list/${this.userName}?i=${SessionService.token}`)
      .subscribe(data => {
        this.archiveData = data;
      });
  }

  updateData() {
    const data: UserData = {
      i: SessionService.token,
      title: this.title.nativeElement.value,
      description: this.desc.nativeElement.value,
      auto_post: this.userData.auto_post,
      post_text: this.userData.post_text,
    };

    this.httpClient.post(`${environment.api}/api/user/edit`, data)
      .subscribe(() => {
        this.updated.fire();
      });
  }

  updatePublicStatus(id: string, status: boolean) {
    const data = {
      i: SessionService.token,
      id,
      public: status
    };
    this.httpClient.post(`${environment.api}/api/archives/edit`, data).subscribe();
  }
}
