import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { categoryMeta, statusLabels } from '../../data/mockData';
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

const statusBadgeStyle = {
  active:      { color: 'var(--color-primary)',    bg: 'var(--color-primary-soft)' },
  maintenance: { color: 'var(--color-green)',      bg: 'var(--color-green-soft)' },
  paused:      { color: 'var(--color-text-muted)', bg: 'var(--color-bg-subtle)' },
  not_started: { color: 'var(--color-amber)',      bg: 'var(--color-amber-soft)' },
};

// Bereken 6 wekelijkse vensters (oudste links, meest recent rechts)
// Geeft per venster het aantal gedane dagen terug (0–7)
function getWeeklyDots(habitId, checkIns) {
  return Array.from({ length: 6 }, (_, i) => {
    const weekOffset = (5 - i) * 7; // i=0 → oudste (35 dagen terug), i=5 → meest recent
    let done = 0;
    for (let d = 0; d < 7; d++) {
      const date = new Date(Date.now() - (weekOffset + d) * 86400000).toISOString().split('T')[0];
      if (checkIns.some(ci => ci.habitId === habitId && ci.date === date &&
          (ci.status === 'self_done' || ci.status === 'with_help'))) {
        done++;
      }
    }
    return done;
  });
}

function dotColor(done) {
  if (done >= 5) return 'var(--color-green)';
  if (done >= 3) return 'var(--color-amber)';
  if (done >= 1) return 'var(--color-text-muted)';
  return 'transparent';
}

function WeekDots({ habitId, checkIns }) {
  const dots = getWeeklyDots(habitId, checkIns);
  if (!dots.some(d => d > 0)) return null;
  return (
    <div style={styles.weekDotsBlock}>
      <span style={styles.weekDotsLabel}>afgelopen 6 weken</span>
      <div style={styles.weekDots}>
        {dots.map((done, i) => (
          <div
            key={i}
            style={{
              ...styles.dot,
              backgroundColor: dotColor(done),
              border: done === 0 ? '1.5px solid var(--color-border)' : 'none',
            }}
            title={done > 0 ? `${done} van 7 dagen` : 'Niet bijgehouden'}
          />
        ))}
      </div>
      <span style={styles.weekDotsLegend}>● ≥5d &nbsp;● 3-4d &nbsp;● 1-2d &nbsp;○ 0d</span>
    </div>
  );
}

function CategoryMeter({ meta, progress, categoryKey, catHabits, checkIns }) {
  const [expanded, setExpanded] = useState(false);
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
        {catHabits.length > 0 && (
          <button
            style={styles.expandBtn}
            onClick={() => setExpanded(e => !e)}
            aria-label={expanded ? 'Inklappen' : 'Uitklappen'}
          >
            {expanded ? '▲' : '▼'}
          </button>
        )}
      </div>
      <div style={styles.meterTrack} aria-hidden="true">
        <div
          style={{
            ...styles.meterFill,
            width: progress >= 80 ? '85%' : progress >= 55 ? '60%' : progress >= 30 ? '35%' : progress > 0 ? '15%' : '0%',
            backgroundColor: color,
            opacity: 0.65,
          }}
        />
      </div>

      {expanded && catHabits.length > 0 && (
        <div style={styles.habitList}>
          {catHabits.map(h => {
            const sc = statusBadgeStyle[h.status] || statusBadgeStyle.paused;
            const showDots = h.status === 'active' || h.status === 'maintenance';
            return (
              <div key={h.id} style={styles.habitRow}>
                <div style={styles.habitRowTop}>
                  <span style={styles.habitRowEmoji}>{h.emoji}</span>
                  <span style={styles.habitRowTitle}>{h.title}</span>
                  <span style={{ ...styles.habitRowBadge, color: sc.color, backgroundColor: sc.bg }}>
                    {statusLabels[h.status]}
                  </span>
                </div>
                {showDots && <WeekDots habitId={h.id} checkIns={checkIns} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function GrowthOverviewPage() {
  const { getCategoryProgress, habits, checkIns } = useApp();

  const categories = Object.entries(categoryMeta).map(([key, meta]) => ({
    key,
    meta,
    progress: getCategoryProgress(key),
    catHabits: habits.filter(h => h.category === key),
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
  const notStartedHabits  = habits.filter(h => h.status === 'not_started' || h.status === 'paused');

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
          {categories.map(({ key, meta, progress, catHabits }) => (
            <CategoryMeter key={key} meta={meta} progress={progress} categoryKey={key} catHabits={catHabits} checkIns={checkIns} />
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

      {/* Gewoontes die nog niet gestart zijn */}
      {notStartedHabits.length > 0 && (
        <div style={styles.maintenanceSection}>
          <h2 style={styles.sectionTitle}>Hier kun je nog aan werken</h2>
          <p style={styles.maintenanceHint}>
            Deze gewoontes staan klaar — misschien iets voor later?
          </p>
          <div style={styles.maintenanceList}>
            {notStartedHabits.map(h => (
              <div key={h.id} style={styles.maintenanceItem}>
                <span style={styles.maintenanceEmoji}>{h.emoji}</span>
                <span style={styles.maintenanceTitle}>{h.title}</span>
                <span style={{ ...styles.maintenanceBadge, color: 'var(--color-amber)', backgroundColor: 'var(--color-amber-soft)' }}>
                  {h.status === 'paused' ? 'Gepauzeerd' : 'Binnenkort'}
                </span>
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

  expandBtn: {
    fontSize: 12,
    color: 'var(--color-text-muted)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 6px',
    flexShrink: 0,
  },
  habitList: {
    marginTop: 'var(--space-3)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
  },
  habitRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
    padding: 'var(--space-2) var(--space-3)',
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 'var(--radius-md)',
  },
  habitRowTop: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
  },
  habitRowEmoji: { fontSize: 18, flexShrink: 0 },
  habitRowTitle: {
    flex: 1,
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-primary)',
    fontWeight: 'var(--font-weight-medium)',
  },
  habitRowBadge: {
    fontSize: 'var(--font-size-xs)',
    fontWeight: 'var(--font-weight-medium)',
    padding: '2px 8px',
    borderRadius: 'var(--radius-full)',
    flexShrink: 0,
  },
  weekDotsBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    paddingLeft: 26,
  },
  weekDotsLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    color: 'var(--color-text-muted)',
  },
  weekDots: {
    display: 'flex',
    gap: 5,
  },
  weekDotsLegend: {
    fontFamily: 'var(--font-mono)',
    fontSize: 9,
    color: 'var(--color-text-muted)',
    letterSpacing: '0.04em',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    flexShrink: 0,
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
