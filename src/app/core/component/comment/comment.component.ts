import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SessionService} from '../../service/session.service';
import {default as twemoji} from 'twemoji';
import {ActivatedRoute} from '@angular/router';
import {faVolumeMute, faVolumeUp} from '@fortawesome/free-solid-svg-icons';

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
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  faVolumeUp = faVolumeUp;
  faVolumeMute = faVolumeMute;

  @ViewChild('comments', { static: false }) comments: ElementRef;
  @Input() userId: string;
  staticSessionService = SessionService;
  ws: WebSocket;
  bouyomi = false;
  comment: string;
  isCommentWait = false;
  emojis: Map<string, string> = new Map();

  constructor(private httpClient: HttpClient, private route: ActivatedRoute) { }

  ngOnInit() {
    twemoji.size = 'svg';
    twemoji.ext = '.svg';
    if (this.userId) {
      this.init();
      return;
    }
    this.route.params.subscribe(params => {
      if (!params.id) {
        return;
      }
      this.userId = params.id;
      this.init();
    });
  }

  init() {
    this.initCustomEmoji();
    this.fetchOldComments();
    this.wsInit();
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

  wsInit() {
    this.ws = new WebSocket('wss://misskey.io/streaming');
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
      }, 2000);
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
      i: SessionService.token,
      text: `${this.comment} #MisskeyLive #ML${this.userId} \n https://live.misskey.io/@${this.userId}`,
      visibility: 'home',
      localOnly: false
    };
    this.httpClient.post('https://misskey.io/api/notes/create', data).subscribe();
    this.comment = '';
  }

  toggleBouyomi() {
    this.bouyomi = !this.bouyomi;
    this.bouyomiSpeech('MisskeyLiveと連携しました');
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
