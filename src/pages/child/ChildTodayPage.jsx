import { useApp } from '../../context/AppContext';
import RewardProgressBar from '../../components/habit/RewardProgressBar';
import HabitCard from '../../components/habit/HabitCard';

const identityMessages = [
  'Je bent iemand die voor zichzelf zorgt ✨',
  'Je laat elke dag zien dat je kunt groeien 🌱',
  'Je bent bezig met iets wat écht telt 💪',
  'Kleine stappen bouwen grote gewoontes 🏗️',
  'Je wordt elke dag een beetje beter in dit ⭐',
  'Jij kiest voor een betere versie van jezelf 🙌',
  'Doorzetten is ook een gewoonte — en jij oefent hem 🔥',
];

function getIdentityMessage() {
  return identityMessages[new Date().getDay() % identityMessages.length];
}

function getDayProgress(activeHabits, getTodayCheckIn) {
  const done = activeHabits.filter(h => {
    const ci = getTodayCheckIn(h.id);
    return ci && (ci.status === 'self_done' || ci.status === 'with_help');
  }).length;
  return { done, total: activeHabits.length };
}

export default function ChildTodayPage() {
  const { child, activeHabits, getTodayCheckIn } = useApp();
  const { done, total } = getDayProgress(activeHabits, getTodayCheckIn);
  const allDone = done === total && total > 0;

  return (
    <div style={styles.page}>

      {/* ── Slanke reward bar ────────────────────────────────────────────── */}
      <div style={styles.rewardSection}>
        <RewardProgressBar />
      </div>

      {/* ── Habit cards ─────────────────────────────────────────────────── */}
      <section style={styles.habitsSection}>
        <p style={styles.sectionLabel}>Waar je vandaag aan werkt</p>

        {activeHabits.length === 0 ? (
          <div style={styles.empty}>
            <span style={{ fontSize: 40 }}>🌱</span>
            <p>Nog geen actieve gewoontes.<br />Vraag je ouder om er een toe te voegen.</p>
          </div>
        ) : (
          <div style={styles.cardList}>
            {activeHabits.map(habit => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        )}
      </section>

      {/* All done */}
      {allDone && (
        <div style={styles.celebration}>
          <span style={styles.celebIcon}>🏆</span>
          <div>
            <p style={styles.celebTitle}>Alle gewoontes gedaan vandaag.</p>
            <p style={styles.celebSub}>Je laat zien dat je het kunt — gewoon door het te doen.</p>
          </div>
        </div>
      )}

      {/* Identity */}
      <div style={styles.identityMsg}>
        <span style={styles.identityText}>{getIdentityMessage()}</span>
      </div>
    </div>
  );
}

const styles = {
  page: {
    paddingBottom: 'var(--space-8)',
  },

  rewardSection: {
    marginTop: 'var(--space-4)',
    marginBottom: 'var(--space-4)',
  },

  habitsSection: {
    padding: '0 var(--space-5)',
  },
  sectionLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--color-text-muted)',
    marginBottom: 'var(--space-3)',
  },
  cardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-3)',
  },
  empty: {
    textAlign: 'center',
    padding: 'var(--space-10) var(--space-5)',
    color: 'var(--color-text-muted)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-3)',
    alignItems: 'center',
    fontFamily: 'var(--font-body)',
  },

  celebration: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    margin: 'var(--space-4) var(--space-5) 0',
    padding: 'var(--space-3) var(--space-4)',
    backgroundColor: 'var(--color-dark)',
    border: '1px solid rgba(113,7,231,0.40)',
    borderRadius: 'var(--radius-md)',
    boxShadow: '0 0 16px var(--color-purple-glow)',
  },
  celebIcon: { fontSize: 28, flexShrink: 0 },
  celebTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--font-size-md)',
    color: 'var(--color-text-on-dark)',
    letterSpacing: '0.02em',
    lineHeight: 1.1,
  },
  celebSub: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--font-size-sm)',
    color: 'rgba(223,231,255,0.60)',
  },

  identityMsg: {
    textAlign: 'center',
    padding: 'var(--space-5) var(--space-5) 0',
  },
  identityText: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
  },
};
