import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListOperarioViewComponent } from './task-list-operario-view.component';

describe('TaskListOperarioViewComponent', () => {
  let component: TaskListOperarioViewComponent;
  let fixture: ComponentFixture<TaskListOperarioViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListOperarioViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskListOperarioViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
