import Card from '../shared/Card';

export default function IfThenPlan({ ifThenRule }) {
  if (!ifThenRule?.if) return null;

  return (
    <Card style={styles.card}>
      <div style={styles.header}>
        <span style={styles.icon}>🗺️</span>
        <span style={styles.title}>Jouw plan</span>
      </div>
      <div style={styles.rule}>
        <div style={styles.row}>
          <span style={styles.keyword}>ALS</span>
          <span style={styles.text}>{ifThenRule.if}</span>
        </div>
        <div style={styles.arrow}>↓</div>
        <div style={styles.row}>
          <span style={{ ...styles.keyword, ...styles.thenKeyword }}>DAN</span>
          <span style={styles.text}>{ifThenRule.then}</span>
        </div>
      </div>
    </Card>
  );
}

const styles = {
  card: {
    backgroundColor: 'var(--color-primary-soft)',
    border: '1px solid var(--color-primary)',
    boxShadow: 'none',
    padding: 'var(--space-5)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    marginBottom: 'var(--space-4)',
  },
  icon: { fontSize: 22 },
  title: {
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text-primary)',
  },
  rule: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-1)',
  },
  row: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--space-3)',
    backgroundColor: 'var(--color-bg-card)',
    padding: 'var(--space-3) var(--space-4)',
    borderRadius: 'var(--radius-md)',
  },
  keyword: {
    fontSize: 'var(--font-size-xs)',
    fontWeight: 'var(--font-weight-black)',
    color: 'var(--color-primary)',
    backgroundColor: 'var(--color-primary-soft)',
    padding: '2px 8px',
    borderRadius: 'var(--radius-full)',
    flexShrink: 0,
    marginTop: 2,
    letterSpacing: '0.5px',
  },
  thenKeyword: {
    color: 'var(--color-green)',
    backgroundColor: 'var(--color-green-soft)',
  },
  text: {
    fontSize: 'var(--font-size-base)',
    color: 'var(--color-text-primary)',
    flex: 1,
    lineHeight: 1.4,
  },
  arrow: {
    textAlign: 'center',
    fontSize: 18,
    color: 'var(--color-text-muted)',
    lineHeight: 1,
    padding: '2px 0',
  },
};
