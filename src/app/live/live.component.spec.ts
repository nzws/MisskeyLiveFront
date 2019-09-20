import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveComponent } from './live.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {FormsModule} from '@angular/forms';

describe('LiveComponent', () => {
  let component: LiveComponent;
  let fixture: ComponentFixture<LiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LiveComponent],
      imports: [RouterTestingModule, HttpClientModule, FormsModule],
      providers: [CookieService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
