import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskExecutionViewComponent } from './task-execution-view.component';

describe('TaskExecutionViewComponent', () => {
  let component: TaskExecutionViewComponent;
  let fixture: ComponentFixture<TaskExecutionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskExecutionViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskExecutionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
