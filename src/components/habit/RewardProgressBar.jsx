import { useApp } from '../../context/AppContext';

export default function RewardProgressBar() {
  const { reward } = useApp();
  const pct = Math.min(100, Math.max(0, reward.progressPercent));

  return (
    <div style={styles.container}>
      {/* Top row */}
      <div style={styles.topRow}>
        <span style={styles.icon}>🎮</span>
        <div style={styles.textBlock}>
          {/* Bangers via globale h2-regel */}
          <h2 style={styles.title}>{reward.title}</h2>
          <span style={styles.subtitle}>{reward.nextMilestone}</span>
        </div>
        <span style={styles.pct}>{pct}%</span>
      </div>

      {/* Tetris-pixel track — blokjespatroon als achtergrond */}
      <div
        style={styles.track}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div style={{ ...styles.fill, width: `${pct}%` }} />
        {/* Milestone markers als verticale blokjes */}
        {[25, 50, 75].map(dot => (
          <div
            key={dot}
            style={{
              ...styles.milestone,
              left: `${dot}%`,
              opacity: pct >= dot ? 1 : 0.3,
            }}
          />
        ))}
      </div>

      {/* Weeks row */}
      <div style={styles.weeksRow}>
        <span style={styles.weekLabel}>WEEK {reward.readinessWeeksCompleted}/{reward.targetWeeks}</span>
        <span style={styles.weekLabel}>{reward.targetWeeks - reward.readinessWeeksCompleted} WEKEN TE GAAN</span>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: 'var(--color-dark)',
    borderRadius: 'var(--radius-xl)',
    padding: 'var(--space-5)',
    margin: '0 var(--space-5)',
    boxShadow: '0 4px 24px rgba(28,32,43,0.35), inset 0 1px 0 rgba(223,231,255,0.08)',
    border: '1px solid rgba(113,7,231,0.40)',
    position: 'relative',
    overflow: 'hidden',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    marginBottom: 'var(--space-4)',
  },
  icon: {
    fontSize: 36,
    lineHeight: 1,
    flexShrink: 0,
  },
  textBlock: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: 2,
  },
  title: {
    /* Bangers via globale h2-regel */
    fontSize: 'var(--font-size-xl)',
    color: 'var(--color-text-on-dark)',
    lineHeight: 1,
  },
  subtitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--font-size-xs)',
    color: 'rgba(223,231,255,0.65)',
    lineHeight: 1.3,
  },
  pct: {
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--font-size-2xl)',
    color: 'var(--color-purple)',
    flexShrink: 0,
    lineHeight: 1,
    letterSpacing: '0.02em',
  },
  track: {
    position: 'relative',
    height: 10,
    backgroundColor: 'rgba(223,231,255,0.12)',
    borderRadius: 'var(--radius-sm)',
    overflow: 'visible',
    marginBottom: 'var(--space-3)',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    borderRadius: 'var(--radius-sm)',
    background: 'linear-gradient(90deg, var(--color-purple), #A855F7)',
    boxShadow: '0 0 10px var(--color-purple-glow)',
    transition: 'width 0.7s cubic-bezier(0.34,1.56,0.64,1)',
  },
  milestone: {
    position: 'absolute',
    top: -3,
    transform: 'translateX(-50%)',
    width: 4,
    height: 16,
    backgroundColor: 'rgba(223,231,255,0.50)',
    borderRadius: 2,
    transition: 'opacity var(--transition-base)',
  },
  weeksRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  weekLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    color: 'rgba(223,231,255,0.45)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
};
