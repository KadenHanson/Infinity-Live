import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfinityLiveNavComponent } from './infinity-live-nav.component';

describe('InfinityLiveNavComponent', () => {
  let component: InfinityLiveNavComponent;
  let fixture: ComponentFixture<InfinityLiveNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfinityLiveNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfinityLiveNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
