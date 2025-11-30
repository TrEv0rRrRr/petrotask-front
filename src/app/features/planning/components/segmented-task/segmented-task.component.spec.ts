import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentedTaskComponent } from './segmented-task.component';

describe('SegmentedTaskComponent', () => {
  let component: SegmentedTaskComponent;
  let fixture: ComponentFixture<SegmentedTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SegmentedTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SegmentedTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
