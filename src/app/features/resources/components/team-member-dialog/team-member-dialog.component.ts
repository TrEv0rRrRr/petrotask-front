import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { finalize, forkJoin } from 'rxjs';
import { UiService } from '../../../../core/services/ui.service';
import { Employee } from '../../models/employee.entity';
import { TeamMember } from '../../models/team-member.entity';
import { Team } from '../../models/team.entity';
import { EmployeeService } from '../../services/employee.service';
import { TeamService } from '../../services/team.service';

@Component({
  selector: 'app-team-member-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
  ],
  templateUrl: './team-member-dialog.component.html',
  styleUrl: './team-member-dialog.component.scss',
})
export class TeamMemberDialogComponent implements OnInit {
  memberForm: FormGroup;
  team: Team;
  allEmployees: Employee[] = [];
  currentMembers: (TeamMember & { employeeName?: string })[] = [];
  availableEmployees: Employee[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TeamMemberDialogComponent>,
    private teamService: TeamService,
    private employeeService: EmployeeService,
    private uiService: UiService,
    @Inject(MAT_DIALOG_DATA) public data: { team: Team }
  ) {
    this.team = data.team;

    this.memberForm = this.fb.group({
      employeeId: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    // Load both employees and fresh team data to get updated members list
    forkJoin({
      employees: this.employeeService.getAllEmployees(),
      team: this.teamService.getTeamById(this.team.id),
    })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: ({ employees, team }) => {
          this.allEmployees = employees;
          // Update team reference with fresh data
          this.team = team;
          // Map members with employee names
          this.currentMembers = (team.members || []).map(
            (member: TeamMember) => ({
              ...member,
              employeeName: this.getEmployeeName(member.employeeId),
            })
          );
          this.updateAvailableEmployees();
        },
        error: (error) => {
          console.error('Error loading data:', error);
          this.uiService.showSnackbar({
            message: 'Error loading team data',
            type: 'error',
          });
        },
      });
  }

  getEmployeeName(employeeId: number): string {
    const employee = this.allEmployees.find((e) => e.id === employeeId);
    return employee ? `${employee.name} ${employee.lastName}` : 'Unknown';
  }

  updateAvailableEmployees(): void {
    const memberEmployeeIds = this.currentMembers.map((m) => m.employeeId);
    this.availableEmployees = this.allEmployees.filter(
      (emp) => !memberEmployeeIds.includes(emp.id)
    );
  }

  addMember(): void {
    if (this.memberForm.invalid) {
      this.uiService.showSnackbar({
        message: 'Please select an employee',
        type: 'error',
      });
      return;
    }

    this.loading = true;
    const employeeId = this.memberForm.value.employeeId;

    // Create TeamMember with only employeeId (backend only needs this)
    const newMember = new TeamMember(0, this.team.id, employeeId);

    this.teamService.addTeamMemberToTeam(this.team.id, newMember).subscribe({
      next: (createdMember) => {
        this.uiService.showSnackbar({
          message: 'Member added successfully',
          type: 'success',
        });
        this.memberForm.reset();
        // Reload to get updated members list from backend
        this.loadData();
      },
      error: (error) => {
        console.error('Error adding member:', error);
        this.loading = false;
        this.uiService.showSnackbar({
          message: 'Error adding member',
          type: 'error',
        });
      },
    });
  }

  removeMember(member: TeamMember): void {
    this.loading = true;

    this.teamService.deleteTeamMember(this.team.id, member.id).subscribe({
      next: () => {
        this.uiService.showSnackbar({
          message: 'Member removed successfully',
          type: 'success',
        });
        // Reload to get updated members list from backend
        this.loadData();
      },
      error: (error) => {
        console.error('Error removing member:', error);
        this.loading = false;
        this.uiService.showSnackbar({
          message: 'Error removing member',
          type: 'error',
        });
      },
    });
  }

  close(): void {
    this.dialogRef.close(true); // Return true to indicate changes were made
  }
}
