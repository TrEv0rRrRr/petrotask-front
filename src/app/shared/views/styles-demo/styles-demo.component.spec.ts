import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StylesDemoComponent } from './styles-demo.component';

describe('StylesDemoComponent', () => {
  let component: StylesDemoComponent;
  let fixture: ComponentFixture<StylesDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StylesDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StylesDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
