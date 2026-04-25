import Card from '../shared/Card';

export default function WhyCard({ why }) {
  return (
    <Card style={styles.card}>
      <div style={styles.header}>
        <span style={styles.icon}>💡</span>
        <span style={styles.title}>Waarom is dit belangrijk?</span>
      </div>
      <ul style={styles.list}>
        {why.map((reason, i) => (
          <li key={i} style={styles.item}>
            <span style={styles.bullet}>✓</span>
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

const styles = {
  card: {
    backgroundColor: 'var(--color-amber-soft)',
    border: '1px solid var(--color-amber)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-5)',
    boxShadow: 'none',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    marginBottom: 'var(--space-3)',
  },
  icon: {
    fontSize: 22,
  },
  title: {
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text-primary)',
  },
  list: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
  },
  item: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--space-2)',
    fontSize: 'var(--font-size-base)',
    color: 'var(--color-text-primary)',
    lineHeight: 1.4,
  },
  bullet: {
    color: 'var(--color-amber)',
    fontWeight: 'var(--font-weight-bold)',
    flexShrink: 0,
    fontSize: 'var(--font-size-md)',
    lineHeight: 1.2,
  },
};
