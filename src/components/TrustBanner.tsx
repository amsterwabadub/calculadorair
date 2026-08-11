export default function TrustBanner() {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '0.875rem 1.25rem',
        fontSize: '0.85rem',
        color: 'var(--color-text-muted)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>✅ <strong>Baseado em fontes oficiais:</strong></span>
        <span>Receita Federal & Lei nº 15.270/2025</span>
      </div>
      <div>
        <span>📅 <strong>Parâmetros verificados em:</strong> 11 de agosto de 2026</span>
      </div>
    </div>
  );
}
