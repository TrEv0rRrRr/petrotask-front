import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { SidebarMenuItem } from '../components/sidebar/sidebar.component';
import { AuthenticationService } from 'src/app/features/iam/services/authentication.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { Roles } from 'src/app/features/iam/models/roles.enum';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  router = inject(Router);
  authService = inject(AuthenticationService);
  localStorageService = inject(LocalStorageService);

  private adminMenuItems: SidebarMenuItem[] = [
    {
      id: 'home',
      label: 'Inicio',
      icon: 'home',
      route: '/petrotask/home',
    },
    {
      id: 'task-planning',
      label: 'Planificación de Tareas',
      icon: 'schedule',
      route: '/petrotask/task-planning'
    },
    {
      id: 'task-management',
      label: 'Gestión de Tareas',
      icon: 'assignment',
      children: [
        {
          id: 'activities-list',
          label: 'Lista de Tareas',
          icon: 'list_alt',
          route: '/petrotask/activities-list'
        },
        {
          id: 'task-assignment',
          label: 'Asignación de Tareas',
          icon: 'assignment_ind',
          route: '/petrotask/task-assignment'
        }
      ]
    },
    {
      id: 'alert-management',
      label: 'Gestión de Alertas',
      icon: 'notifications',
      children: [
        {
          id: 'safety-monitoring',
          label: 'Monitoreo de Seguridad',
          icon: 'security',
          route: '/petrotask/safety-monitoring'
        },
        {
          id: 'alert-history',
          label: 'Historial de Alertas',
          icon: 'history',
          route: '/petrotask/alert-history'
        }
      ]
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: 'assessment',
      route: '/petrotask/reports'
    },
    {
      id: 'execution-history',
      label: 'Historial de Ejecución',
      icon: 'history',
      route: '/petrotask/execution-history'
    },
    {
      id: 'system-management',
      label: 'Gestión del Sistema',
      icon: 'admin_panel_settings',
      children: [
        {
          id: 'users',
          label: 'Usuarios',
          icon: 'groups',
          route: '/petrotask/users'
        },
        {
          id: 'equipments-management',
          label: 'Gestión de Equipos',
          icon: 'precision_manufacturing',
          route: '/petrotask/equipments-management'
        },
        {
          id: 'employee-management',
          label: 'Personal de Campo',
          icon: 'engineering',
          route: '/petrotask/employee-management'
        },
        {
          id: 'location-management',
          label: 'Ubicaciones',
          icon: 'location_on',
          route: '/petrotask/location-management'
        },
        {
          id: 'teams-management',
          label: 'Equipos de Trabajo',
          icon: 'group',
          route: '/petrotask/teams-management'
        },
        {
          id: 'settings',
          label: 'Configuración',
          icon: 'settings',
          route: '/petrotask/company-settings'
        }
      ]
    }
  ];

  private operarioMenuItems: SidebarMenuItem[] = [
    {
      id: 'home',
      label: 'Inicio',
      icon: 'home',
      route: '/petrotask/home',
    },
    {
      id: 'my-tasks',
      label: 'Mis Tareas',
      icon: 'assignment',
      route: '/petrotask/my-tasks'
    },
    {
      id: 'incident-reporting',
      label: 'Reporte de Incidencias',
      icon: 'report_problem',
      route: '/petrotask/incident-reporting'
    },
    {
      id: 'photo-evidence',
      label: 'Evidencias Fotográficas',
      icon: 'camera_alt',
      route: '/petrotask/photo-evidence'
    },
    {
      id: 'safety-alerts',
      label: 'Alertas de Seguridad',
      icon: 'warning',
      route: '/petrotask/safety-alerts'
    }
  ];

  private supervisorMenuItems: SidebarMenuItem[] = [
    {
      id: 'home',
      label: 'Inicio',
      icon: 'home',
      route: '/petrotask/home'
    },
    {
      id: 'dashboard',
      label: 'Panel de Control',
      icon: 'dashboard',
      route: '/petrotask/dashboard'
    },
    {
      id: 'task-planning',
      label: 'Planificación de Tareas',
      icon: 'schedule',
      route: '/petrotask/task-planning'
    },
    {
      id: 'team-management',
      label: 'Gestión de Equipos',
      icon: 'group',
      route: '/petrotask/teams-management'
    },
    {
      id: 'equipments-management',
      label: 'Equipos Petroleros',
      icon: 'precision_manufacturing',
      route: '/petrotask/equipments-management'
    },
    {
      id: 'location-management',
      label: 'Ubicaciones Petroleras',
      icon: 'location_on',
      route: '/petrotask/location-management'
    },
    {
      id: 'critical-tasks',
      label: 'Tareas Críticas',
      icon: 'warning',
      route: '/petrotask/activity-management'
    },
    {
      id: 'safety-monitoring',
      label: 'Monitoreo de Seguridad',
      icon: 'security',
      route: '/petrotask/safety-monitoring'
    },
    {
      id: 'incident-management',
      label: 'Gestión de Incidencias',
      icon: 'report_problem',
      route: '/petrotask/incident-management'
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: 'assessment',
      route: '/petrotask/reports'
    }
  ];

  constructor() {}

  getMenuItems(): Observable<SidebarMenuItem[]> {
    console.log('Getting menu items...');
    if(this.localStorageService.hasKey('menuItems')){
      const menuItems : SidebarMenuItem[] = this.localStorageService.getItem('menuItems');
      console.log('Menu items from localStorage:', menuItems);
      return of(menuItems);
    }
    console.log('No menu items in localStorage, getting from roles...');
    return this.authService.currentRoles.pipe(
      map(roles => {
        console.log('Current roles:', roles);
        if (!roles || roles.length === 0) {
          console.log('No roles found, returning empty menu');
          return [];
        }
        const firstRole = roles[0];
        let menuItems : SidebarMenuItem[] = [];
        switch (firstRole) {
          case Roles.Admin:
            console.log('Loading admin menu items');
            menuItems = this.adminMenuItems;
            break;
          case Roles.FieldOperator:
            console.log('Loading operario menu items');
            menuItems =  this.operarioMenuItems;
            break;
          case Roles.FieldSupervisor:
            console.log('Loading supervisor menu items (same as admin)');
            menuItems =  this.adminMenuItems; // El supervisor usa el mismo menú que el admin
            break;
          case Roles.FieldPlanner:
            console.log('Loading planner menu items');
            menuItems =  this.supervisorMenuItems; // Los planificadores usan el mismo menú que supervisores
            break;
          case Roles.FieldTechnician:
            console.log('Loading technician menu items');
            menuItems =  this.operarioMenuItems; // Los técnicos usan el mismo menú que operarios
            break;
          default:
            console.log('No matching role found, returning empty menu');
            menuItems = [];
        }
        this.localStorageService.setItem('menuItems', menuItems);
        return menuItems;
      })
    );
  }

  handleRoleError(): void {

  }
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
