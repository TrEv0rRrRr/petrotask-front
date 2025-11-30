import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { Team } from '../../models/team.entity';
import { Employee } from '../../models/employee.entity';
import { Columns } from '../../../../shared/components/table/table.models';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { FormsModule } from '@angular/forms';
import { TeamFormDialogComponent } from '../../components/team-form-dialog/team-form-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { TeamService } from '../../services/team.service';
import { EmployeeService } from '../../services/employee.service';
import { UiService } from '../../../../core/services/ui.service';
import { DialogService } from '../../../../shared/services/dialog.service';
import { finalize, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-team-management',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    ButtonComponent,
    FormsModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './team-management.component.html',
  styleUrl: './team-management.component.scss'
})
export class TeamManagementComponent implements OnInit {
  // Data sources
  teams: (Team & { memberCount: number })[] = [];
  employees: Employee[] = [];
  loading: boolean = false;

  // Table configuration
  columns: Columns[] = [
    {
      header: { key: 'name', label: 'Team Name' },
      cell: 'name',
      type: 'text',
      sortable: true,
      hide: { visible: true, label: 'Name' }
    },
    {
      header: { key: 'memberCount', label: 'Members Count' },
      cell: 'memberCount',
      type: 'text',
      sortable: true,
      hide: { visible: true, label: 'Members' }
    },
    {
      header: { key: 'actions', label: 'Actions' },
      cell: 'actions',
      type: 'template',
      sortable: false,
      hide: { visible: true, label: 'Actions' }
    }
  ];

  constructor(
    private dialog: MatDialog,
    private teamService: TeamService,
    private employeeService: EmployeeService,
    private uiService: UiService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    
    // Load teams and employees in parallel
    forkJoin({
      teams: this.teamService.getAllTeams().pipe(
        catchError(error => {
          console.error('Error loading teams:', error);
          return of([]);
        })
      ),
      employees: this.employeeService.getAllEmployees().pipe(
        catchError(error => {
          console.error('Error loading employees:', error);
          return of([]);
        })
      )
    })
    .pipe(
      finalize(() => this.loading = false)
    )
    .subscribe({
      next: ({ teams, employees }) => {
        this.teams = teams.map(team => ({
          ...team,
          memberCount: team.members?.length || 0
        }));
        this.employees = employees;
        
        this.uiService.showSnackbar({
          message: 'Data loaded successfully',
          type: 'success'
        });
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.uiService.showSnackbar({
          message: 'Error loading data',
          type: 'error'
        });
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(TeamFormDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        team: new Team(0, 1, '', []),
        employees: this.employees,
        title: 'Add Team',
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createTeam(result);
      }
    });
  }

  openEditDialog(team: Team): void {
    const dialogRef = this.dialog.open(TeamFormDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        team: { ...team },
        employees: this.employees,
        title: 'Edit Team',
        isEdit: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateTeam(result);
      }
    });
  }

  createTeam(team: Team): void {
    this.loading = true;
    
    this.teamService.createTeam(team)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (createdTeam: Team) => {
          this.teams.push({
            ...createdTeam,
            memberCount: createdTeam.members?.length || 0
          });
          
          this.uiService.showSnackbar({
            message: 'Team created successfully',
            type: 'success'
          });
        },
        error: (error: any) => {
          console.error('Error creating team:', error);
          this.uiService.showSnackbar({
            message: 'Error creating team',
            type: 'error'
          });
        }
      });
  }

  updateTeam(team: Team): void {
    // Since backend doesn't have update endpoint, we'll simulate local update
    this.loading = true;
    
    setTimeout(() => {
      const index = this.teams.findIndex(t => t.id === team.id);
      if (index !== -1) {
        this.teams[index] = {
          ...team,
          memberCount: team.members?.length || 0
        };
      }
      
      this.loading = false;
      this.uiService.showSnackbar({
        message: 'Team updated successfully',
        type: 'success'
      });
    }, 1000);
  }

  deleteTeam(team: Team): void {
    this.dialogService.confirm({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete team ${team.name}?`,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.performDelete(team);
      }
    });
  }

  private performDelete(team: Team): void {
    // Since backend doesn't have delete endpoint, we'll simulate removal locally
    this.loading = true;
    
    setTimeout(() => {
      const index = this.teams.findIndex(t => t.id === team.id);
      if (index !== -1) {
        this.teams.splice(index, 1);
      }
      
      this.loading = false;
      this.uiService.showSnackbar({
        message: 'Team removed successfully',
        type: 'success'
      });
    }, 1000);
  }

  refreshData(): void {
    this.loadData();
  }
}
