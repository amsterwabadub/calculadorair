'use client';

import React, { useState, useEffect, useId } from 'react';
import { usePathname } from 'next/navigation';
import { CalculationResult } from '@/types/calculator';
import { getCalculatorConfigByCountry } from '@/config/calculators';
import {
  trackCalculatorView,
  trackCalculatorStart,
  trackCalculatorComplete,
  trackResultView,
  trackShareResult,
} from '@/lib/analytics';

interface CalculatorProps {
  countryCode: 'ke' | 'mx' | 'ma' | 'co';
}

export default function Calculator({ countryCode }: CalculatorProps) {
  const config = getCalculatorConfigByCountry(countryCode);
  const baseId = useId();
  const pathname = usePathname() || `/${countryCode}/`;

  // Initialize state with default values (called unconditionally at top level)
  const [inputs, setInputs] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    if (config) {
      config.inputs.forEach((field) => {
        initial[field.id] = field.defaultValue;
      });
    }
    return initial;
  });

  const [hasStarted, setHasStarted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Compute calculation result if config exists
  const result: CalculationResult | null = config ? config.calculate(inputs) : null;

  // Track initial page view on mount
  useEffect(() => {
    if (config) {
      trackCalculatorView(config.countryCode, config.id, pathname);
    }
  }, [config, pathname]);

  // Track initial interaction and completion
  const handleInputChange = (fieldId: string, value: any) => {
    if (!config) return;
    if (!hasStarted) {
      setHasStarted(true);
      trackCalculatorStart(config.countryCode, config.id, pathname);
    }
    setInputs((prev) => ({ ...prev, [fieldId]: value }));
  };

  useEffect(() => {
    if (config && result && result.heroOutput) {
      trackCalculatorComplete(config.countryCode, config.id, pathname);
      trackResultView(config.countryCode, config.id, pathname);
    }
  }, [inputs, config, result, pathname]);

  if (!config || !result) {
    return <div className="calc-error">Calculator configuration not found for {countryCode}.</div>;
  }

  const handleCopyResults = () => {
    const summary = `${config.name}\n${result.heroOutput.label}: ${result.heroOutput.formattedValue}\nCalculated at https://regulo.online`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    trackShareResult(config.countryCode, config.id, pathname);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="calculator-widget">
      <div className="calc-header-badge">
        <span className="live-dot"></span> 2026 Statutory Rules Active ({config.countryName})
      </div>

      <div className="calc-grid">
        {/* Input Form Column */}
        <div className="calc-form-card">
          <h2 className="calc-section-title">Enter Income Details</h2>
          <div className="form-fields-container">
            {config.inputs.map((field) => {
              const fieldInputId = `${baseId}-${field.id}`;
              return (
                <div key={field.id} className="form-group">
                  <label htmlFor={fieldInputId} className="field-label">
                    {field.label}
                  </label>

                  {field.type === 'currency' || field.type === 'number' ? (
                    <div className="input-wrapper">
                      {field.prefix && <span className="input-prefix">{field.prefix}</span>}
                      <input
                        id={fieldInputId}
                        type="number"
                        min={field.min ?? 0}
                        max={field.max}
                        step={field.step ?? 1}
                        value={inputs[field.id] ?? ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="calc-input"
                        placeholder="0"
                      />
                      {field.suffix && <span className="input-suffix">{field.suffix}</span>}
                    </div>
                  ) : field.type === 'select' ? (
                    <select
                      id={fieldInputId}
                      value={inputs[field.id]}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="calc-select"
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'boolean' ? (
                    <div className="checkbox-wrapper">
                      <label className="toggle-label">
                        <input
                          id={fieldInputId}
                          type="checkbox"
                          checked={Boolean(inputs[field.id])}
                          onChange={(e) => handleInputChange(field.id, e.target.checked)}
                          className="toggle-checkbox"
                        />
                        <span className="toggle-text">Enable Deduction</span>
                      </label>
                    </div>
                  ) : null}

                  {field.helpText && <p className="field-help">{field.helpText}</p>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Output Results Column */}
        <div className="calc-result-card">
          {/* Hero Result Banner */}
          <div className="hero-result-banner">
            <span className="hero-label">{result.heroOutput.label}</span>
            <div className="hero-value">{result.heroOutput.formattedValue}</div>
            {result.heroOutput.description && (
              <p className="hero-desc">{result.heroOutput.description}</p>
            )}

            <button onClick={handleCopyResults} className="btn-copy">
              {copied ? '✓ Copied Summary' : '📋 Copy Results'}
            </button>
          </div>

          {/* Breakdown Table */}
          <div className="breakdown-container">
            <h3 className="breakdown-title">Itemized Pay & Deduction Breakdown</h3>
            <div className="breakdown-list">
              {result.breakdown.map((item) => (
                <div
                  key={item.id}
                  className={`breakdown-row ${item.type === 'highlight' ? 'row-highlight' : ''}`}
                >
                  <div className="item-info">
                    <span className="item-label">{item.label}</span>
                    {item.description && <span className="item-desc">{item.description}</span>}
                  </div>
                  <span className={`item-value val-${item.type || 'neutral'}`}>
                    {item.formattedValue}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Employer Cost Section if present */}
          {result.employerCost && (
            <div className="employer-cost-box">
              <h4 className="employer-cost-title">Employer Total Cost</h4>
              <div className="employer-total-val">{result.employerCost.formattedTotal}</div>
              <ul className="employer-list">
                {result.employerCost.items.map((emp, idx) => (
                  <li key={idx}>
                    <span>{emp.label}:</span> <strong>{emp.formattedValue}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Notes */}
          {result.notes && (
            <div className="result-notes">
              {result.notes.map((note, idx) => (
                <p key={idx}>• {note}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
