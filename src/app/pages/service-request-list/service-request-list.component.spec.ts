import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestListComponent } from './service-request-list.component';

describe('ServiceRequestListComponent', () => {
  let component: ServiceRequestListComponent;
  let fixture: ComponentFixture<ServiceRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceRequestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
