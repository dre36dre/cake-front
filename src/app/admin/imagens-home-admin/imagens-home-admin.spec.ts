import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagensHomeAdmin } from './imagens-home-admin';

describe('ImagensHomeAdmin', () => {
  let component: ImagensHomeAdmin;
  let fixture: ComponentFixture<ImagensHomeAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagensHomeAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(ImagensHomeAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
