import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {InputComponent} from '../../../../shared/components/input/input.component';
import {SelectorComponent} from '../../../../shared/components/selector/selector.component';
import {ButtonComponent} from '../../../../shared/components/button/button.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-payment-information',
  imports: [
    InputComponent,
    SelectorComponent,
    ButtonComponent,
    TranslatePipe
  ],
  templateUrl: './payment-information.component.html',
  styleUrl: './payment-information.component.scss'
})
export class PaymentInformationComponent {

  constructor(private router: Router) {}

  name: string = '';
  placeholderName: string = 'Nombre completo';
  company: string = '';
  placeholderCompany: string = 'Nombre de la empresa';
  cardnumber: string = '';
  placeholderCardnumber: string = 'Numero de tarjeta';
  ruc: string = '';
  placeholderRuc: string = 'Numero de RUC';
  cvv: string = '';
  placeholderCvv: string = 'CVV';

  cardType: string = '';
  cardTypeList = ['Crédito', 'Débito'];
  month: string = '';
  monthList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  year: string = '';
  yearList = ['2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034', '2035', '2036'];

  onNameChange(option: string) {
    this.name = option;
    console.log(option);
  }
  onCompanyChange(option: string) {
    this.company = option;
    console.log(option);
  }
  onCardNumberChange(option: string) {
    this.cardnumber = option;
    console.log(option);
  }
  onRucChange(option: string) {
    this.ruc = option;
    console.log(option);
  }
  onCvvChange(option: string) {
    this.cvv = option;
    console.log(option);
  }
  onCardTypeChange(option: string | string[]) {
    this.cardType = Array.isArray(option) ? option[0] || '' : option || '';
    console.log(this.cardType);
  }
  onMonthChange(option: string | string[]) {
    this.month = Array.isArray(option) ? option[0] || '' : option || '';
    console.log(this.month);
  }
  onYearChange(option: string | string[]) {
    this.year = Array.isArray(option) ? option[0] || '' : option || '';
    console.log(this.year);
  }

  onSaveInformation() {
    this.onNameChange(this.name);
    this.onCompanyChange(this.company);
    this.onCardNumberChange(this.cardnumber);
    this.onRucChange(this.ruc);
    this.onCvvChange(this.cvv);
    this.onCardTypeChange(this.cardType);
    this.onMonthChange(this.month);
    this.onYearChange(this.year);
    this.router.navigate(['/account']);
  }
}
