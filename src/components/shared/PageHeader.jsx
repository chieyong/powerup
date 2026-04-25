export default function PageHeader({ title, subtitle, emoji }) {
  return (
    <div style={styles.header}>
      {emoji && <span style={styles.emoji}>{emoji}</span>}
      {/* h1 pikt de globale Bangers-regel op uit index.css */}
      <h1 style={styles.title}>{title}</h1>
      {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}

const styles = {
  header: {
    padding: 'var(--space-5) var(--space-5) var(--space-4)',
  },
  emoji: {
    fontSize: 28,
    display: 'block',
    marginBottom: 'var(--space-1)',
    lineHeight: 1,
  },
  title: {
    /* font-family: Bangers via globale h1-regel in index.css */
    fontSize: 'var(--font-size-2xl)',
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--space-1)',
  },
  subtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.4,
  },
};
