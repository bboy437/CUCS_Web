import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemUserListComponent } from './system-user-list.component';

describe('SystemUserListComponent', () => {
  let component: SystemUserListComponent;
  let fixture: ComponentFixture<SystemUserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemUserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
