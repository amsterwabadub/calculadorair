import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="ci-header">
      <div className="ci-shell ci-header__row">
        <Link href="/" className="ci-brand" aria-label="Calculadora IR 2026 — início">
          <Image
            className="ci-brand__mark"
            src="/brand/logo-glyph.svg"
            alt=""
            width={30}
            height={30}
            priority
          />
          <span className="ci-brand__text">
            <span className="ci-brand__name">Calculadora IR</span>
            <span className="ci-brand__year">2026</span>
          </span>
        </Link>

        <nav className="ci-nav" aria-label="Navegação principal">
          <Link href="/">Calculadora</Link>
          <Link href="/nova-tabela-imposto-de-renda-2026">Nova tabela</Link>
          <Link href="/isencao-imposto-de-renda-2026">Isenção</Link>
          <Link href="/quanto-vou-economizar-imposto-de-renda-2026">Economia</Link>
          <Link href="/contador">Ajuda</Link>
        </nav>
      </div>
    </header>
  );
}
