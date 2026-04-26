import { useApp } from '../../context/AppContext';

// ─── Berichten (roteren op weekdag) ────────────────────────────────────────
// Vijf opties — gedragsgericht, geen beloftes, geen getallen.
const readinessMessages = [
  {
    headline: 'Je bent goed op weg 💪',
    sub: 'We zien steeds meer verantwoordelijkheid.',
  },
  {
    headline: 'Je laat steeds vaker zien dat je afspraken nakomt',
    sub: 'Blijf zo doorgaan 🔥',
  },
  {
    headline: 'Elke dag dat je het probeert telt mee',
    sub: 'Niet perfect hoeft niet — doorgaan wel. ⭐',
  },
  {
    headline: 'We zien het gewoon groeien',
    sub: 'Je keuzes maken het verschil. 🌱',
  },
  {
    headline: 'Je wordt iemand die voor zichzelf zorgt',
    sub: 'Dat is precies wat helpt. 👏',
  },
];

function getMessage() {
  return readinessMessages[new Date().getDay() % readinessMessages.length];
}

// ─── Micro-feedback: welke habits gaan goed de afgelopen 7 dagen? ───────────
// Toont max 2 bullets voor habits met ≥ 2 succesvolle check-ins in 7 dagen.
// Als er geen data is: geen bullets (geen placeholder rommel).
function getPositiveHabits(habits, checkIns) {
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - i * 86400000);
    return d.toISOString().split('T')[0];
  });

  return habits
    .filter(h => h.status === 'active')
    .filter(habit => {
      const hits = last7.filter(date => {
        const ci = checkIns.find(c => c.habitId === habit.id && c.date === date);
        return ci && (ci.status === 'self_done' || ci.status === 'with_help');
      }).length;
      return hits >= 2;
    })
    .slice(0, 2);
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function RewardProgressBar() {
  const { reward, habits, checkIns } = useApp();

  // progressPercent komt uit AppContext (instelbaar via ouder-scherm).
  // We tonen het NIET als getal — alleen als zachte balk.
  // Clamp: altijd tussen 8% en 88% zodat de balk nooit leeg of vol oogt.
  const fillPct = Math.min(88, Math.max(8, reward.progressPercent ?? 40));

  const message = getMessage();
  const goodHabits = getPositiveHabits(habits, checkIns);

  return (
    <div style={styles.container}>

      {/* ── Decoratieve achtergrondgloed ── */}
      <div style={styles.bgGlow} aria-hidden="true" />

      {/* ── Top-rij: icoon + titel + boodschap ── */}
      <div style={styles.topRow}>
        <span style={styles.icon} aria-hidden="true">🎮</span>
        <div style={styles.textBlock}>
          <h2 style={styles.title}>{reward.title}</h2>
          <p style={styles.headline}>{message.headline}</p>
          <p style={styles.sub}>{message.sub}</p>
        </div>
      </div>

      {/* ── Zachte voortgangsbalk (geen getallen, geen ticks) ── */}
      <div
        style={styles.track}
        role="progressbar"
        aria-label="Gereedheid voor Game PC"
        aria-valuenow={fillPct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div style={{ ...styles.fill, width: `${fillPct}%` }} />
      </div>

      {/* ── Micro-feedback bullets ── */}
      {goodHabits.length > 0 && (
        <ul style={styles.bulletList} aria-label="Wat goed gaat">
          {goodHabits.map(h => (
            <li key={h.id} style={styles.bullet}>
              <span style={styles.bulletCheck} aria-hidden="true">✔</span>
              <span style={styles.bulletText}>
                {h.emoji} {h.title.toLowerCase()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────
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

  // Zachte paarse gloed rechtsonder — puur decoratief
  bgGlow: {
    position: 'absolute',
    bottom: -30,
    right: -20,
    width: 120,
    height: 120,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(113,7,231,0.25) 0%, transparent 70%)',
    pointerEvents: 'none',
  },

  topRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--space-3)',
    marginBottom: 'var(--space-4)',
  },
  icon: {
    fontSize: 32,
    lineHeight: 1,
    flexShrink: 0,
    marginTop: 2,
  },
  textBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    flex: 1,
  },
  title: {
    // Bangers via globale h2-regel in index.css
    fontSize: 'var(--font-size-xl)',
    color: 'var(--color-text-on-dark)',
    lineHeight: 1,
    marginBottom: 1,
  },
  headline: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 700,
    color: 'rgba(223,231,255,0.95)',
    lineHeight: 1.35,
  },
  sub: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--font-size-xs)',
    color: 'rgba(223,231,255,0.55)',
    lineHeight: 1.3,
  },

  // Zachte balk — geen ticks, geen getallen
  track: {
    position: 'relative',
    height: 8,
    backgroundColor: 'rgba(223,231,255,0.10)',
    borderRadius: 'var(--radius-sm)',
    overflow: 'hidden',
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
    transition: 'width 1.2s cubic-bezier(0.34,1.56,0.64,1)',
  },

  // Micro-feedback
  bulletList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  bullet: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
  },
  bulletCheck: {
    color: '#A855F7',
    fontSize: 11,
    fontWeight: 700,
    flexShrink: 0,
  },
  bulletText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--font-size-xs)',
    color: 'rgba(223,231,255,0.60)',
    lineHeight: 1.2,
  },
};
