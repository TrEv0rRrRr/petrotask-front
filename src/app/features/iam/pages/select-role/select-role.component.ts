import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-role',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select-role.component.html',
  styleUrls: ['./select-role.component.scss']
})
export class SelectRoleComponent {
  selectedRole: string = '';

  constructor(private router: Router) {}

  onRegister(): void {
    if (this.selectedRole === 'supervisor') {
      this.router.navigate(['/register/supervisor']);
    } else if (this.selectedRole === 'operario') {
      this.router.navigate(['/register/operario']);
    } else {
      alert('Por favor, selecciona un rol antes de continuar.');
    }
  }
}
