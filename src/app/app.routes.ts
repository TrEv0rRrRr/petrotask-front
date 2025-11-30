import { Routes } from '@angular/router';
import { ComponentsDemoComponent } from './shared/views/components-demo/components-demo.component';
import {PageNotFoundComponent} from './public/pages/page-not-found/page-not-found.component';
import {RegisterComponent} from './features/iam/pages/register/register.component';
import {AccountCreationComponent} from './core/registration/views/account-creation/account-creation.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import {PaymentInformationComponent} from './core/registration/views/payment-information/payment-information.component';
import { EquipmentManagementComponent } from './features/resources/pages/equipment-management/equipment-management.component';
import { EmployeeManagementComponent } from './features/resources/pages/employee-management/employee-management.component';
import { LocationManagementComponent } from './features/resources/pages/location-management/location-management.component';
import { TeamManagementComponent } from './features/resources/pages/team-management/team-management.component';
import { ActivityManagementComponent } from './features/planning/pages/activity-management/activity-management.component';
import {LoginComponent} from './features/iam/pages/login/login.component';
import {
  ActivityDetailViewComponent} from './features/planning/components/activity-detail-view/activity-detail-view.component';
import {
  ExecutionHistoryViewComponent
} from './features/planning/components/execution-history-view/execution-history-view.component';
import {ReportsViewComponent} from './features/planning/components/reports-view/reports-view.component';
import {
  TaskExecutionViewComponent
} from './features/planning/components/task-execution-view/task-execution-view.component';
import {
  TaskListOperarioViewComponent
} from './features/planning/components/task-list-operario-view/task-list-operario-view.component';
import {CompanySettingsComponent} from './features/iam/pages/company-settings/company-settings.component';
import {PasswordRecoveryComponent} from './features/iam/pages/password-recovery/password-recovery.component';
import {SelectRoleComponent} from './features/iam/pages/select-role/select-role.component';
import {UserManagementComponent} from './features/iam/pages/user-management/user-management.component';
import { TaskPlanningComponent } from './features/planning/pages/task-planning/task-planning.component';
import {ActivitiesListComponent} from './features/executions/pages/activities-list/activities-list.component';
import {ProfileViewComponent} from './profile-view/profile-view.component';
import {HomeComponent} from './core/registration/views/home/home.component';
import {ActivityListComponent} from './features/planning/components/activity-list/activity-list.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DashboardComponent } from './features/executions/pages/dashboard/dashboard.component';
import { PositionManagementComponent } from './features/resources/pages/position-management/position-management.component';
import { TaskManagementComponent } from './features/tasks/pages/task-management/task-management.component';
import { MyTasksComponent } from './features/field-operations/pages/my-tasks/my-tasks.component';
import { SafetyMonitoringComponent } from './features/safety/pages/safety-monitoring/safety-monitoring.component';
import { IncidentReportComponent } from './features/planning/pages/incident-report/incident-report.component';
import { PhotoEvidenceComponent } from './features/field-operations/pages/photo-evidence/photo-evidence.component';
import { SafetyAlertsComponent } from './features/field-operations/pages/safety-alerts/safety-alerts.component';
export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'payment', component: PaymentInformationComponent },
      { path: 'account', component: AccountCreationComponent },
      { path: 'password-recovery', component: PasswordRecoveryComponent },
    ]
  },
  {
    path: 'petrotask',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'profile',                      component: ProfileViewComponent},
      { path: 'dashboard',                    component: DashboardComponent},
      { path: 'home',                         component: HomeComponent},
      { path: 'equipments-management',        component: EquipmentManagementComponent},
      { path: 'employee-management',          component: EmployeeManagementComponent},
      { path: 'location-management',          component: LocationManagementComponent},
      { path: 'position-management',          component: PositionManagementComponent},
      { path: 'teams-management',             component: TeamManagementComponent},
      { path: 'activity-management',          component: ActivityManagementComponent},
      { path: 'task-management',              component: TaskManagementComponent},
      { path: 'my-tasks',                     component: MyTasksComponent},
      { path: 'activities-list',              component: ActivitiesListComponent},
      { path: 'task-planning',                component: TaskPlanningComponent},
      { path: 'users',                        component: UserManagementComponent},
      { path: 'execution-history',            component: ExecutionHistoryViewComponent},
      { path: 'task-list-operario',           component: TaskListOperarioViewComponent},
      { path: 'company-settings',             component: CompanySettingsComponent},
      { path: 'safety-monitoring',            component: SafetyMonitoringComponent},
      { path: 'reports',                        component: ReportsViewComponent},
      { path: 'incident-reporting',            component: IncidentReportComponent},
      { path: 'photo-evidence',                 component: PhotoEvidenceComponent},
      { path: 'safety-alerts',                  component: SafetyAlertsComponent},
      // Nuevas rutas para el menú reorganizado del admin
      { path: 'task-assignment',                component: TaskManagementComponent}, // Reutilizar componente existente
      { path: 'alert-history',                  component: SafetyAlertsComponent}, // Reutilizar componente existente
      { path: 'demo',                           component: ComponentsDemoComponent},
      { path: '**',                             component: PageNotFoundComponent}
    ]
  },
  { path: 'demo',               component: ComponentsDemoComponent},
  { path: '**',                 component: PageNotFoundComponent }
];
