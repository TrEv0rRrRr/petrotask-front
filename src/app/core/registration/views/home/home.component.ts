import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

interface QuickAction {
  key: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    TranslateModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  quickActions: QuickAction[] = [
    { 
      key: 'my-tasks',
      icon: 'assignment', 
      route: '/petrotask/my-tasks'
    },
    { 
      key: 'incident-reporting',
      icon: 'report_problem', 
      route: '/petrotask/incident-reporting'
    },
    { 
      key: 'photo-evidence',
      icon: 'camera_alt', 
      route: '/petrotask/photo-evidence'
    },
    { 
      key: 'safety-alerts',
      icon: 'warning', 
      route: '/petrotask/safety-alerts'
    }
  ];
}
