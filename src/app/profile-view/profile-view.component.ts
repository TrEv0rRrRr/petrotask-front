import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { InputComponent } from '../shared/components/input/input.component';
import { ButtonComponent } from '../shared/components/button/button.component';
import {MatDivider} from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  photo?: string;
  phone: string;
  position: string;
  lastLogin: Date;
}

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [
    CommonModule,
    MatCardContent,
    MatDivider,
    MatCard,
    MatIcon,
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    MatButtonModule,
    TranslatePipe
  ],
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent {
  profileForm: FormGroup;
  saving = false;

  user: User = {
    id: 123,
    name: 'María Guadalupe Rojas',
    email: 'mrojas@empresa.com',
    role: 'Supervisora Logística',
    phone: '+51 987 654 321',
    position: 'Jefe de Operaciones',
    lastLogin: new Date('2024-03-15T14:30:00')
  };

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.profileForm = this.fb.group({
      name: [this.user.name, [Validators.required, Validators.maxLength(50)]],
      email: [this.user.email, [Validators.required, Validators.email]],
      phone: [this.user.phone, [
        Validators.required,
        Validators.pattern(/^\+?\d{7,15}$/)
      ]],
      position: [this.user.position, [
        Validators.required,
        Validators.maxLength(40)
      ]]
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.markFormTouched();
      this.showErrorMessage('Complete los campos requeridos');
      return;
    }

    this.saving = true;
    setTimeout(() => {
      this.user = { ...this.user, ...this.profileForm.value };
      this.profileForm.markAsPristine();
      this.saving = false;
      this.showSuccessMessage('Cambios guardados');
    }, 1500);
  }

  resetForm() {
    this.profileForm.reset({
      name: this.user.name,
      email: this.user.email,
      phone: this.user.phone,
      position: this.user.position
    });
    this.profileForm.markAsPristine();
  }

  private markFormTouched() {
    Object.values(this.profileForm.controls).forEach(control => control.markAsTouched());
  }

  private showSuccessMessage(message: string) {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }

  private showErrorMessage(message: string) {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }
}
