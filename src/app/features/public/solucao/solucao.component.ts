import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-solucao',
  imports: [RouterLink],
  template: `
    <div class="solution-page">
      <section class="solution-hero">
        <span>Gestão Inteligente para Igrejas</span>
        <h1>Um portal para unir administração, finanças e secretaria.</h1>
        <p>
          A solução foi pensada para igrejas que desejam sair de controles
          espalhados e caminhar para uma gestão mais clara, segura e acessível.
        </p>
        <a routerLink="/demo" class="primary-button">Ver demonstração</a>
      </section>

      <section class="solution-grid">
        <article>
          <h2>Financeiro</h2>
          <p>
            Entradas, despesas, balancete, relatórios e conferência de lotes
            financeiros.
          </p>
        </article>

        <article>
          <h2>Secretaria</h2>
          <p>
            Base para cadastro de membros, visitantes, agenda administrativa e
            acompanhamento.
          </p>
        </article>

        <article>
          <h2>Validação</h2>
          <p>
            Lotes de conferência para evidenciar se o valor contado fisicamente
            confere com o valor lançado.
          </p>
        </article>

        <article>
          <h2>Comunicação</h2>
          <p>
            Estrutura preparada para notificações e mensageria administrativa.
          </p>
        </article>
      </section>
    </div>
  `,
  styles: [`
    .solution-page {
      background: #f7f9fb;
      min-height: 100vh;
      padding: 4rem 2rem;
    }

    .solution-hero {
      width: min(980px, 100%);
      margin: 0 auto 3rem;
      background: #101820;
      color: white;
      border-radius: 24px;
      padding: 3rem;
    }

    .solution-hero span {
      color: #6dff3f;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-size: 0.78rem;
    }

    .solution-hero h1 {
      font-size: clamp(2rem, 5vw, 4rem);
      line-height: 1.08;
      margin: 1rem 0;
    }

    .solution-hero p {
      color: rgba(255, 255, 255, 0.78);
      line-height: 1.7;
      font-size: 1.1rem;
      max-width: 760px;
    }

    .primary-button {
      display: inline-flex;
      margin-top: 1rem;
      padding: 0.9rem 1.25rem;
      border-radius: 999px;
      background: #6dff3f;
      color: #07110c;
      text-decoration: none;
      font-weight: 800;
    }

    .solution-grid {
      width: min(980px, 100%);
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;
    }

    article {
      background: white;
      border-radius: 18px;
      padding: 1.5rem;
      box-shadow: 0 12px 35px rgba(16, 24, 32, 0.08);
    }

    article h2 {
      margin: 0 0 0.8rem;
      color: #101820;
    }

    article p {
      color: #637083;
      line-height: 1.6;
      margin: 0;
    }

    @media (max-width: 760px) {
      .solution-grid {
        grid-template-columns: 1fr;
      }

      .solution-hero {
        padding: 2rem;
      }
    }
  `]
})
export class SolucaoComponent {}
