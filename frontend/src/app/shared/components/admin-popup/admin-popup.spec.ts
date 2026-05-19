import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPopup } from './admin-popup';

describe('AdminPopup', () => {
  let component: AdminPopup;
  let fixture: ComponentFixture<AdminPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPopup],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPopup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
