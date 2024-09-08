import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperSliderComponent } from './super-slider.component';

describe('SuperSliderComponent', () => {
  let component: SuperSliderComponent;
  let fixture: ComponentFixture<SuperSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperSliderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuperSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
