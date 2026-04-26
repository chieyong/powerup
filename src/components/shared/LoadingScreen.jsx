// Laadscherm — getoond terwijl Firestore data ophaalt bij opstarten

export default function LoadingScreen() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <span style={styles.icon}>⚡</span>
        <p style={styles.title}>PowerUp</p>
        <p style={styles.sub}>Even laden…</p>
        <div style={styles.bar}>
          <div style={styles.barFill} />
        </div>
      </div>

      <style>{`
        @keyframes pu-slide {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--color-bg)',
  },
  card: {
    backgroundColor: 'var(--color-dark)',
    borderRadius: 'var(--radius-xl)',
    padding: '36px 48px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 8px 32px rgba(28,32,43,0.25)',
    border: '1px solid rgba(113,7,231,0.28)',
  },
  icon: {
    fontSize: 40,
    lineHeight: 1,
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--font-size-xl)',
    color: 'var(--color-text-on-dark)',
    letterSpacing: '0.03em',
  },
  sub: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'rgba(223,231,255,0.55)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: 8,
  },
  bar: {
    width: 120,
    height: 4,
    backgroundColor: 'rgba(223,231,255,0.10)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    width: '40%',
    backgroundColor: 'var(--color-purple)',
    borderRadius: 2,
    animation: 'pu-slide 1.2s ease-in-out infinite',
  },
};
