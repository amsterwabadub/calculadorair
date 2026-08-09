import React from 'react';
import Link from 'next/link';
import { COUNTRIES } from '@/config/countries';

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col brand-col">
            <div className="footer-logo">Regulo.online</div>
            <p className="footer-desc">
              Global Statutory Utility Engine — Open, accurate, and instant administrative & tax calculators for Kenya, Mexico, Morocco, and Colombia.
            </p>
            <div className="trust-badge">
              <span className="badge-dot"></span> Verified 2026 Statutory Rules & Official Sources
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Calculators by Country</h4>
            <ul className="footer-links">
              {Object.values(COUNTRIES).map((country) => (
                <li key={country.code}>
                  <Link href={`/${country.code}/${country.primarySlug}`}>
                    {country.flag} {country.name} ({country.popularSearch})
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Compliance & Quality</h4>
            <ul className="footer-links">
              <li><Link href="/">Global Directory</Link></li>
              <li><Link href="/politica-de-privacidade">Privacy Policy & Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Regulo.online. Built for high performance, zero tracking bloat, and statutory precision.</p>
          <p className="disclaimer">
            Disclaimer: Regulo provides estimates based on published statutory tax bands and legislation. For official filings, consult qualified legal or tax counsel.
          </p>
        </div>
      </div>
    </footer>
  );
}
