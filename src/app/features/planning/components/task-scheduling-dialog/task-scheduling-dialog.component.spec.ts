import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSchedulingDialogComponent } from './task-scheduling-dialog.component';

describe('TaskSchedulingDialogComponent', () => {
  let component: TaskSchedulingDialogComponent;
  let fixture: ComponentFixture<TaskSchedulingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskSchedulingDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskSchedulingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
