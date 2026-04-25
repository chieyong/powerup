export default function Card({ children, style, onClick, accent }) {
  return (
    <div
      style={{
        ...styles.card,
        ...(accent ? { borderLeft: `4px solid ${accent}` } : {}),
        ...(onClick ? { cursor: 'pointer' } : {}),
        ...style,
      }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'var(--color-bg-card)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)',
    padding: 'var(--space-5)',
    border: '1px solid var(--color-border)',
  },
};
