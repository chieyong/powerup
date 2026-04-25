import { useApp } from '../../context/AppContext';
import { categoryMeta } from '../../data/mockData';
import PageHeader from '../../components/shared/PageHeader';

// ─── Kwalitatieve voortgangslabels ──────────────────────────────────────────
// Geen percentages. De balk geeft een gevoel van richting; de tekst geeft betekenis.
function getProgressLabel(progress) {
  if (progress >= 80) return { text: 'Dit wordt al een gewoonte 🔥', strong: true };
  if (progress >= 55) return { text: 'Gaat beter dan vorige week', strong: false };
  if (progress >= 30) return { text: 'Je bent op weg 💪', strong: false };
  if (progress > 0)   return { text: 'Begin is er 🚀', strong: false };
  return               { text: 'Hier kun je nog mee beginnen', strong: false };
}

// ─── Zachte streakbeschrijving ───────────────────────────────────────────────
// Geen getal — gevoel van ritme is genoeg.
function getStreakLabel(streak) {
  if (streak >= 7) return 'Je hebt dit de hele week goed gedaan';
  if (streak >= 4) return 'Je begint ritme te krijgen';
  if (streak >= 2) return 'Je hebt dit een paar dagen goed gedaan';
  return null; // Geen streakbericht bij 0 of 1 dag — geen druk zetten
}

function CategoryMeter({ meta, progress }) {
  const color = `var(${meta.color})`;
  const colorSoft = `var(${meta.colorSoft})`;
  const { text, strong } = getProgressLabel(progress);

  return (
    <div style={{ ...styles.meter, backgroundColor: colorSoft, borderColor: color }}>
      <div style={styles.meterTop}>
        <span style={styles.meterEmoji}>{meta.emoji}</span>
        <div style={styles.meterTextBlock}>
          <span style={styles.meterLabel}>{meta.label}</span>
          <span style={{ ...styles.meterStatus, color, fontWeight: strong ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)' }}>
            {text}
          </span>
        </div>
        {/* Geen percentage — balk geeft al een visuele indicatie */}
      </div>
      {/* Subtiele balk: lager, minder precisie door afgeronde fill */}
      <div style={styles.meterTrack} aria-hidden="true">
        <div
          style={{
            ...styles.meterFill,
            // Snap naar driestappen om niet te exact te zijn
            width: progress >= 80 ? '85%' : progress >= 55 ? '60%' : progress >= 30 ? '35%' : progress > 0 ? '15%' : '0%',
            backgroundColor: color,
            opacity: 0.65,
          }}
        />
      </div>
    </div>
  );
}

export default function GrowthOverviewPage() {
  const { getCategoryProgress, habits, checkIns } = useApp();

  const categories = Object.entries(categoryMeta).map(([key, meta]) => ({
    key,
    meta,
    progress: getCategoryProgress(key),
  }));

  // Streak berekenen — maar als getal niet tonen
  let streak = 0;
  for (let i = 0; i < 14; i++) {
    const date = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
    const hasDone = checkIns.some(
      ci => ci.date === date && (ci.status === 'self_done' || ci.status === 'with_help')
    );
    if (hasDone) streak++;
    else if (i > 0) break;
  }
  const streakLabel = getStreakLabel(streak);

  const maintenanceHabits = habits.filter(h => h.status === 'maintenance');
  const activeHabits      = habits.filter(h => h.status === 'active');

  return (
    <div style={styles.page}>
      <PageHeader
        emoji="🌱"
        title="Mijn Groei"
        subtitle="Hoe gaat het de laatste tijd?"
      />

      {/*
        ── VOOR/NA: Stats row ──────────────────────────────────────────────────
        VOOR: drie kaarten met getallen (streak: 3, maintenance: 2, active: 3)
        NA: twee zachte zinnen die de situatie beschrijven zonder score-gevoel
        WAAROM: getallen leiden tot "tellen" i.p.v. reflecteren. Een zin voelt
        als een gesprek, niet als een rapport.
      */}
      <div style={styles.summaryBox}>
        <p style={styles.summaryLine}>
          {activeHabits.length === 1
            ? 'Je werkt aan 1 gewoonte.'
            : `Je werkt aan ${activeHabits.length} gewoontes.`}
          {maintenanceHabits.length > 0 && (
            <span style={styles.summaryHighlight}>
              {' '}{maintenanceHabits.length === 1
                ? '1 gewoonte gaat al bijna vanzelf 🎉'
                : `${maintenanceHabits.length} gewoontes gaan al bijna vanzelf 🎉`}
            </span>
          )}
        </p>
        {streakLabel && (
          <p style={styles.streakLine}>
            {/* Klein ritme-signaal — geen vuur-emoji met getal */}
            ✨ {streakLabel}
          </p>
        )}
      </div>

      {/*
        ── VOOR/NA: Category meters ────────────────────────────────────────────
        VOOR: sectionTitle "PER GEBIED" in caps + percentage rechts (bijv. "21%")
        NA: warmere sectionTitle, percentage verwijderd, balk niet-precies
        WAAROM: caps + percentages maken het een rapport. Zachte taal + geen
        getal maakt het een gespreksstarter.
      */}
      <div style={styles.metersSection}>
        <h2 style={styles.sectionTitle}>Hoe gaat het per gebied?</h2>
        {/*
          Data-als-gesprek hint: maakt duidelijk dat dit geen oordeel is maar
          input voor het samenmoment.
        */}
        <p style={styles.dataHint}>
          Dit helpt jullie samen de week te bespreken — het is geen cijfer.
        </p>
        <div style={styles.metersList}>
          {categories.map(({ key, meta, progress }) => (
            <CategoryMeter key={key} meta={meta} progress={progress} />
          ))}
        </div>
      </div>

      {/* Gewoontes die al vanzelf gaan */}
      {maintenanceHabits.length > 0 && (
        <div style={styles.maintenanceSection}>
          <h2 style={styles.sectionTitle}>Al bijna automatisch</h2>
          <p style={styles.maintenanceHint}>
            Hier hoef je minder over na te denken — blijf het gewoon doen.
          </p>
          <div style={styles.maintenanceList}>
            {maintenanceHabits.map(h => (
              <div key={h.id} style={styles.maintenanceItem}>
                <span style={styles.maintenanceEmoji}>{h.emoji}</span>
                <span style={styles.maintenanceTitle}>{h.title}</span>
                <span style={styles.maintenanceBadge}>Gaat goed ✓</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/*
        ── Identiteitsbevestiging ───────────────────────────────────────────────
        VOOR: "Je bent bezig met groeien. Elke kleine stap telt mee."
        NA: iets persoonlijker en meer gericht op wie hij aan het worden is
        WAAROM: identiteitsgericht = duurzamer dan prestatiegericht
      */}
      <div style={styles.affirmation}>
        <span style={styles.affirmIcon}>🌟</span>
        <p style={styles.affirmText}>
          Elke keer dat je iets probeert, word je iemand die het kan.
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    paddingBottom: 'var(--space-8)',
  },

  // Zachte summary in plaats van stat-cards met getallen
  summaryBox: {
    margin: '0 var(--space-5) var(--space-5)',
    padding: 'var(--space-4)',
    backgroundColor: 'var(--color-bg-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
  },
  summaryLine: {
    fontSize: 'var(--font-size-base)',
    color: 'var(--color-text-primary)',
    lineHeight: 1.5,
  },
  summaryHighlight: {
    color: 'var(--color-green)',
    fontWeight: 'var(--font-weight-medium)',
  },
  streakLine: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-secondary)',
    fontStyle: 'italic',
  },

  metersSection: {
    padding: '0 var(--space-5)',
    marginBottom: 'var(--space-6)',
  },
  sectionTitle: {
    /* h2 → Bangers via globale CSS-regel */
    fontSize: 'var(--font-size-xl)',
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--space-2)',
  },
  dataHint: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-muted)',
    fontStyle: 'italic',
    marginBottom: 'var(--space-4)',
    lineHeight: 1.4,
  },
  metersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-3)',
  },
  meter: {
    padding: 'var(--space-4)',
    borderRadius: 'var(--radius-lg)',
    border: '1.5px solid',
  },
  meterTop: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    marginBottom: 'var(--space-3)',
  },
  meterEmoji: { fontSize: 26, flexShrink: 0, lineHeight: 1 },
  meterTextBlock: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  meterLabel: {
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text-primary)',
  },
  meterStatus: {
    fontSize: 'var(--font-size-sm)',
  },
  meterTrack: {
    height: 6, // iets dunner — minder nadruk
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    borderRadius: 'var(--radius-full)',
    transition: 'width 0.8s cubic-bezier(0.34,1.26,0.64,1)',
  },

  maintenanceSection: {
    padding: '0 var(--space-5)',
    marginBottom: 'var(--space-6)',
  },
  maintenanceHint: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-secondary)',
    marginBottom: 'var(--space-3)',
    lineHeight: 1.4,
  },
  maintenanceList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
  },
  maintenanceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    padding: 'var(--space-3) var(--space-4)',
    backgroundColor: 'var(--color-bg-card)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
  },
  maintenanceEmoji: { fontSize: 22 },
  maintenanceTitle: {
    flex: 1,
    fontSize: 'var(--font-size-base)',
    color: 'var(--color-text-primary)',
    fontWeight: 'var(--font-weight-medium)',
  },
  maintenanceBadge: {
    fontSize: 'var(--font-size-xs)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-green)',
    backgroundColor: 'var(--color-green-soft)',
    padding: '3px 10px',
    borderRadius: 'var(--radius-full)',
  },

  affirmation: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    margin: '0 var(--space-5)',
    padding: 'var(--space-4)',
    backgroundColor: 'var(--color-primary-soft)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-primary)',
  },
  affirmIcon: { fontSize: 28, flexShrink: 0 },
  affirmText: {
    fontSize: 'var(--font-size-base)',
    color: 'var(--color-primary-dark)',
    fontWeight: 'var(--font-weight-medium)',
    lineHeight: 1.4,
    fontStyle: 'italic',
  },
};
