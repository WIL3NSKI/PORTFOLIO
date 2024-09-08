import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TensorPage } from './tensor.page';

describe('TensorPage', () => {
  let component: TensorPage;
  let fixture: ComponentFixture<TensorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TensorPage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TensorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
