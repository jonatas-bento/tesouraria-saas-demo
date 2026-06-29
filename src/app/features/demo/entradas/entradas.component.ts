import { Component } from '@angular/core';
import { TransactionsCrudComponent } from '../shared/transactions-crud/transactions-crud.component';

@Component({
  selector: 'app-entradas',
  imports: [TransactionsCrudComponent],
  template: `
    <app-transactions-crud
      [type]="'income'"
      title="Entradas"
      singularLabel="entrada"
    />
  `,
})
export class EntradasComponent {}
