import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChangpasswordComponent } from './user-changpassword.component';

describe('UserChangpasswordComponent', () => {
  let component: UserChangpasswordComponent;
  let fixture: ComponentFixture<UserChangpasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserChangpasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserChangpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
