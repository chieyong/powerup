import { useApp } from '../../context/AppContext';
import RewardProgressBar from '../../components/habit/RewardProgressBar';
import HabitCard from '../../components/habit/HabitCard';

// Wisselt dagelijks — voorkomt dat het een lege frase wordt
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
  const dayIndex = new Date().getDay(); // 0–6, stabiel per dag
  return identityMessages[dayIndex % identityMessages.length];
}

function getGreeting(name) {
  const h = new Date().getHours();
  if (h < 12) return `Goedemorgen, ${name}! 🌤️`;
  if (h < 17) return `Hallo, ${name}! ☀️`;
  return `Goedenavond, ${name}! 🌙`;
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

  const today = new Date().toLocaleDateString('nl-NL', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <div style={styles.page}>
      {/* Greeting */}
      <div style={styles.greeting}>
        <h1 style={styles.greetingText}>{getGreeting(child.name)}</h1>
        <p style={styles.date}>{today}</p>
      </div>

      {/*
        ── VOOR/NA: Day summary pill ───────────────────────────────────────────
        VOOR: "${done} van ${total} gewoontes vandaag" → telt, vergelijkt
        NA:   kwalitatieve zin afhankelijk van voortgang → beschrijft, moedigt aan
        WAAROM: "2 van 3" nodigt uit tot tellen en optimaliseren.
                Een zin nodigt uit tot nadenken over de dag.
      */}
      <div style={styles.summaryPill}>
        <div style={styles.summaryTrack}>
          <div style={{ ...styles.summaryFill, width: `${total > 0 ? (done / total) * 100 : 0}%` }} />
        </div>
        <span style={styles.summaryText}>
          {allDone
            ? 'Je hebt vandaag goed aan jezelf gedacht 🌟'
            : done > 0
              ? 'Je bent al goed op weg vandaag'
              : 'Hoe gaat het vandaag?'}
        </span>
      </div>

      {/* Reward bar */}
      <section style={styles.rewardSection}>
        <RewardProgressBar />
      </section>

      {/* Habit cards */}
      <section style={styles.habitsSection}>
        {/*
          ── VOOR/NA: Sectionheader ─────────────────────────────────────────────
          VOOR: "MIJN GEWOONTES VANDAAG" in caps + "{n}/3" badge
          NA:   warmere zin + badge verwijderd
          WAAROM: caps + teller geeft rapport-gevoel. Een zin voelt als context.
                  De "3" is een technische beperking, geen doel om te halen.
        */}
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Waar je vandaag aan werkt</h2>
        </div>

        {activeHabits.length === 0 ? (
          <div style={styles.empty}>
            <span style={{ fontSize: 48 }}>🌱</span>
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

      {/* All done celebration */}
      {allDone && (
        <div style={styles.celebration}>
          <span style={styles.celebIcon}>🏆</span>
          <div>
            {/*
              VOOR: "Waanzinnig goed gedaan vandaag!" — te enthousiast, voelt als beloning
              NA:   rustiger, meer gericht op wat het betekent dan op de prestatie
              WAAROM: overdreven lof verschuift focus van gewoonte naar goedkeuring zoeken.
                      Rustige bevestiging bouwt intrinsieke motivatie.
            */}
            <p style={styles.celebTitle}>Alle gewoontes gedaan vandaag.</p>
            <p style={styles.celebSub}>Je laat zien dat je het kunt — gewoon door het te doen.</p>
          </div>
        </div>
      )}

      {/*
        ── Identiteitsbericht ──────────────────────────────────────────────────
        VOOR: "Je bent iemand die voor zichzelf zorgt ✨"
        NA:   wisselt per dag — voorkomt dat het een lege frase wordt
        WAAROM: variatie houdt het oprecht. Als het elke dag hetzelfde is,
                lees je het niet meer.
      */}
      <div style={styles.identityMsg}>
        <span style={styles.identityText}>
          {getIdentityMessage()}
        </span>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: 'var(--space-5) 0 var(--space-6)',
  },
  greeting: {
    padding: '0 var(--space-5)',
    marginBottom: 'var(--space-4)',
  },
  greetingText: {
    /* h1 → Bangers via globale CSS-regel */
    fontSize: 'var(--font-size-2xl)',
    color: 'var(--color-text-primary)',
    lineHeight: 1.1,
    marginBottom: 'var(--space-1)',
  },
  date: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  summaryPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    margin: '0 var(--space-5) var(--space-5)',
    backgroundColor: 'var(--color-dark)',
    borderRadius: 'var(--radius-md)',
    padding: '10px var(--space-4)',
    border: '1px solid rgba(113,7,231,0.25)',
  },
  summaryTrack: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(223,231,255,0.12)',
    borderRadius: 'var(--radius-sm)',
    overflow: 'hidden',
  },
  summaryFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--color-purple), #A855F7)',
    borderRadius: 'var(--radius-sm)',
    transition: 'width 0.5s ease',
    boxShadow: '0 0 6px var(--color-purple-glow)',
  },
  summaryText: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--font-size-sm)',
    color: 'rgba(223,231,255,0.80)',
    flexShrink: 0,
  },
  rewardSection: {
    marginBottom: 'var(--space-5)',
  },
  habitsSection: {
    padding: '0 var(--space-5)',
  },
  sectionHeader: {
    marginBottom: 'var(--space-3)',
  },
  sectionTitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--font-size-xs)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--color-text-muted)',
  },
  cardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-4)',
  },
  empty: {
    textAlign: 'center',
    padding: 'var(--space-10) var(--space-5)',
    color: 'var(--color-text-muted)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-3)',
    alignItems: 'center',
  },
  celebration: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    margin: 'var(--space-5) var(--space-5) 0',
    padding: 'var(--space-4)',
    backgroundColor: 'var(--color-dark)',
    border: '1px solid rgba(113,7,231,0.40)',
    borderRadius: 'var(--radius-md)',
    boxShadow: '0 0 20px var(--color-purple-glow)',
  },
  celebIcon: {
    fontSize: 32,
    flexShrink: 0,
  },
  celebTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--font-size-lg)',
    color: 'var(--color-text-on-dark)',
    letterSpacing: '0.02em',
    lineHeight: 1.1,
  },
  celebSub: {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--font-size-sm)',
    color: 'rgba(223,231,255,0.65)',
  },
  identityMsg: {
    textAlign: 'center',
    padding: 'var(--space-5) var(--space-5) 0',
  },
  identityText: {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
  },
};
