import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { categoryMeta, checkinLabels } from '../../data/mockData';
import WhyCard from '../../components/habit/WhyCard';
import ReplacementPicker from '../../components/habit/ReplacementPicker';
import IfThenPlan from '../../components/habit/IfThenPlan';

export default function HabitDetailPage() {
  const { habitId } = useParams();
  const navigate = useNavigate();
  const { habits, getTodayCheckIn, setCheckIn } = useApp();

  const habit = habits.find(h => h.id === habitId);
  if (!habit) {
    return (
      <div style={styles.notFound}>
        <span style={{ fontSize: 48 }}>🤔</span>
        <p>Gewoonte niet gevonden.</p>
        <button style={styles.backBtn} onClick={() => navigate('/')}>Terug</button>
      </div>
    );
  }

  const meta = categoryMeta[habit.category];
  const checkIn = getTodayCheckIn(habit.id);
  const categoryColor = `var(${meta.color})`;
  const categoryColorSoft = `var(${meta.colorSoft})`;

  // Gekozen alternatief uit het groene blok — vloeit door naar het paarse DAN-blok
  const [chosenReplacement, setChosenReplacement] = useState(null);

  return (
    <div style={styles.page}>
      {/* Back button */}
      <button style={styles.backBtn} onClick={() => navigate(-1)} aria-label="Terug">
        ← Terug
      </button>

      {/* Hero */}
      <div style={{ ...styles.hero, background: categoryColorSoft }}>
        <span style={styles.heroEmoji}>{habit.emoji}</span>
        <div>
          <div style={{ ...styles.categoryBadge, color: categoryColor, borderColor: categoryColor }}>
            {meta.emoji} {meta.label}
          </div>
          <h1 style={styles.heroTitle}>{habit.title}</h1>
        </div>
      </div>

      {/* Difficulty */}
      <div style={styles.diffRow}>
        <span style={styles.diffLabel}>Moeilijkheid:</span>
        <span style={styles.diffValue}>
          {habit.difficulty === 'easy' && '🟢 Makkelijk'}
          {habit.difficulty === 'medium' && '🟡 Beetje lastig'}
          {habit.difficulty === 'hard' && '🔴 Uitdagend'}
        </span>
      </div>

      {/* Content sections */}
      <div style={styles.sections}>
        <WhyCard why={habit.why} />
        <ReplacementPicker options={habit.replacementOptions} onChoose={setChosenReplacement} />
        <IfThenPlan ifThenRule={habit.ifThenRule} chosenReplacement={chosenReplacement} />
      </div>

      {/* Today check-in sticky bottom */}
      <div style={styles.checkInBox}>
        <p style={styles.checkInTitle}>Hoe ging het vandaag?</p>
        <div style={styles.checkInRow}>
          {Object.entries(checkinLabels).map(([key, val]) => {
            const isActive = checkIn?.status === key;
            return (
              <button
                key={key}
                style={{
                  ...styles.checkBtn,
                  backgroundColor: isActive ? val.color : 'var(--color-bg-subtle)',
                  color: isActive ? '#fff' : 'var(--color-text-secondary)',
                  border: isActive ? `2px solid ${val.color}` : '2px solid var(--color-border)',
                  transform: isActive ? 'scale(1.06)' : 'scale(1)',
                }}
                onClick={() => setCheckIn(habit.id, key)}
                aria-pressed={isActive}
              >
                <span style={styles.checkBtnIcon}>{val.emoji}</span>
                <span style={styles.checkBtnLabel}>{val.label}</span>
              </button>
            );
          })}
        </div>
        {checkIn && (
          <p style={styles.checkInFeedback}>
            {checkIn.status === 'self_done' && '⭐ Super! Jij doet het gewoon zelf!'}
            {checkIn.status === 'with_help' && '🤝 Samen lukt het ook — dat telt écht mee!'}
            {checkIn.status === 'not_yet' && '💭 Geen probleem. Morgen is er een nieuwe kans.'}
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    paddingBottom: 'var(--space-10)',
  },
  notFound: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-4)',
    padding: 'var(--space-12) var(--space-5)',
    color: 'var(--color-text-muted)',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    margin: 'var(--space-4) var(--space-5)',
    padding: '8px var(--space-4)',
    backgroundColor: 'var(--color-bg-subtle)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
  },
  hero: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-4)',
    padding: 'var(--space-5)',
    margin: '0 var(--space-5) var(--space-5)',
    borderRadius: 'var(--radius-xl)',
  },
  heroEmoji: {
    fontSize: 52,
    flexShrink: 0,
    lineHeight: 1,
  },
  categoryBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 'var(--font-size-xs)',
    fontWeight: 'var(--font-weight-bold)',
    border: '1.5px solid',
    padding: '3px 10px',
    borderRadius: 'var(--radius-full)',
    marginBottom: 'var(--space-2)',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  heroTitle: {
    fontSize: 'var(--font-size-lg)',
    fontWeight: 'var(--font-weight-black)',
    color: 'var(--color-text-primary)',
    lineHeight: 1.2,
  },
  diffRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    padding: '0 var(--space-5)',
    marginBottom: 'var(--space-5)',
  },
  diffLabel: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-muted)',
  },
  diffValue: {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-text-secondary)',
  },
  sections: {
    padding: '0 var(--space-5)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-4)',
  },
  checkInBox: {
    margin: 'var(--space-6) var(--space-5) 0',
    padding: 'var(--space-5)',
    backgroundColor: 'var(--color-bg-card)',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-md)',
    border: '1px solid var(--color-border)',
  },
  checkInTitle: {
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text-primary)',
    textAlign: 'center',
    marginBottom: 'var(--space-3)',
  },
  checkInRow: {
    display: 'flex',
    gap: 'var(--space-2)',
  },
  checkBtn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    padding: 'var(--space-3) var(--space-2)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    fontFamily: 'var(--font-family)',
  },
  checkBtnIcon: {
    fontSize: 22,
    lineHeight: 1,
  },
  checkBtnLabel: {
    fontSize: 11,
    fontWeight: 'var(--font-weight-medium)',
    textAlign: 'center',
    lineHeight: 1.2,
  },
  checkInFeedback: {
    marginTop: 'var(--space-3)',
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-secondary)',
    textAlign: 'center',
    padding: '6px var(--space-3)',
    backgroundColor: 'var(--color-bg-subtle)',
    borderRadius: 'var(--radius-md)',
  },
};
