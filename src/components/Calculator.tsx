'use client';

import { useState, useEffect, useId } from 'react';
import { calculateTaxComparison, formatBRL, TaxCalculationResult } from '@/lib/tax-calculator';
import { analytics, getSalaryBand, getSavingBand } from '@/lib/analytics';

interface CalculatorProps {
  initialSalary?: number;
  autoFocus?: boolean;
}

const PRESETS = [3000, 4000, 5000, 6000, 7000, 8000, 10000];

const BADGE = {
  ISENTO_TOTAL: { cls: 'ci-badge ci-badge--isento', label: 'Sem IRRF em 2026' },
  REDUCAO_PARCIAL: { cls: 'ci-badge ci-badge--parcial', label: 'Redutor parcial' },
  FORA_DO_BENEFICIO: { cls: 'ci-badge ci-badge--padrao', label: 'Tabela progressiva' },
} as const;

const digits = (v: string) => v.replace(/[^\d]/g, '');
const grouped = (d: string) => (d === '' ? '' : new Intl.NumberFormat('pt-BR').format(Number(d)));

export default function Calculator({ initialSalary = 6000, autoFocus = false }: CalculatorProps) {
  const uid = useId();
  const [salaryInput, setSalaryInput] = useState<string>(String(initialSalary));
  const [dependents, setDependents] = useState<number>(0);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [result, setResult] = useState<TaxCalculationResult>(() =>
    calculateTaxComparison(initialSalary, { dependents: 0 }),
  );

  const parsedSalary = Number(digits(salaryInput)) || 0;

  const touch = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      analytics.trackCalculatorStart();
    }
  };

  useEffect(() => {
    const res = calculateTaxComparison(parsedSalary, { dependents });
    setResult(res);

    if (parsedSalary > 0) {
      // Bands only — never the exact salary or any computed value.
      analytics.trackCalculatorComplete({
        salaryBand: getSalaryBand(parsedSalary),
        savingBand: getSavingBand(res.monthlySaving),
        benefitType: res.benefitType,
      });
    }
  }, [parsedSalary, dependents]);

  const badge = BADGE[result.benefitType];
  const hasSalary = parsedSalary > 0;
  const saves = result.monthlySaving > 0;

  // Bar widths are relative to the larger of the two taxes, so the drop is visible.
  const maxTax = Math.max(result.oldTax, result.newTax, 1);
  const oldPct = Math.round((result.oldTax / maxTax) * 100);
  const newPct = Math.round((result.newTax / maxTax) * 100);

  return (
    <div className="ci-calc" id="calculadora">
      <div className="ci-calc__head">
        <h2 className="ci-calc__title">Simule o seu IRRF mensal</h2>
      </div>

      <div className="ci-calc__body">
        <div>
          <label className="ci-label" htmlFor="salario-bruto-input">
            Salário bruto mensal
          </label>
          <div className="ci-money">
            <span className="ci-money__prefix" aria-hidden="true">
              R$
            </span>
            <input
              id="salario-bruto-input"
              className="ci-input"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={grouped(digits(salaryInput))}
              placeholder="6.000"
              autoFocus={autoFocus}
              onChange={(e) => {
                touch();
                setSalaryInput(digits(e.target.value));
              }}
            />
          </div>
        </div>

        <div className="ci-presets" role="group" aria-label="Exemplos rápidos de salário">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              className="ci-preset"
              aria-pressed={parsedSalary === p}
              onClick={() => {
                touch();
                setSalaryInput(String(p));
              }}
            >
              R$ {p.toLocaleString('pt-BR')}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="ci-adv"
          aria-expanded={showAdvanced}
          aria-controls={`${uid}-adv`}
          onClick={() => setShowAdvanced((v) => !v)}
        >
          <span aria-hidden="true">{showAdvanced ? '▾' : '▸'}</span> Dependentes
        </button>

        {showAdvanced && (
          <div id={`${uid}-adv`}>
            <label className="ci-label" htmlFor={`${uid}-dep`}>
              Número de dependentes
            </label>
            <select
              id={`${uid}-dep`}
              className="ci-select"
              value={dependents}
              onChange={(e) => {
                touch();
                setDependents(Number(e.target.value));
              }}
            >
              <option value={0}>Nenhum</option>
              <option value={1}>1 dependente (−R$ 189,59)</option>
              <option value={2}>2 dependentes (−R$ 379,18)</option>
              <option value={3}>3 dependentes (−R$ 568,77)</option>
              <option value={4}>4 dependentes (−R$ 758,36)</option>
            </select>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------- result panel */}
      <div className="ci-result" aria-live="polite">
        <span className="ci-result__lead">Sua economia mensal em 2026</span>

        {!hasSalary ? (
          <p className="ci-result__none">Informe seu salário</p>
        ) : saves ? (
          <p className="ci-result__figure">
            {formatBRL(result.monthlySaving)} <span>/mês</span>
          </p>
        ) : (
          <p className="ci-result__none">Sem alteração em relação a 2025</p>
        )}

        <span className={badge.cls}>{badge.label}</span>

        <div className="ci-compare">
          <div className="ci-compare__col ci-compare__col--old">
            <span className="ci-compare__year">IRRF em 2025</span>
            <div className="ci-compare__val">{hasSalary ? formatBRL(result.oldTax) : '—'}</div>
            <div className="ci-compare__rate">Alíquota efetiva {result.oldEffectiveRate}%</div>
            <div className="ci-compare__bar">
              <i style={{ width: `${hasSalary ? oldPct : 0}%` }} />
            </div>
          </div>

          <div className="ci-compare__arrow" aria-hidden="true">
            →
          </div>

          <div className="ci-compare__col ci-compare__col--new">
            <span className="ci-compare__year">IRRF em 2026</span>
            <div className="ci-compare__val">{hasSalary ? formatBRL(result.newTax) : '—'}</div>
            <div className="ci-compare__rate">Alíquota efetiva {result.newEffectiveRate}%</div>
            <div className="ci-compare__bar">
              <i style={{ width: `${hasSalary ? newPct : 0}%` }} />
            </div>
          </div>
        </div>

        <div className="ci-secondary">
          <div>
            Economia anual
            <b>{hasSalary ? formatBRL(result.annualSaving12Months) : '—'}</b>
          </div>
          <div>
            Com o 13º
            <b>{hasSalary ? formatBRL(result.annualSaving13Months) : '—'}</b>
          </div>
        </div>

        <details className="ci-break">
          <summary>Ver o cálculo passo a passo</summary>
          <dl>
            <div>
              <dt>INSS (tabela 2026)</dt>
              <dd>−{formatBRL(result.inssDeduction)}</dd>
            </div>
            {result.dependentDeduction > 0 && (
              <div>
                <dt>Dedução por dependentes</dt>
                <dd>−{formatBRL(result.dependentDeduction)}</dd>
              </div>
            )}
            <div>
              <dt>Base de cálculo 2026</dt>
              <dd>{formatBRL(result.taxableIncome)}</dd>
            </div>
            <div>
              <dt>Imposto pela tabela 2026</dt>
              <dd>{formatBRL(result.taxBeforeRedutor)}</dd>
            </div>
            <div>
              <dt>Redutor (Lei 15.270/2025)</dt>
              <dd>−{formatBRL(result.reducerAmount)}</dd>
            </div>
            <div>
              <dt>IRRF retido em 2026</dt>
              <dd>{formatBRL(result.newTax)}</dd>
            </div>
          </dl>
          <p className="ci-note">{result.explanation}</p>
        </details>

        <p className="ci-note">
          🔒 O cálculo acontece no seu navegador. Nenhum valor digitado é enviado ou armazenado.
          {' '}
          {result.disclaimer}
        </p>
      </div>
    </div>
  );
}
