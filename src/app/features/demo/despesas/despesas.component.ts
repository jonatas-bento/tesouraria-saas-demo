import { Component } from '@angular/core';
import { TransactionsCrudComponent } from '../shared/transactions-crud/transactions-crud.component';

@Component({
  selector: 'app-despesas',
  imports: [TransactionsCrudComponent],
  template: `
    <app-transactions-crud
      [type]="'expense'"
      title="Despesas"
      singularLabel="despesa"
    />
  `,
})
export class DespesasComponent {}
