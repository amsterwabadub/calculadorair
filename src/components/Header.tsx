import Link from 'next/link';

export default function Header() {
  return (
    <header className="header-nav">
      <div className="container header-content">
        <Link href="/" className="brand-logo">
          📊 Calculadora IR <span>2026</span>
        </Link>
        <nav style={{ display: 'flex', gap: '1.25rem', fontSize: '0.9rem', fontWeight: 600 }}>
          <Link href="/">Calculadora</Link>
          <Link href="/nova-tabela-imposto-de-renda-2026">Nova Tabela</Link>
          <Link href="/isencao-imposto-de-renda-2026">Isenção 5k</Link>
          <Link href="/contador" style={{ color: 'var(--color-emerald-text)' }}>
            Ajuda
          </Link>
        </nav>
      </div>
    </header>
  );
}
