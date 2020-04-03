import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageDialogLoginComponent } from './message-dialog-login.component';

describe('MessageDialogLoginComponent', () => {
  let component: MessageDialogLoginComponent;
  let fixture: ComponentFixture<MessageDialogLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageDialogLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageDialogLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
