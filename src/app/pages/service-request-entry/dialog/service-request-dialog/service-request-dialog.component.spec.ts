import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestDialogComponent } from './service-request-dialog.component';

describe('ServiceRequestDialogComponent', () => {
  let component: ServiceRequestDialogComponent;
  let fixture: ComponentFixture<ServiceRequestDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceRequestDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
