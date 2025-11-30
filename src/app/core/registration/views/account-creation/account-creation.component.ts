import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {InputComponent} from '../../../../shared/components/input/input.component';
import {ButtonComponent} from '../../../../shared/components/button/button.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-account-creation',
  imports: [
    InputComponent,
    ButtonComponent,
    TranslatePipe
  ],
  templateUrl: './account-creation.component.html',
  styleUrl: './account-creation.component.scss'
})
export class AccountCreationComponent {

  constructor(private router: Router) {}

  email: string = '';
  placeholderEmail: string = 'Ingrese su email...';
  name: string = '';
  placeholderName: string = 'Ingrese su nombre...';
  password1: string = '';
  placeholderP1: string = 'Ingrese su password...';
  password2: string = '';
  placeholderP2: string = 'Repita su password...';

  onEmailChange(value: string): void {
    this.email = value;
    console.log('Valor ingresado:', value);
  }
  onNameChange(value: string): void {
    this.name = value;
    console.log('Valor ingresado:', value);
  }
  onP1Change(value: string): void {
    this.password1 = value;
    console.log('Valor ingresado:', value);
  }
  onP2Change(value: string): void {
    this.password2 = value;
    console.log('Valor ingresado:', value);
  }

  onSaveEvent(): void {
    this.onEmailChange(this.email);
    this.onNameChange(this.name);
    this.onP1Change(this.password1);
    this.onP2Change(this.password2);
    this.router.navigate(['/home-admin']);
  }

}
