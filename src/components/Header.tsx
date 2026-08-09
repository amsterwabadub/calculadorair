'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { COUNTRIES } from '@/config/countries';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header-nav">
      <div className="container header-content">
        <Link href="/" className="brand-logo">
          <div className="logo-icon">
            <span className="logo-badge">R</span>
          </div>
          <div className="brand-text">
            Regulo<span>.online</span>
          </div>
        </Link>

        {/* Desktop Country Menu */}
        <nav className="desktop-nav">
          {Object.values(COUNTRIES).map((country) => (
            <Link
              key={country.code}
              href={`/${country.code}/${country.primarySlug}`}
              className="nav-link"
            >
              <span className="country-flag">{country.flag}</span>
              <span className="country-name">{country.name}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-title">Global Calculators</div>
          {Object.values(COUNTRIES).map((country) => (
            <Link
              key={country.code}
              href={`/${country.code}/${country.primarySlug}`}
              className="mobile-nav-item"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="country-flag">{country.flag}</span>
              <div>
                <div className="mobile-country-name">{country.name}</div>
                <div className="mobile-country-search">{country.popularSearch}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
