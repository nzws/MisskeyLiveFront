import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {SessionService} from '../core/service/session.service';

export interface Data {
  status: string;
  title?: string;
  description?: string;
  tag?: string;
  message?: string;
}

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss']
})
export class LiveComponent implements OnInit {
  @ViewChild('comments', {static: false}) comments : ElementRef;

  video: SafeResourceUrl;
  userId = '404';
  userData: Data;
  isLogin = false;
  i: string;
  ws: WebSocket;
  bouyomi = true;
  comment: string;

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private sessionService: SessionService
  ) {
  }

  ngOnInit() {
    this.isLogin = this.sessionService.isLogin();
    this.i = this.sessionService.getToken();
    this.route.params.subscribe(params => {
      if (!params.id) {
        return;
      }
      this.userId = params.id;
      this.playerInit();
      this.wsInit();
    });
    if (!environment.production) {
      setTimeout(() => {
        for (let i = 0; i < 50; i++) {
          setTimeout(() => {
            this.writeComment(null, 'testさん', i);
          }, i * 100);
        }
      }, 3000);
    }
  }

  playerInit() {
    // load player
    this.video = this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.api}/embed/${this.userId}`);

    // load user data
    this.httpClient.get<Data>(`${environment.api}/api/data/${this.userId}`).subscribe(data => {
      if (data.status === 'OK') {
        this.userData = data;
      } else {
        this.userData = {
          status: data.status,
          title: 'User not found.',
          description: data.message
        };
      }
    });
  }

  wsInit() {
    this.ws = new WebSocket('wss://misskey.io/streaming');
    this.bouyomiSpeech('MisskeyLiveと連携しました');

    this.ws.onopen = () => {
      this.ws.send(JSON.stringify({
        type: 'connect',
        body: {
          channel: 'hashtag',
          id: this.userId,
          params: {
            q: [[`ML${this.userId}`]]
          }
        }
      }));
    };

    this.ws.onclose = () => {
      setTimeout(() => {
        this.wsInit();
      }, 10000)
    };
    this.ws.onmessage = (msg) => {
      const tempChat = JSON.parse(msg.data).body.body;
      if (!tempChat.text) {
        return;
      }
      const text = tempChat.text.replace(`#ML${this.userId}`, '').replace('#MisskeyLive', '');
      this.writeComment(tempChat.user.avatarUrl, tempChat.user.name, text);
    };
    this.ws.onerror = () => {
      this.ws.close();
    };
  }

  writeComment(avatar, name, comment) {
    const li = document.createElement('li');
    li.classList.add('media', 'comment', 'my-1');
    const img = document.createElement('img');
    img.classList.add('mr-3', 'rounded-circle');
    img.src = avatar;
    img.width = 48;
    li.appendChild(img);
    const bodyEl = document.createElement('div');
    bodyEl.classList.add('media-body');
    const nameEl = document.createElement('h6');
    nameEl.classList.add('m-0');
    nameEl.textContent = name;
    bodyEl.appendChild(nameEl);
    const commentEl = document.createElement('p');
    commentEl.textContent = comment;
    bodyEl.appendChild(commentEl);
    li.appendChild(bodyEl);
    this.comments.nativeElement.appendChild(li);
    this.cleanComment();
    this.comments.nativeElement.scrollTop = this.comments.nativeElement.scrollHeight;
    if (!this.bouyomi) {
      return
    }
    this.bouyomiSpeech(comment + ' ' + name);
  }

  cleanComment() {
    const node = this.comments.nativeElement.children;
    if (node.length < 100) {
      return;
    }
    node[0].remove();
  }

  sendComment() {
    const data = {
      i: this.i,
      text: this.comment + ' #MisskeyLive #ML' + this.userId,
      visibility: 'public',
      localOnly: false
    };
    this.httpClient.post('https://misskey.io/api/notes/create', data).subscribe();
    this.comment = '';
  }

  bouyomiSpeech(text: string) {
    if (!this.bouyomi) {
      return;
    }
    const socket = new WebSocket('ws://localhost:50002/');
    socket.onerror = () => {
      this.bouyomi = false;
    };
    socket.onopen = () => {
      socket.send('-1<bouyomi>-1<bouyomi>-1<bouyomi>0<bouyomi>' + text);
    }
  }
}
