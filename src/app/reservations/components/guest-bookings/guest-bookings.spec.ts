import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestBookings } from './guest-bookings';

describe('GuestBookings', () => {
  let component: GuestBookings;
  let fixture: ComponentFixture<GuestBookings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestBookings],
    }).compileComponents();

    fixture = TestBed.createComponent(GuestBookings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
