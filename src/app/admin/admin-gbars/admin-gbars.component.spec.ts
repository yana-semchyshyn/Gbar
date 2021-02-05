import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGbarsComponent } from './admin-gbars.component';

describe('AdminGbarsComponent', () => {
  let component: AdminGbarsComponent;
  let fixture: ComponentFixture<AdminGbarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminGbarsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGbarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
