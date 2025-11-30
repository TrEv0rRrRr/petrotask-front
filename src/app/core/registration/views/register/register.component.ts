import { Component } from '@angular/core';
import {PaymentCardComponent} from '../../../../features/billing/payment-card/payment-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    PaymentCardComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  constructor(private router: Router) {}

  basic = {
    title: 'Plan Básico',
    items: [
      'Hasta 50 tareas/mes',
      'Reportes limitados',
      '1 usuario supervisor',
      'Soporte'
    ],
    price: '$50'
  };

  pro = {
    title: 'Plan Pro',
    items: [
      'Hasta 500 tareas/mes',
      'Reportes limitados',
      '2 usuarios supervisor',
      'Soporte'
    ],
    price: '$100'
  };

  empresarial = {
    title: 'Plan Empresarial',
    items: [
      'Tareas ilimitadas',
      'Integración con ERP',
      'Usuarios ilimitados',
      'Soporte prioritario'
    ],
    price: '$250'
  };

  onTitleSaved(title: string): void {
    console.log('Título guardado:', title);
    this.router.navigate(['/payment']);
  }
}
