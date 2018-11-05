import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import * as Hls from 'hls.js';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  // ユーザ名ランダムカラー一覧
  user_colors = [
    '#f6e58d', '#ffbe76', '#ff7979', '#badc58', '#dff9fb', '#7ed6df', '#e056fd', '#c7ecee', '#f9ca24',
    '#55efc4', '#81ecec', '#74b9ff', '#a29bfe', '#dfe6e9', '#00cec9', '#ffeaa7', '#fab1a0', '#fd79a8'
  ];

  // ダミーコメント
  comments = [
    {
      id: 'AureoleArk',
      body: 'しゅいろたその太ももかわいいな',
      date: 1541438071
    }, {
      id: 'htss',
      body: 'うわ、エッチだ',
      date: 1541438071
    }, {
      id: 'aqz',
      body: 'BANされそう',
      date: 1541438071
    }, {
      id: 'park',
      body: 'えっっっっっっっっ',
      date: 1541438071
    }, {
      id: 'tm',
      body: 'もう少し上にカメラ移動して',
      date: 1541438071
    }, {
      id: 'nzws',
      body: 'スク水だと体のラインがよく見えるからいいね、次回挑戦してみようかな',
      date: 1541438071
    }, {
      id: 'M323',
      body: '配信終わったら即アーカイブ保存して家宝にするわ',
      date: 1541438071
    }, {
      id: 'hths',
      body: 'それ以上はまずいですよ！！',
      date: 1541438071
    }, {
      id: 'tearaikazuki',
      body: '可愛すぎるから蹴りあげたい',
      date: 1541438071
    }, {
      id: 'AureoleArk',
      body: 'やばｗｗｗ',
      date: 1541438071
    }, {
      id: 'DoutenP',
      body: 'ピアノとか弾かなくていいからカメラに近づいて',
      date: 1541438071
    }, {
      id: 'Simirall',
      body: 'もっと足開けや',
      date: 1541438071
    }, {
      id: 'mewl',
      body: '#保存したい がある',
      date: 1541438071
    }, {
      id: 'mamizu',
      body: '肌綺麗すぎる・・・ 何使ってるの?',
      date: 1541438071
    }
  ];

  @ViewChild('video')
  private video: ElementRef;

  constructor (private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(`https://stream1.arkjp.net/live/${params['id']}/index.m3u8`);
        hls.attachMedia(<HTMLVideoElement> this.video.nativeElement);
      }
    });
  }

}
