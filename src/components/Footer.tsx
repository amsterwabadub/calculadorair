import Link from 'next/link';
import { TAX_RULES_2026 } from '@/data/tax-rules-2026';

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '1rem' }}>Calculadora IR 2026</h4>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
              Simulador independente de economia no Imposto de Renda com as novas regras da Lei nº 15.270/2025.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '1rem' }}>Páginas de Salário</h4>
            <ul style={{ listStyle: 'none', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><Link href="/imposto-de-renda-salario-4000">Salário R$ 4.000</Link></li>
              <li><Link href="/imposto-de-renda-salario-5000">Salário R$ 5.000 (Isenção)</Link></li>
              <li><Link href="/imposto-de-renda-salario-6000">Salário R$ 6.000</Link></li>
              <li><Link href="/imposto-de-renda-salario-7000">Salário R$ 7.000</Link></li>
              <li><Link href="/imposto-de-renda-salario-8000">Salário R$ 8.000</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '1rem' }}>Guias e Regras</h4>
            <ul style={{ listStyle: 'none', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><Link href="/nova-tabela-imposto-de-renda-2026">Tabela IRRF 2026 Completa</Link></li>
              <li><Link href="/isencao-imposto-de-renda-2026">Regra de Isenção até R$ 5k</Link></li>
              <li><Link href="/calculadora-irrf-2026">Calculadora IRRF Mensal</Link></li>
              <li><Link href="/quanto-vou-economizar-imposto-de-renda-2026">Como Calcular sua Economia</Link></li>
              <li><Link href="/contador">Onde Buscar Ajuda</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '1rem' }}>Fontes Oficiais</h4>
            <ul style={{ listStyle: 'none', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {TAX_RULES_2026.sources.map((src, i) => (
                <li key={i}>
                  <a href={src.url} target="_blank" rel="noopener noreferrer">
                    🔗 {src.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid #334155',
            paddingTop: '1.5rem',
            fontSize: '0.8rem',
            color: '#64748b',
            textAlign: 'center',
            lineHeight: '1.6',
          }}
        >
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Aviso Legal:</strong> Esta calculadora tem caráter puramente informativo e fornece estimativas com base na legislação pública em vigor (Lei nº 15.270/2025). Não constitui parecer jurídico, contábil ou fiscal oficial. O cálculo real retido na fonte ou na declaração anual pode variar conforme outras deduções, previdência privada, dependentes e fontes adicionais de renda.
          </p>
          <p>© 2026 Calculadora Imposto de Renda Brasil — Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
