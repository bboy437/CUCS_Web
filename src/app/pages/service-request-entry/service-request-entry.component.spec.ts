import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRequestEntryComponent } from './service-request-entry.component';

describe('ServiceRequestEntryComponent', () => {
  let component: ServiceRequestEntryComponent;
  let fixture: ComponentFixture<ServiceRequestEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceRequestEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceRequestEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
