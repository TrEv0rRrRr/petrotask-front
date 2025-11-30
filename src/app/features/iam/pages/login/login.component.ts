import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthenticationService } from '../../services/authentication.service';
import { SignInRequest } from '../../models/sign-in.request';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule, NgIf, TranslatePipe]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  submitted: boolean = false;

  private authService = inject(AuthenticationService);
  private router = inject(Router);

  onLogin(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (!this.username || !this.password) {
      this.errorMessage = 'login-container.fill';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'login-container.password-min';
      return;
    }

    this.isLoading = true;
    
    const signInRequest = new SignInRequest({
      username: this.username,
      password: this.password
    });

    this.authService.signIn(signInRequest).subscribe({
      next: (response) => {
        this.authService.handleSuccessfulSignIn(response);
        this.isLoading = false;
      },
      error: (error) => {
        this.authService.handleAuthError(error, '/login');
        this.isLoading = false;
        this.errorMessage = 'login-container.invalid-credentials';
      }
    });
  }

  onRegister(): void {
    this.router.navigate(['/register']);
  }

  goToRecovery(): void {
    this.router.navigate(['/password-recovery']);
  }
}
