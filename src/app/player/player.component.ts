import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import * as Hls from 'hls.js';
import {PlayerRoutingModule} from './player-routing.module';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

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
