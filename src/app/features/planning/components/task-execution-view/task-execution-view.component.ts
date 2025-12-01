import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { SelectorComponent } from '../../../../shared/components/selector/selector.component';

@Component({
  selector: 'app-task-execution-view',
  imports: [InputComponent, FormsModule, SelectorComponent, ButtonComponent],
  templateUrl: './task-execution-view.component.html',
  styleUrl: './task-execution-view.component.scss',
})
export class TaskExecutionViewComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  startTime: string = '';
  startTimeDisabled: boolean = false;
  endTime: string = '';
  endTimeDisabled: boolean = false;
  comment: string = '';
  commentDisabled: boolean = false;

  // esto dsp debe ser un input, solo ando probando
  machineList = ['maquinita 1', 'maquinita 2', 'maquinita 3'];
  machine: string = '';
  squadList = ['squad 1', 'squad 2', 'squad 3'];
  squad: string = '';

  constructor(public dialogRef: MatDialogRef<TaskExecutionViewComponent>) {}

  onStartTimeChange(value: string): void {
    this.startTime = value;
  }
  onEndTimeChange(value: string): void {
    this.endTime = value;
  }
  onMachineChange(value: string | string[]): void {
    this.machine = Array.isArray(value) ? value[0] || '' : value || '';
  }
  onSquadChange(value: string | string[]): void {
    this.squad = Array.isArray(value) ? value[0] || '' : value || '';
  }
  onCommentChange(value: string): void {
    this.comment = value;
  }

  onDisabledButton() {
    return !(
      this.startTime.length !== 0 &&
      this.endTime.length !== 0 &&
      this.machine.length !== 0 &&
      this.squad.length !== 0
    );
  }

  onSaveInformation(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
