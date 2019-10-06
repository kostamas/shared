import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpSideBarComponent } from './help-side-bar.component';

describe('HelpSideBarComponent', () => {
  let component: HelpSideBarComponent;
  let fixture: ComponentFixture<HelpSideBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpSideBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
