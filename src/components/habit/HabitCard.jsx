import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { categoryMeta, checkinLabels } from '../../data/mockData';

export default function HabitCard({ habit }) {
  const { getTodayCheckIn, setCheckIn } = useApp();
  const navigate = useNavigate();
  const checkIn = getTodayCheckIn(habit.id);
  const meta = categoryMeta[habit.category];

  const handleCheckIn = (e, status) => {
    e.stopPropagation();
    setCheckIn(habit.id, status);
  };

  const categoryColor = `var(${meta.color})`;
  const categoryColorSoft = `var(${meta.colorSoft})`;

  return (
    <div
      style={styles.card}
      onClick={() => navigate(`/gewoonte/${habit.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/gewoonte/${habit.id}`)}
    >
      {/* Top row: emoji-blok + titel + categorie */}
      <div style={styles.topRow}>
        <span style={{ ...styles.emojiBlock, backgroundColor: categoryColorSoft }}>
          {habit.emoji}
        </span>
        <div style={styles.textBlock}>
          {/* h3 pikt Bangers op via globale regel */}
          <h3 style={styles.title}>{habit.title}</h3>
        </div>
        <span style={styles.chevron}>›</span>
      </div>

      {/* Scheidingslijn */}
      <div style={styles.divider} />

      {/* Check-in knoppen */}
      <div style={styles.checkRow}>
        {Object.entries(checkinLabels).map(([key, val]) => {
          const isActive = checkIn?.status === key;
          return (
            <button
              key={key}
              style={{
                ...styles.checkBtn,
                backgroundColor: isActive ? val.color : 'var(--color-bg-subtle)',
                color: isActive ? '#fff' : 'var(--color-text-secondary)',
                transform: isActive ? 'scale(1.03)' : 'scale(1)',
                boxShadow: isActive ? `0 2px 10px ${val.color}55` : 'none',
                borderColor: isActive ? val.color : 'var(--color-border)',
              }}
              onClick={(e) => handleCheckIn(e, key)}
              aria-pressed={isActive}
              aria-label={val.label}
            >
              <span style={styles.checkIcon}>{val.emoji}</span>
              <span style={styles.checkLabel}>{val.label}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {checkIn && (
        <div style={styles.feedback}>
          {checkIn.status === 'self_done' && '⭐ Zelf gedaan — goed bezig!'}
          {checkIn.status === 'with_help' && '🤝 Hulp vragen is ook een kracht.'}
          {checkIn.status === 'not_yet'   && '💭 Nog niet — dat is ook oké.'}
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'var(--color-bg-card)',
    borderRadius: 'var(--radius-md)',        /* 8px — scherper Tetris-stijl */
    padding: 'var(--space-4)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--color-border)',
    cursor: 'pointer',
    transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
    userSelect: 'none',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    marginBottom: 'var(--space-3)',
  },
  emojiBlock: {
    fontSize: 26,
    width: 48,
    height: 48,
    borderRadius: 'var(--radius-sm)',         /* 4px — echte blokvorm */
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textBlock: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  title: {
    /* Bangers via globale h3-regel */
    fontSize: 'var(--font-size-lg)',
    color: 'var(--color-text-primary)',
    lineHeight: 1.1,
  },
  category: {
    fontFamily: 'var(--font-mono)',           /* JetBrains Mono voor labels */
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    fontWeight: 500,
  },
  chevron: {
    fontSize: 20,
    color: 'var(--color-text-muted)',
    flexShrink: 0,
  },
  divider: {
    height: 1,
    backgroundColor: 'var(--color-border)',
    marginBottom: 'var(--space-3)',
  },
  checkRow: {
    display: 'flex',
    gap: 'var(--space-2)',
  },
  checkBtn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
    padding: '8px 4px',
    borderRadius: 'var(--radius-sm)',         /* 4px */
    border: '1px solid',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    fontFamily: 'var(--font-body)',
  },
  checkIcon: {
    fontSize: 18,
    lineHeight: 1,
  },
  checkLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    textAlign: 'center',
    lineHeight: 1.2,
  },
  feedback: {
    marginTop: 'var(--space-3)',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-secondary)',
    textAlign: 'center',
    padding: '6px var(--space-3)',
    backgroundColor: 'var(--color-bg-subtle)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--color-border)',
  },
};
