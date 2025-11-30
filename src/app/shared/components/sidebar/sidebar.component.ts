import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { Subject, takeUntil } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon?: string;
  route?: string;
  children?: SidebarMenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslatePipe
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() isOpen = true;
  @Input() menuItems: SidebarMenuItem[] = [];

  private destroy$ = new Subject<void>();

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    console.log('Sidebar component initialized');
    this.menuService.getMenuItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items) => {
          console.log('Menu items loaded:', items);
          this.menuItems = items;
        },
        error: (error) => {
          console.error('Error loading menu items:', error);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSubmenu(item: SidebarMenuItem): void {
    item.expanded = !item.expanded;
  }

  hasChildren(item: SidebarMenuItem): boolean {
    return !!item.children && item.children.length > 0;
  }
}
