import { Component } from '@angular/core';

@Component({
  selector: 'app-contato',
  template: `
    <div class="contact-page">
      <section class="contact-card">
        <div class="brand-area">
          <span class="brand-mark">ib</span>
          <h1>IBATECH</h1>
          <p class="subtitle">Soluções Digitais</p>
          <p class="slogan">
            Tecnologia que transforma. Soluções que conectam.
          </p>
        </div>

        <div class="contact-info">
          <h2>Fale conosco</h2>
          <p>
            Entre em contato para conhecer a demonstração da Gestão Inteligente
            para Igrejas.
          </p>

          <div class="contact-list">
            <a href="tel:+5528999888835" class="contact-item">
              <span>📞</span>
              <div>
                <strong>Telefone</strong>
                <p>28 99988-8835</p>
              </div>
            </a>

            <a
              href="mailto:ibatechsolucoesdigitais@gmail.com"
              class="contact-item"
            >
              <span>✉️</span>
              <div>
                <strong>E-mail</strong>
                <p>ibatechsolucoesdigitais@gmail.com</p>
              </div>
            </a>

            <a
              href="https://www.instagram.com/ibatechsolucoesdigitais"
              target="_blank"
              rel="noopener noreferrer"
              class="contact-item"
            >
              <span>📷</span>
              <div>
                <strong>Instagram</strong>
                <p>@ibatechsolucoesdigitais</p>
              </div>
            </a>

            <div class="contact-item">
              <span>📍</span>
              <div>
                <strong>Endereço</strong>
                <p>Ibatiba - ES, Brasil</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .contact-page {
      min-height: 100vh;
      padding: 4rem 2rem;
      background:
        radial-gradient(circle at top left, rgba(109, 255, 63, 0.18), transparent 34%),
        linear-gradient(135deg, #07110c 0%, #101820 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .contact-card {
      width: min(1050px, 100%);
      display: grid;
      grid-template-columns: 0.9fr 1.1fr;
      background: rgba(255, 255, 255, 0.07);
      border: 1px solid rgba(109, 255, 63, 0.32);
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 24px 70px rgba(0, 0, 0, 0.35);
    }

    .brand-area {
      padding: 3rem;
      background: rgba(0, 0, 0, 0.28);
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .brand-mark {
      width: 88px;
      height: 88px;
      border-radius: 24px;
      background: #6dff3f;
      color: #101820;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 2.4rem;
      font-weight: 900;
      margin-bottom: 1.5rem;
    }

    .brand-area h1 {
      font-size: 3rem;
      margin: 0;
    }

    .subtitle {
      color: #6dff3f;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      font-weight: 800;
      margin: 0.4rem 0 2rem;
    }

    .slogan {
      color: rgba(255, 255, 255, 0.8);
      font-size: 1.1rem;
      line-height: 1.7;
    }

    .contact-info {
      padding: 3rem;
    }

    .contact-info h2 {
      font-size: 2.4rem;
      margin: 0 0 0.8rem;
    }

    .contact-info > p {
      color: rgba(255, 255, 255, 0.76);
      line-height: 1.7;
      margin-bottom: 2rem;
    }

    .contact-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .contact-item {
      display: flex;
      gap: 1rem;
      align-items: center;
      color: white;
      text-decoration: none;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      padding: 1rem;
    }

    .contact-item span {
      font-size: 1.5rem;
    }

    .contact-item strong {
      color: #6dff3f;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.08em;
    }

    .contact-item p {
      margin: 0.25rem 0 0;
      color: rgba(255, 255, 255, 0.86);
    }

    @media (max-width: 820px) {
      .contact-card {
        grid-template-columns: 1fr;
      }

      .brand-area,
      .contact-info {
        padding: 2rem;
      }
    }
  `]
})
export class ContatoComponent {}
