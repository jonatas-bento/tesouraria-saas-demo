import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CreateMemberPayload,
  Member,
  MemberStatus,
} from '../../../core/models';
import { DATA_SERVICE_TOKEN } from '../../../core/services/data.service.token';
import { DemoBadgeComponent } from '../../../shared/components/demo-badge/demo-badge.component';

interface MemberFormState {
  name: string;
  phone: string;
  email: string;
  status: MemberStatus;
  joinedAt: string;
  observations: string;
}

@Component({
  selector: 'app-membros',
  imports: [CommonModule, FormsModule, DemoBadgeComponent],
  template: `
    <div class="members-page">
      <div class="page-header">
        <div>
          <h1>Secretaria · Membros</h1>
          <p>Cadastro e acompanhamento dos membros e visitantes da igreja.</p>
        </div>
        <app-demo-badge />
      </div>

      <div class="demo-warning">
        <p>
          🧪 Modo demonstração - dados persistidos no SQLite via API NestJS.
        </p>
      </div>

      <div class="summary-section">
        <div class="summary-card">
          <h3>Total de Cadastros</h3>
          <p class="count">{{ members().length }}</p>
        </div>

        <div class="summary-card">
          <h3>Membros Ativos</h3>
          <p class="count active">{{ getStatusCount('active') }}</p>
        </div>

        <div class="summary-card">
          <h3>Visitantes</h3>
          <p class="count visitor">{{ getStatusCount('visitor') }}</p>
        </div>

        <div class="summary-card">
          <h3>Em Acompanhamento</h3>
          <p class="count away">{{ getStatusCount('away') }}</p>
        </div>
      </div>

      <div class="form-card">
        <div class="section-header">
          <h2>{{ editingId() ? 'Editar cadastro' : 'Novo cadastro' }}</h2>

          <button type="button" class="secondary-button" (click)="resetDemoData()">
            Resetar demo
          </button>
        </div>

        <form class="form-grid" (ngSubmit)="save()">
          <label>
            Nome
            <input
              type="text"
              name="name"
              placeholder="Nome completo"
              [ngModel]="form().name"
              (ngModelChange)="updateForm('name', $event)"
              required
            />
          </label>

          <label>
            Telefone
            <input
              type="text"
              name="phone"
              placeholder="(21) 99999-9999"
              [ngModel]="form().phone"
              (ngModelChange)="updateForm('phone', $event)"
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="email@exemplo.com"
              [ngModel]="form().email"
              (ngModelChange)="updateForm('email', $event)"
            />
          </label>

          <label>
            Situação
            <select
              name="status"
              [ngModel]="form().status"
              (ngModelChange)="updateForm('status', $event)"
            >
              <option value="active">Ativo</option>
              <option value="visitor">Visitante</option>
              <option value="away">Afastado / acompanhamento</option>
              <option value="transferred">Transferido</option>
            </select>
          </label>

          <label>
            Data de cadastro
            <input
              type="date"
              name="joinedAt"
              [ngModel]="form().joinedAt"
              (ngModelChange)="updateForm('joinedAt', $event)"
            />
          </label>

          <label class="wide">
            Observações
            <textarea
              name="observations"
              rows="3"
              placeholder="Observações pastorais, administrativas ou de acompanhamento"
              [ngModel]="form().observations"
              (ngModelChange)="updateForm('observations', $event)"
            ></textarea>
          </label>

          <div class="form-actions">
            <button type="submit" class="primary-button" [disabled]="saving()">
              {{ saving() ? 'Salvando...' : editingId() ? 'Salvar edição' : 'Cadastrar' }}
            </button>

            <button
              type="button"
              class="secondary-button"
              *ngIf="editingId()"
              (click)="cancelEdit()"
            >
              Cancelar
            </button>
          </div>
        </form>

        <p class="feedback success" *ngIf="successMessage()">
          {{ successMessage() }}
        </p>

        <p class="feedback error" *ngIf="errorMessage()">
          {{ errorMessage() }}
        </p>
      </div>

      <div class="members-section">
        <h2>Cadastros</h2>

        <div class="members-table">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Contato</th>
                <th>Situação</th>
                <th>Cadastro</th>
                <th>Observações</th>
                <th class="actions-column">Ações</th>
              </tr>
            </thead>

            <tbody>
              <tr *ngFor="let member of members()">
                <td class="member-name">{{ member.name }}</td>
                <td>
                  <div>{{ member.phone || '-' }}</div>
                  <small>{{ member.email || '-' }}</small>
                </td>
                <td>
                  <span class="badge" [class]="member.status">
                    {{ getStatusLabel(member.status) }}
                  </span>
                </td>
                <td>{{ member.joinedAt ? (member.joinedAt | date: 'dd/MM/yyyy') : '-' }}</td>
                <td class="observations">{{ member.observations || '-' }}</td>
                <td class="actions">
                  <button type="button" class="small-button" (click)="edit(member)">
                    Editar
                  </button>

                  <button
                    type="button"
                    class="small-button danger"
                    (click)="remove(member)"
                  >
                    Excluir
                  </button>
                </td>
              </tr>

              <tr *ngIf="members().length === 0">
                <td colspan="6" class="no-data">Nenhum membro cadastrado.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .members-page {
      padding: 2rem;
    }

    .page-header,
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .page-header h1 {
      margin: 0 0 0.35rem 0;
    }

    .page-header p {
      margin: 0;
      color: #6c757d;
    }

    .demo-warning {
      background-color: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 2rem;
      text-align: center;
    }

    .demo-warning p {
      margin: 0;
      color: #856404;
      font-weight: 500;
    }

    .summary-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .summary-card,
    .form-card,
    .members-table {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .summary-card h3 {
      margin: 0 0 1rem 0;
      font-size: 0.9rem;
      color: #666;
      font-weight: 500;
    }

    .count {
      margin: 0;
      font-size: 1.8rem;
      font-weight: bold;
      color: #003162;
    }

    .count.active {
      color: #28a745;
    }

    .count.visitor {
      color: #007bff;
    }

    .count.away {
      color: #ffc107;
    }

    .form-card {
      margin-bottom: 2rem;
    }

    .form-card h2,
    .members-section h2 {
      margin: 0 0 1rem 0;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
      align-items: end;
    }

    .wide {
      grid-column: 1 / -1;
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      font-weight: 600;
      color: #495057;
    }

    input,
    select,
    textarea {
      border: 1px solid #ced4da;
      border-radius: 8px;
      padding: 0.7rem;
      font: inherit;
    }

    textarea {
      resize: vertical;
    }

    .form-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    button {
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 700;
    }

    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .primary-button {
      background: #003162;
      color: white;
      padding: 0.75rem 1rem;
    }

    .secondary-button {
      background: #e9ecef;
      color: #343a40;
      padding: 0.75rem 1rem;
    }

    .small-button {
      background: #e7f3ff;
      color: #004085;
      padding: 0.45rem 0.7rem;
      font-size: 0.85rem;
    }

    .small-button.danger {
      background: #f8d7da;
      color: #721c24;
    }

    .feedback {
      margin: 1rem 0 0 0;
      font-weight: 600;
    }

    .feedback.success {
      color: #155724;
    }

    .feedback.error {
      color: #721c24;
    }

    .members-table {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      text-align: left;
      padding: 0.75rem;
      border-bottom: 2px solid #dee2e6;
      font-weight: 600;
      color: #495057;
    }

    td {
      padding: 0.75rem;
      border-bottom: 1px solid #dee2e6;
      vertical-align: top;
    }

    tr:last-child td {
      border-bottom: none;
    }

    .member-name {
      font-weight: 700;
      color: #212529;
    }

    small {
      color: #6c757d;
    }

    .observations {
      max-width: 320px;
      color: #495057;
      line-height: 1.4;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .badge.active {
      background-color: #d4edda;
      color: #155724;
    }

    .badge.visitor {
      background-color: #d1ecf1;
      color: #0c5460;
    }

    .badge.away {
      background-color: #fff3cd;
      color: #856404;
    }

    .badge.transferred {
      background-color: #f8d7da;
      color: #721c24;
    }

    .actions-column {
      width: 160px;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .no-data {
      text-align: center;
      color: #999;
      font-style: italic;
      padding: 2rem !important;
    }

    @media (max-width: 768px) {
      .members-page {
        padding: 1rem;
      }

      .page-header,
      .section-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .summary-section,
      .form-grid {
        grid-template-columns: 1fr;
      }

      table {
        font-size: 0.85rem;
      }

      th,
      td {
        padding: 0.5rem;
      }
    }
  `],
})
export class MembrosComponent implements OnInit {
  members = signal<Member[]>([]);
  editingId = signal<string | null>(null);
  saving = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  form = signal<MemberFormState>(this.createEmptyForm());

  private readonly dataService = inject(DATA_SERVICE_TOKEN);

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.dataService.getMembers().subscribe({
      next: (members) => {
        this.members.set(this.sortMembers(members));
      },
      error: () => {
        this.errorMessage.set('Não foi possível carregar os membros.');
      },
    });
  }

  save(): void {
    this.clearMessages();

    const form = this.form();

    if (!form.name.trim()) {
      this.errorMessage.set('Informe o nome do membro.');
      return;
    }

    const payload: CreateMemberPayload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      status: form.status,
      joinedAt: form.joinedAt || undefined,
      observations: form.observations.trim(),
    };

    this.saving.set(true);

    const id = this.editingId();

    const request$ = id
      ? this.dataService.updateMember(id, payload)
      : this.dataService.createMember(payload);

    request$.subscribe({
      next: () => {
        this.successMessage.set(
          id ? 'Cadastro atualizado com sucesso.' : 'Membro cadastrado com sucesso.'
        );
        this.cancelEdit();
        this.loadMembers();
      },
      error: () => {
        this.errorMessage.set('Não foi possível salvar o cadastro.');
      },
      complete: () => {
        this.saving.set(false);
      },
    });
  }

  edit(member: Member): void {
    this.clearMessages();
    this.editingId.set(member.id);

    this.form.set({
      name: member.name,
      phone: member.phone ?? '',
      email: member.email ?? '',
      status: member.status,
      joinedAt: member.joinedAt ? this.toInputDate(member.joinedAt) : '',
      observations: member.observations ?? '',
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  remove(member: Member): void {
    const confirmed = window.confirm(`Deseja excluir "${member.name}"?`);

    if (!confirmed) {
      return;
    }

    this.clearMessages();

    this.dataService.deleteMember(member.id).subscribe({
      next: () => {
        this.successMessage.set('Cadastro excluído com sucesso.');
        this.loadMembers();
      },
      error: () => {
        this.errorMessage.set('Não foi possível excluir o cadastro.');
      },
    });
  }

  resetDemoData(): void {
    const confirmed = window.confirm(
      'Deseja restaurar os dados demonstrativos iniciais?'
    );

    if (!confirmed) {
      return;
    }

    this.clearMessages();

    this.dataService.resetDemoData().subscribe({
      next: () => {
        this.successMessage.set('Dados demonstrativos restaurados com sucesso.');
        this.cancelEdit();
        this.loadMembers();
      },
      error: () => {
        this.errorMessage.set('Não foi possível resetar a demo.');
      },
    });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.form.set(this.createEmptyForm());
  }

  updateForm<K extends keyof MemberFormState>(
    field: K,
    value: MemberFormState[K]
  ): void {
    this.form.update((current) => ({
      ...current,
      [field]: value,
    }));
  }

  getStatusCount(status: MemberStatus): number {
    return this.members().filter((member) => member.status === status).length;
  }

  getStatusLabel(status: MemberStatus): string {
    const labels: Record<MemberStatus, string> = {
      active: 'Ativo',
      away: 'Acompanhamento',
      visitor: 'Visitante',
      transferred: 'Transferido',
    };

    return labels[status];
  }

  private createEmptyForm(): MemberFormState {
    return {
      name: '',
      phone: '',
      email: '',
      status: 'active',
      joinedAt: new Date().toISOString().slice(0, 10),
      observations: '',
    };
  }

  private sortMembers(members: Member[]): Member[] {
    return members.slice().sort((a, b) => a.name.localeCompare(b.name));
  }

  private toInputDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private clearMessages(): void {
    this.successMessage.set('');
    this.errorMessage.set('');
  }
}
