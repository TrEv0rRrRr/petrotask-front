import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {NgIf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss'],
  imports: [FormsModule, NgIf, TranslatePipe]
})
export class PasswordRecoveryComponent {
  email: string = '';
  submitted: boolean = false;
  message: string = '';
  error: string = '';

  constructor(private router: Router) {}

  onSubmit(): void {
    this.submitted = true;
    this.message = '';
    this.error = '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email) {
      this.error = 'Por favor, ingresa tu correo electrónico.';
      return;
    }

    if (!emailRegex.test(this.email)) {
      this.error = 'Ingresa un formato de email válido.';
      return;
    }

    // Simula el envío de correo
    setTimeout(() => {
      this.message = `Se ha enviado un enlace de recuperación a ${this.email}`;
      this.email = '';
      this.submitted = false;
    }, 1000);
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }
}
