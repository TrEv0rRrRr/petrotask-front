import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe, CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

interface BillingRecord {
  date: string;
  amount: number;
  status: 'Pagado' | 'Pendiente';
}

@Component({
  selector: 'app-company-settings',
  standalone: true,
  templateUrl: './company-settings.component.html',
  styleUrls: ['./company-settings.component.scss'],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TranslatePipe
  ]
})
export class CompanySettingsComponent implements OnInit {
  settingsForm!: FormGroup;
  submitted = false;
  loading = false;

  billingHistory: BillingRecord[] = [
    { date: '15 de Marzo, 2025', amount: 150.00, status: 'Pagado' },
    { date: '15 de Abril, 2025', amount: 150.00, status: 'Pagado' },
    { date: '15 de Mayo, 2025', amount: 150.00, status: 'Pagado' }
  ];

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      plan: ['Empresa Plus', [Validators.required, Validators.minLength(3)]],
      status: ['Activo', Validators.required],
      startDate: ['2025-03-15', Validators.required],
      nextPayment: ['2025-06-15', Validators.required],
      paymentMethod: ['Tarjeta VISA **** 1234', [Validators.required, Validators.minLength(8)]]
    });
  }

  renewPlan(): void {
    this.submitted = true;

    if (this.settingsForm.invalid) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }

    this.loading = true;

    // Simulación de envío
    setTimeout(() => {
      this.loading = false;
      alert(' Suscripción renovada con éxito.');
      console.log(' Datos enviados:', this.settingsForm.value);
    }, 1500);
  }

  changePaymentMethod(): void {
    alert(' Redirigiendo a la gestión de pagos...');
  }

  viewPlanDetails(): void {
    const plan = this.settingsForm.get('plan')?.value;
    const status = this.settingsForm.get('status')?.value;
    alert(`ℹ Plan actual: ${plan} | Estado: ${status}`);
  }

  isInvalid(field: string): boolean {
    const control = this.settingsForm.get(field);
    return control ? control.invalid && (control.touched || this.submitted) : false;
  }

  onHome() {
    this.router.navigate(['/home-admin']);
  }
}
