import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../core/service/session.service';
import { default as twemoji } from 'twemoji';

export interface Data {
  status: string;
  title?: string;
  description?: string;
  message?: string;
}

interface MisskeyEmoji {
  name: string;
  url: string;
}

interface MisskeyMeta {
  emojis: MisskeyEmoji[];
}

interface MisskeyNote {
  id: string;
  text: string | null;
  emojis: MisskeyEmoji[];
  user: {
    name: string | null;
    username: string;
    host: string | null;
    avatarUrl: string | null;
  };
}

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss']
})
export class LiveComponent implements OnInit {
  @ViewChild('comments', { static: false }) comments: ElementRef;

  video: SafeResourceUrl;
  userId = '404';
  userData: Data;
  isLogin = false;
  i: string;
  ws: WebSocket;
  bouyomi = true;
  comment: string;
  isCommentWait = false;
  emojis: Map<string, string> = new Map();

  constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute, private httpClient: HttpClient) {}

  ngOnInit() {
    twemoji.size = 'svg';
    twemoji.ext = '.svg';
    this.isLogin = SessionService.login;
    this.i = SessionService.token;
    this.initCustomEmoji();
    this.route.params.subscribe(params => {
      if (!params.id) {
        return;
      }
      this.userId = params.id;
      this.playerInit();
      this.fetchOldComments();
      this.wsInit();
    });
  }

  initCustomEmoji() {
    this.httpClient.post<MisskeyMeta>('https://misskey.io/api/meta', {}).subscribe(data => {
      data.emojis.forEach(emoji => {
        this.emojis.set(`:${emoji.name}:`, this.convertEmojiToHtml(emoji));
      })
    });
  }

  convertEmojiToHtml(emoji: MisskeyEmoji) {
    return `<img class="emoji" draggable="false" src="${emoji.url}" alt="${emoji.name}">`;
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
      this.ws.send(
        JSON.stringify({
          type: 'connect',
          body: {
            channel: 'hashtag',
            id: this.userId,
            params: {
              q: [[`ML${this.userId}`]]
            }
          }
        })
      );
    };

    this.ws.onclose = () => {
      setTimeout(() => {
        this.wsInit();
      }, 10000);
    };
    this.ws.onmessage = msg => {
      this.addComment(JSON.parse(msg.data).body.body as MisskeyNote, true);
    };
    this.ws.onerror = () => {
      this.ws.close();
    };
  }

  fetchOldComments() {
    this.httpClient
      .post<MisskeyNote[]>('https://misskey.io/api/notes/search-by-tag', {
        tag: `ML${this.userId}`
      })
      .subscribe(notes => {
        for (const note of notes.reverse()) {
          this.addComment(note, false);
        }
      });
  }

  addComment(note: MisskeyNote, bouyomi: boolean) {
    if (!note.text) {
      return;
    }
    const text = note.text
      .replace(`#ML${this.userId}`, '')
      .replace('#MisskeyLive', '')
      .replace(`https://live.misskey.io/${this.userId}`, '')
      .replace(`https://live.misskey.io/@${this.userId}`, '');
    const userName = note.user.name === null ? note.user.username : note.user.name;
    const userNameView = note.user.host === null ? userName : `${userName}@${note.user.host}`;
    this.writeComment(note.user.avatarUrl, userNameView, text, note.emojis, bouyomi);
  }

  writeComment(avatar, name, comment, emojis: MisskeyEmoji[], bouyomi: boolean) {
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
    nameEl.innerHTML = this.replaceEmoji(this.escapeHtml(name), emojis);
    bodyEl.appendChild(nameEl);
    const commentEl = document.createElement('p');
    commentEl.innerHTML = this.replaceEmoji(this.escapeHtml(comment), emojis);
    bodyEl.appendChild(commentEl);
    twemoji.parse(bodyEl);
    li.appendChild(bodyEl);
    this.comments.nativeElement.appendChild(li);
    this.cleanComment();
    this.comments.nativeElement.scrollTop = this.comments.nativeElement.scrollHeight;
    if (!this.bouyomi || !bouyomi) {
      return;
    }
    this.bouyomiSpeech(comment + ' ' + name);
  }

  replaceEmoji(text: string, emojis: MisskeyEmoji[]) {
    emojis.forEach(emoji => {
      console.log(text);
      text = text.split(`:${emoji.name}:`).join(this.convertEmojiToHtml(emoji));
    });
    this.emojis.forEach((url, id) => {
      text = text.split(id).join(url);
    });
    return text;
  }

  escapeHtml(text: string) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/`/g, '&#x60;');
  }

  cleanComment() {
    const node = this.comments.nativeElement.children;
    if (node.length < 100) {
      return;
    }
    node[0].remove();
  }

  sendComment() {
    this.comment = this.comment.trim();
    if (!this.comment) {
      return;
    }
    this.isCommentWait = true;
    setTimeout(() => {
      this.isCommentWait = false;
    }, 3000);
    const data = {
      i: this.i,
      text: `${this.comment} #MisskeyLive #ML${this.userId} \n https://live.misskey.io/@${this.userId}`,
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
    };
  }
}
