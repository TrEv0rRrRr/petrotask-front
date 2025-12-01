import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { Activity } from '../../model/activity.entity';
import { Task } from '../../model/task.entity';
import { ActivityService } from '../../services/activity.service';
import { SegmentedTaskComponent } from '../segmented-task/segmented-task.component';

@Component({
  selector: 'app-activity-detail-view',
  imports: [
    SegmentedTaskComponent,
    NgForOf,
    ButtonComponent,
    DatePipe,
    InputComponent,
    FormsModule,
    NgIf,
    TranslateModule,
  ],
  templateUrl: './activity-detail-view.component.html',
  styleUrl: './activity-detail-view.component.scss',
})
export class ActivityDetailViewComponent implements OnInit {
  constructor(
    private cdr: ChangeDetectorRef,
    private activityService: ActivityService,
    private route: ActivatedRoute
  ) {}

  tasks: Task[] = [];
  activity: Activity = new Activity();
  activityId: number = 0;
  isLoading: boolean = false;

  ngOnInit(): void {
    // Obtener ID de la actividad desde la ruta
    this.route.params.subscribe((params) => {
      this.activityId = +params['id'];
      if (this.activityId) {
        this.loadActivity();
      }
    });
  }

  loadActivity(): void {
    this.isLoading = true;
    this.activityService.getActivityById(this.activityId).subscribe({
      next: (activity) => {
        this.activity = activity;
        this.tasks = activity.tasks || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading activity:', error);
        this.isLoading = false;
      },
    });
  }

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

    // Actualizar valores solo si se ingresaron
    if (this.activityCodeInput.trim() !== '')
      this.activity.activityCode = this.activityCodeInput;
    if (this.locationOriginInput.trim() !== '')
      this.activity.locationOrigin = Number(this.locationOriginInput);
    if (this.locationDestinationInput.trim() !== '')
      this.activity.locationDestination = Number(this.locationDestinationInput);
    if (this.zoneOriginInput.trim() !== '')
      this.activity.zoneOrigin = Number(this.zoneOriginInput);
    if (this.zoneDestinationInput.trim() !== '')
      this.activity.zoneDestination = Number(this.zoneDestinationInput);
    if (this.expectedTimeInput.trim() !== '')
      this.activity.expectedTime = new Date(this.expectedTimeInput);
    if (this.weekNumberInput.trim() !== '')
      this.activity.weekNumber = Number(this.weekNumberInput);
    if (this.statusInput.trim() !== '')
      this.activity.activityStatus = this.statusInput as
        | 'PLANNED'
        | 'IN_PROGRESS'
        | 'COMPLETED'
        | 'CANCELLED';
    if (this.descriptionInput.trim() !== '')
      this.activity.description = this.descriptionInput;

    // Guardar cambio de status en el backend si se modificó
    if (this.statusInput.trim() !== '') {
      this.activityService
        .updateActivityStatus(this.activity.id, this.activity.activityStatus)
        .subscribe({
          next: (updated: Activity) => {
            this.activity = updated;
            console.log('Activity status updated successfully');
          },
          error: (error: any) => {
            console.error('Error updating activity status:', error);
          },
        });
    }
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
