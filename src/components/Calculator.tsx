'use client';

import { useState, useEffect } from 'react';
import { calculateTaxComparison, formatBRL, TaxCalculationResult } from '@/lib/tax-calculator';
import { analytics, getSalaryBand, getSavingBand } from '@/lib/analytics';

interface CalculatorProps {
  initialSalary?: number;
  autoFocus?: boolean;
}

export default function Calculator({ initialSalary = 6000, autoFocus = false }: CalculatorProps) {
  const [salaryInput, setSalaryInput] = useState<string>(initialSalary ? String(initialSalary) : '6000');
  const [dependents, setDependents] = useState<number>(0);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [result, setResult] = useState<TaxCalculationResult>(() => calculateTaxComparison(initialSalary, { dependents }));

  const presets = [3000, 4000, 5000, 5500, 6000, 7000, 8000, 10000];

  const handleSalaryChange = (val: string) => {
    // Clean non-numeric input except digits and comma/dot
    const cleanVal = val.replace(/[^0-9.,]/g, '');
    setSalaryInput(cleanVal);

    if (!hasInteracted) {
      setHasInteracted(true);
      analytics.trackCalculatorStart();
    }
  };

  const parsedSalary = parseFloat(salaryInput.replace(/\./g, '').replace(',', '.')) || 0;

  useEffect(() => {
    const res = calculateTaxComparison(parsedSalary, { dependents });
    setResult(res);

    if (parsedSalary > 0) {
      analytics.trackCalculatorComplete({
        salaryBand: getSalaryBand(parsedSalary),
        savingBand: getSavingBand(res.monthlySaving),
        benefitType: res.benefitType,
      });
    }
  }, [parsedSalary, dependents]);

  const handlePresetClick = (presetVal: number) => {
    setSalaryInput(String(presetVal));
    if (!hasInteracted) {
      setHasInteracted(true);
      analytics.trackCalculatorStart();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Input Card */}
      <div className="card" style={{ padding: '2rem' }}>
        <label
          htmlFor="salario-bruto-input"
          style={{ display: 'block', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-brand-primary)' }}
        >
          Informe seu salário mensal bruto (R$)
        </label>

        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <span
            style={{
              position: 'absolute',
              left: '1.25rem',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--color-text-muted)',
            }}
          >
            R$
          </span>
          <input
            id="salario-bruto-input"
            type="text"
            className="input-field"
            style={{ paddingLeft: '3.75rem' }}
            value={salaryInput}
            onChange={(e) => handleSalaryChange(e.target.value)}
            placeholder="Ex: 5000"
            autoFocus={autoFocus}
          />
        </div>

        {/* Quick Preset Buttons */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            Exemplos rápidos:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                className="btn btn-outline"
                style={{
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.85rem',
                  backgroundColor: parsedSalary === p ? 'var(--color-brand-primary)' : 'transparent',
                  color: parsedSalary === p ? '#ffffff' : 'var(--color-text-main)',
                  borderColor: parsedSalary === p ? 'var(--color-brand-primary)' : 'var(--color-border-subtle)',
                }}
                onClick={() => handlePresetClick(p)}
              >
                R$ {p.toLocaleString('pt-BR')}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Options Accordion */}
        <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1rem' }}>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-brand-accent)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
            }}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <span>{showAdvanced ? '▼' : '►'}</span>
            <span>Configurações avançadas (dependentes, INSS)</span>
          </button>

          {showAdvanced && (
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div>
                <label htmlFor="dependents-select" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Número de dependentes
                </label>
                <select
                  id="dependents-select"
                  value={dependents}
                  onChange={(e) => setDependents(Number(e.target.value))}
                  style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)', width: '100%', maxWidth: '200px' }}
                >
                  <option value={0}>Nenhum dependente</option>
                  <option value={1}>1 dependente (-R$ 189,59)</option>
                  <option value={2}>2 dependentes (-R$ 379,18)</option>
                  <option value={3}>3 dependentes (-R$ 568,77)</option>
                  <option value={4}>4 ou mais dependentes</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {parsedSalary > 0 && (
        <div className="card card-hero-result" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <span className="text-muted" style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Resultado do Cálculo IR 2026
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginTop: '0.25rem' }}>
                {result.monthlySaving > 0 ? (
                  <>Sua economia estimada: <span className="text-emerald">{formatBRL(result.monthlySaving)} / mês</span></>
                ) : (
                  <>Imposto mantido sem alteração</>
                )}
              </h2>
            </div>

            <div>
              {result.benefitType === 'ISENTO_TOTAL' && <span className="badge badge-isento">🎉 Isenção Total 2026</span>}
              {result.benefitType === 'REDUCAO_PARCIAL' && <span className="badge badge-reducao">📉 Redução Gradual 2026</span>}
              {result.benefitType === 'FORA_DO_BENEFICIO' && <span className="badge badge-padrao">⚖️ Tabela Padrão</span>}
            </div>
          </div>

          {/* Hero Savings Breakdown */}
          <div
            style={{
              backgroundColor: result.monthlySaving > 0 ? 'var(--color-emerald-bg)' : '#f1f5f9',
              border: `1px solid ${result.monthlySaving > 0 ? 'var(--color-emerald-border)' : '#cbd5e1'}`,
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              marginBottom: '2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              textAlign: 'center',
            }}
          >
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block' }}>
                Economia Mensal
              </span>
              <strong style={{ fontSize: '2rem', color: result.monthlySaving > 0 ? 'var(--color-emerald-heading)' : 'var(--color-text-main)' }}>
                {formatBRL(result.monthlySaving)}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block' }}>
                Economia Anual (12 meses)
              </span>
              <strong style={{ fontSize: '2rem', color: result.monthlySaving > 0 ? 'var(--color-emerald-heading)' : 'var(--color-text-main)' }}>
                {formatBRL(result.annualSaving12Months)}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600, display: 'block' }}>
                Economia com 13º Salário
              </span>
              <strong style={{ fontSize: '2rem', color: result.monthlySaving > 0 ? 'var(--color-emerald-heading)' : 'var(--color-text-main)' }}>
                {formatBRL(result.annualSaving13Months)}
              </strong>
            </div>
          </div>

          {/* Comparison Grid */}
          <div className="grid-2" style={{ marginBottom: '2rem' }}>
            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Antes das novas regras (2025)
              </span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.5rem', color: '#dc2626' }}>
                {formatBRL(result.oldTax)} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>/mês</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                Alíquota efetiva: {result.oldEffectiveRate}%
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-emerald-border)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-emerald-text)', fontWeight: 700, textTransform: 'uppercase' }}>
                Com as regras de 2026
              </span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--color-emerald-heading)' }}>
                {formatBRL(result.newTax)} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>/mês</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                Alíquota efetiva: {result.newEffectiveRate}%
                {result.reducerAmount > 0 && ` (Redutor aplicado: -${formatBRL(result.reducerAmount)})`}
              </div>
            </div>
          </div>

          {/* Context Explanation */}
          <div style={{ background: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-brand-accent)', marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-main)', lineHeight: '1.6' }}>
              💡 <strong>Entenda seu resultado:</strong> {result.explanation}
            </p>
          </div>

          {/* Disclaimer */}
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginTop: '1.5rem', textAlign: 'center' }}>
            {result.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
}
