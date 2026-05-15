import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImagensHomeAdminComponent } from './imagens-home-admin.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ImagensHomeAdminComponent', () => {
  let component: ImagensHomeAdminComponent;
  let fixture: ComponentFixture<ImagensHomeAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ImagensHomeAdminComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ImagensHomeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
