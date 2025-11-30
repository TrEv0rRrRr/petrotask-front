import { Component } from '@angular/core';
import {InputComponent} from "../../../../shared/components/input/input.component";
import {FormsModule} from '@angular/forms';
import {SelectorComponent} from '../../../../shared/components/selector/selector.component';
import {ButtonComponent} from '../../../../shared/components/button/button.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-task-execution-view',
  imports: [
    InputComponent,
    FormsModule,
    SelectorComponent,
    ButtonComponent
  ],
  templateUrl: './task-execution-view.component.html',
  styleUrl: './task-execution-view.component.scss'
})
export class TaskExecutionViewComponent {
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
    console.log('Start time: ', this.startTime);
  }
  onEndTimeChange(value: string): void {
    this.endTime = value;
    console.log('End time: ', this.endTime);
  }
  onMachineChange(value: string | string[]): void {
    this.machine = Array.isArray(value) ? value[0] || '' : value || '';
    console.log('Machine: ', this.machine);
  }
  onSquadChange(value: string | string[]): void {
    this.squad = Array.isArray(value) ? value[0] || '' : value || '';
    console.log('Squad: ', this.squad);
  }
  onCommentChange(value: string): void {
    this.comment = value;
    console.log('Comments: ', this.comment);
  }

  onDisabledButton() {
    return !(this.startTime.length !== 0 &&
      this.endTime.length !== 0 &&
      this.machine.length !== 0 &&
      this.squad.length !== 0);
  }

  onSaveInformation(): void {
    console.log('Save information');
    this.dialogRef.close();
  }
}
