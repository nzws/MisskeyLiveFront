import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveInfoCardComponent } from './live-info-card.component';

describe('LiveInfoCardComponent', () => {
  let component: LiveInfoCardComponent;
  let fixture: ComponentFixture<LiveInfoCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveInfoCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
