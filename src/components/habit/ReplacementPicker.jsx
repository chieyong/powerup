import { useState } from 'react';
import Card from '../shared/Card';

// onChoose(text | null) — optionele callback zodat de parent de keuze kan doorgeven aan IfThenPlan
export default function ReplacementPicker({ options, onChoose }) {
  const [chosen, setChosen] = useState(null);

  const handlePick = (i) => {
    const next = chosen === i ? null : i;
    setChosen(next);
    onChoose?.(next !== null ? options[next] : null);
  };

  return (
    <Card style={styles.card}>
      <div style={styles.header}>
        <span style={styles.icon}>🔄</span>
        <span style={styles.title}>Wat doe je in plaats daarvan?</span>
      </div>
      <p style={styles.hint}>Kies wat voor jou het beste werkt:</p>
      <div style={styles.grid}>
        {options.map((opt, i) => {
          const isChosen = chosen === i;
          return (
            <button
              key={i}
              style={{
                ...styles.option,
                ...(isChosen ? styles.optionChosen : {}),
              }}
              onClick={() => handlePick(i)}
              aria-pressed={isChosen}
            >
              {isChosen && <span style={styles.checkmark}>✓ </span>}
              {opt}
            </button>
          );
        })}
      </div>
      {chosen !== null && (
        <div style={styles.chosenMessage}>
          🙌 Goed plan! <strong>{options[chosen]}</strong> is een fijne keuze.
        </div>
      )}
    </Card>
  );
}

const styles = {
  card: {
    backgroundColor: 'var(--color-green-soft)',
    border: '1px solid var(--color-green)',
    boxShadow: 'none',
    padding: 'var(--space-5)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    marginBottom: 'var(--space-2)',
  },
  icon: { fontSize: 22 },
  title: {
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text-primary)',
  },
  hint: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-secondary)',
    marginBottom: 'var(--space-3)',
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--space-2)',
  },
  option: {
    padding: '10px var(--space-4)',
    backgroundColor: 'var(--color-bg-card)',
    border: '1.5px solid var(--color-green)',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-green)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    fontFamily: 'var(--font-family)',
  },
  optionChosen: {
    backgroundColor: 'var(--color-green)',
    color: '#fff',
    transform: 'scale(1.04)',
    boxShadow: '0 2px 8px rgba(76,175,130,0.30)',
  },
  checkmark: {
    fontWeight: 'var(--font-weight-bold)',
  },
  chosenMessage: {
    marginTop: 'var(--space-3)',
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-secondary)',
    padding: '8px var(--space-3)',
    backgroundColor: 'rgba(76,175,130,0.12)',
    borderRadius: 'var(--radius-md)',
    textAlign: 'center',
  },
};
