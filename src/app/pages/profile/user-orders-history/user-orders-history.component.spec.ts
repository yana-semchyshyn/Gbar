import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOrdersHistoryComponent } from './user-orders-history.component';

describe('UserOrdersHistoryComponent', () => {
  let component: UserOrdersHistoryComponent;
  let fixture: ComponentFixture<UserOrdersHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserOrdersHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOrdersHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
