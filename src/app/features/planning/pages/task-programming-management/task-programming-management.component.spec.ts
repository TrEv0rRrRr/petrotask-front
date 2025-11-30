import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { TaskProgrammingManagementComponent } from './task-programming-management.component';
import { TaskProgrammingService } from '../../services/task-programming.service';
import { TaskService } from '../../services/task.service';
import { ActivityService } from '../../services/activity.service';
import { DialogService } from '../../../../shared/services/dialog.service';
import { LocalStorageService } from '../../../../core/services/local-storage.service';

describe('TaskProgrammingManagementComponent', () => {
  let component: TaskProgrammingManagementComponent;
  let fixture: ComponentFixture<TaskProgrammingManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TaskProgrammingManagementComponent,
        NoopAnimationsModule,
        MatSnackBarModule,
        MatDialogModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: TaskProgrammingService, useValue: {} },
        { provide: TaskService, useValue: {} },
        { provide: ActivityService, useValue: {} },
        { provide: DialogService, useValue: {} },
        { provide: LocalStorageService, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskProgrammingManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 