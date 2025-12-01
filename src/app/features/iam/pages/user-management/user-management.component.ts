import { NgForOf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { UserCreateDialogComponent } from '../../components/user-create-dialog/user-create-dialog.component';
import { UserEditDialogComponent } from '../../components/user-edit-dialog/user-edit-dialog.component';
import { Roles } from '../../models/roles.enum';
import { User } from '../../models/user.entity';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  imports: [
    FormsModule,
    NgForOf,
    TranslatePipe,
    ConfirmationDialogComponent,
    MatIconModule,
    MatButtonModule,
  ],
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];
  roles: Roles[] = Object.values(Roles);
  selectedRole: string = '';
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  isLoading: boolean = false;
  errorMessage: string = '';

  private userService = inject(UserService);
  private dialog = inject(MatDialog);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filterUsers();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'user-management.error-loading';
        this.isLoading = false;
      },
    });
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(
      (user) =>
        (!this.selectedRole ||
          user.roles.includes(this.selectedRole as Roles)) &&
        (this.getFullName(user)
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  getFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`.trim();
  }

  getRolesDisplay(user: User): string {
    return user.roles.map((role) => this.getRoleLabel(role)).join(', ');
  }

  getRoleLabel(roleValue: Roles): string {
    switch (roleValue) {
      case Roles.Admin:
        return 'Administrador';
      case Roles.LogisticSupervisor:
        return 'Supervisor Logístico';
      case Roles.LogisticOperator:
        return 'Operador Logístico';
      default:
        return roleValue;
    }
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(UserCreateDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newUser = new User(
          undefined,
          result.username,
          result.email,
          result.firstName,
          result.lastName,
          result.roles,
          result.status === 'active'
        );

        // Llamar al servicio con el usuario y la contraseña
        this.userService.createUser(newUser, result.password).subscribe({
          next: () => {
            this.loadUsers();
          },
          error: (error) => {
            console.error('Error al crear usuario:', error);
            this.errorMessage = 'user-management.error-creating';
          },
        });
      }
    });
  }

  editUser(user: User): void {
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      width: '500px',
      data: user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.updateUser(result).subscribe(() => this.loadUsers());
      }
    });
  }

  deleteUser(user: User): void {
    if (user.roles.includes(Roles.Admin)) {
      alert('No se puede eliminar un usuario con rol admin');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar eliminación',
        message: '¿Está seguro que desea eliminar este usuario?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.deleteUser(user.id).subscribe(() => this.loadUsers());
      }
    });
  }

  toggleEstado(user: User): void {
    const updatedUser = { ...user, status: !user.status };
    this.userService
      .toggleUserStatus(updatedUser)
      .subscribe(() => this.loadUsers());
  }
}
