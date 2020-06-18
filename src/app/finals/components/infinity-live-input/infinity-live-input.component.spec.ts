import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfinityLiveInputComponent } from './infinity-live-input.component';

describe('InfinityLiveInputComponent', () => {
  let component: InfinityLiveInputComponent;
  let fixture: ComponentFixture<InfinityLiveInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfinityLiveInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfinityLiveInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
