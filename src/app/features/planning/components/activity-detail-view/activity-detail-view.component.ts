import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {SegmentedTaskComponent} from '../segmented-task/segmented-task.component';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import { Task } from '../../model/task.entity';
import { Activity } from '../../model/activity.entity';
import {ButtonComponent} from '../../../../shared/components/button/button.component';
import {InputComponent} from '../../../../shared/components/input/input.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-activity-detail-view',
  imports: [
    SegmentedTaskComponent,
    NgForOf,
    ButtonComponent,
    DatePipe,
    InputComponent,
    FormsModule,
    NgIf
  ],
  templateUrl: './activity-detail-view.component.html',
  styleUrl: './activity-detail-view.component.scss'
})
export class ActivityDetailViewComponent {

  constructor(private cdr: ChangeDetectorRef) {}

  tasks: Task[] = [ new Task(1, 'Task 1', 'Description 1', 'PENDING', 1), new Task(2, 'Task 2', 'Description 2', 'IN_PROGRESS', 2)];
  activity: Activity = new Activity(1, 'ACT001', 'Activity description', new Date(), 1, 'PENDING', 1, 1, 1, 2);

  showInputs: boolean = false;

  activityCodeInput: string = '';
  locationOriginInput: string = '';
  locationDestinationInput: string = '';
  zoneOriginInput: string = '';
  zoneDestinationInput: string = '';
  expectedTimeInput: string = '';
  weekNumberInput: string = '';
  statusInput: string = '';
  descriptionInput: string = '';

  toTaskSegmentationView() {
    // routear a Task Segmentation View
  }

  onEditActivity() {
    this.showInputs = false;
    this.cdr.detectChanges();
    if (this.activityCodeInput.trim() !== '') this.activity.activityCode = this.activityCodeInput;
    if (this.locationOriginInput.trim() !== '') this.activity.locationOrigin = Number(this.locationOriginInput);
    if (this.locationDestinationInput.trim() !== '') this.activity.locationDestination = Number(this.locationDestinationInput);
    if (this.zoneOriginInput.trim() !== '') this.activity.zoneOrigin = Number(this.zoneOriginInput);
    if (this.zoneDestinationInput.trim() !== '') this.activity.zoneDestination = Number(this.zoneDestinationInput);
    if (this.expectedTimeInput.trim() !== '') this.activity.expectedTime = new Date(this.expectedTimeInput);
    if (this.weekNumberInput.trim() !== '') this.activity.weekNumber = Number(this.weekNumberInput);
    if (this.statusInput.trim() !== '') this.activity.activityStatus = this.statusInput as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    if (this.descriptionInput.trim() !== '') this.activity.description = this.descriptionInput;
    console.log(this.activity);
  }

  onEnableInputs() {
    this.showInputs = true;
    this.cdr.detectChanges();
    this.activityCodeInput = '';
    this.locationOriginInput = '';
    this.locationDestinationInput = '';
    this.zoneOriginInput = '';
    this.zoneDestinationInput = '';
    this.expectedTimeInput = '';
    this.weekNumberInput = '';
    this.statusInput = '';
    this.descriptionInput = '';
  }

  onActivityCodeChange(value: string) {
    this.activityCodeInput = value;
  }

  onLocationOriginChange(value: string) {
    this.locationOriginInput = value;
  }

  onLocationDestinationChange(value: string) {
    this.locationDestinationInput = value;
  }

  onZoneOriginChange(value: string) {
    this.zoneOriginInput = value;
  }

  onZoneDestinationChange(value: string) {
    this.zoneDestinationInput = value;
  }

  onExpectedTimeChange(value: string) {
    this.expectedTimeInput = String(value);
  }

  onWeekNumberChange(value: string) {
    this.weekNumberInput = value;
  }

  onStatusChange(value: string) {
    this.statusInput = value;
  }

  onDescriptionChange(value: string) {
    this.descriptionInput = value;
  }
}
