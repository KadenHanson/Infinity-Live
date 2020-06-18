import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SemiFinalMenuComponent } from './semi-final-menu.component';

describe('SemiFinalMenuComponent', () => {
  let component: SemiFinalMenuComponent;
  let fixture: ComponentFixture<SemiFinalMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SemiFinalMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SemiFinalMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
