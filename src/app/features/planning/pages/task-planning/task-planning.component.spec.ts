import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskPlanningComponent } from './task-planning.component';

describe('TaskPlanningComponent', () => {
  let component: TaskPlanningComponent;
  let fixture: ComponentFixture<TaskPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskPlanningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
