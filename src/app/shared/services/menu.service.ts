import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { Roles } from 'src/app/features/iam/models/roles.enum';
import { AuthenticationService } from 'src/app/features/iam/services/authentication.service';
import { SidebarMenuItem } from '../components/sidebar/sidebar.component';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  router = inject(Router);
  authService = inject(AuthenticationService);
  localStorageService = inject(LocalStorageService);

  private adminMenuItems: SidebarMenuItem[] = [
    {
      id: 'home',
      label: 'menu.home',
      icon: 'home',
      route: '/petrotask/home',
    },
    {
      id: 'task-planning',
      label: 'menu.task-planning',
      icon: 'schedule',
      route: '/petrotask/task-planning',
    },
    {
      id: 'task-management',
      label: 'menu.task-management',
      icon: 'assignment',
      children: [
        {
          id: 'activities-list',
          label: 'menu.tasks-list',
          icon: 'list_alt',
          route: '/petrotask/activities-list',
        },
        {
          id: 'task-assignment',
          label: 'menu.task-assignment',
          icon: 'assignment_ind',
          route: '/petrotask/task-assignment',
        },
      ],
    },
    {
      id: 'critical-tasks',
      label: 'menu.critical-tasks',
      icon: 'warning',
      route: '/petrotask/activity-management',
    },
    {
      id: 'alert-management',
      label: 'menu.alert-management',
      icon: 'notifications',
      children: [
        {
          id: 'safety-monitoring',
          label: 'menu.safety-monitoring',
          icon: 'security',
          route: '/petrotask/safety-monitoring',
        },
        {
          id: 'alert-history',
          label: 'menu.alert-history',
          icon: 'history',
          route: '/petrotask/alert-history',
        },
      ],
    },
    {
      id: 'reports',
      label: 'menu.reports',
      icon: 'assessment',
      route: '/petrotask/reports',
    },
    {
      id: 'execution-history',
      label: 'menu.execution-history',
      icon: 'history',
      route: '/petrotask/execution-history',
    },
    {
      id: 'system-management',
      label: 'menu.system-management',
      icon: 'admin_panel_settings',
      children: [
        {
          id: 'users',
          label: 'menu.users',
          icon: 'groups',
          route: '/petrotask/users',
        },
        {
          id: 'equipments-management',
          label: 'menu.equipments-management',
          icon: 'precision_manufacturing',
          route: '/petrotask/equipments-management',
        },
        {
          id: 'employee-management',
          label: 'menu.employee-management',
          icon: 'engineering',
          route: '/petrotask/employee-management',
        },
        {
          id: 'position-management',
          label: 'menu.position-management',
          icon: 'work',
          route: '/petrotask/position-management',
        },
        {
          id: 'location-management',
          label: 'menu.location-management',
          icon: 'location_on',
          route: '/petrotask/location-management',
        },
        {
          id: 'teams-management',
          label: 'menu.teams-management',
          icon: 'group',
          route: '/petrotask/teams-management',
        },
        {
          id: 'settings',
          label: 'menu.settings',
          icon: 'settings',
          route: '/petrotask/company-settings',
        },
      ],
    },
  ];

  private operarioMenuItems: SidebarMenuItem[] = [
    {
      id: 'home',
      label: 'menu.home',
      icon: 'home',
      route: '/petrotask/home',
    },
    {
      id: 'my-tasks',
      label: 'menu.my-tasks',
      icon: 'assignment',
      route: '/petrotask/my-tasks',
    },
    {
      id: 'incident-reporting',
      label: 'menu.incident-reporting',
      icon: 'report_problem',
      route: '/petrotask/incident-reporting',
    },
    {
      id: 'photo-evidence',
      label: 'menu.photo-evidence',
      icon: 'camera_alt',
      route: '/petrotask/photo-evidence',
    },
    {
      id: 'critical-tasks',
      label: 'menu.critical-tasks',
      icon: 'warning',
      route: '/petrotask/activity-management',
    },
    {
      id: 'safety-alerts',
      label: 'menu.safety-alerts',
      icon: 'warning',
      route: '/petrotask/safety-alerts',
    },
  ];

  private supervisorMenuItems: SidebarMenuItem[] = [
    {
      id: 'home',
      label: 'menu.home',
      icon: 'home',
      route: '/petrotask/home',
    },
    {
      id: 'dashboard',
      label: 'menu.dashboard',
      icon: 'dashboard',
      route: '/petrotask/dashboard',
    },
    {
      id: 'task-planning',
      label: 'menu.task-planning',
      icon: 'schedule',
      route: '/petrotask/task-planning',
    },
    {
      id: 'team-management',
      label: 'menu.team-management',
      icon: 'group',
      route: '/petrotask/teams-management',
    },
    {
      id: 'equipments-management',
      label: 'menu.petroleum-equipment',
      icon: 'precision_manufacturing',
      route: '/petrotask/equipments-management',
    },
    {
      id: 'location-management',
      label: 'menu.petroleum-locations',
      icon: 'location_on',
      route: '/petrotask/location-management',
    },
    {
      id: 'critical-tasks',
      label: 'menu.critical-tasks',
      icon: 'warning',
      route: '/petrotask/activity-management',
    },
    {
      id: 'safety-monitoring',
      label: 'menu.safety-monitoring',
      icon: 'security',
      route: '/petrotask/safety-monitoring',
    },
    {
      id: 'incident-management',
      label: 'menu.incident-management',
      icon: 'report_problem',
      route: '/petrotask/incident-management',
    },
    {
      id: 'reports',
      label: 'menu.reports',
      icon: 'assessment',
      route: '/petrotask/reports',
    },
  ];

  constructor() {}

  getMenuItems(): Observable<SidebarMenuItem[]> {
    if (this.localStorageService.hasKey('menuItems')) {
      const menuItems: SidebarMenuItem[] =
        this.localStorageService.getItem('menuItems');
      return of(menuItems);
    }
    return this.authService.currentRoles.pipe(
      map((roles) => {
        if (!roles || roles.length === 0) {
          return [];
        }
        const firstRole = roles[0];
        let menuItems: SidebarMenuItem[] = [];
        switch (firstRole) {
          case Roles.Admin:
            menuItems = this.adminMenuItems;
            break;
          case Roles.LogisticOperator:
          case Roles.FieldOperator:
          case Roles.FieldTechnician:
            menuItems = this.operarioMenuItems;
            break;
          case Roles.LogisticSupervisor:
          case Roles.FieldSupervisor:
          case Roles.FieldPlanner:
            menuItems = this.supervisorMenuItems;
            break;
          default:
            menuItems = [];
        }
        this.localStorageService.setItem('menuItems', menuItems);
        return menuItems;
      })
    );
  }

  handleRoleError(): void {}
  getSupervisorMenuItems(): Observable<SidebarMenuItem[]> {
    return of(this.supervisorMenuItems);
  }

  getOperarioMenuItems(): Observable<SidebarMenuItem[]> {
    return of(this.operarioMenuItems);
  }

  getAdminMenuItems(): Observable<SidebarMenuItem[]> {
    return of(this.adminMenuItems);
  }
}
