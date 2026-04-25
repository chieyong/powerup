import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { categoryMeta, checkinLabels } from '../../data/mockData';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';

export default function ParentOverviewPage() {
  const { child, reward, activeHabits, maintenanceHabits, checkIns, getCategoryProgress } = useApp();
  const navigate = useNavigate();

  // Check-ins van de afgelopen 7 dagen
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - i * 86400000);
    return d.toISOString().split('T')[0];
  }).reverse();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayCheckIns = checkIns.filter(ci => ci.date === todayStr);

  return (
    <div style={styles.page}>
      <PageHeader
        emoji="👤"
        title={`Hoi, ouder van ${child.name}`}
        subtitle="Hier zie je hoe het gaat"
      />

      {/* Quick stats */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <span style={styles.statVal}>{activeHabits.length}/3</span>
          <span style={styles.statLabel}>Actieve gewoontes</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statVal}>{maintenanceHabits.length}</span>
          <span style={styles.statLabel}>Op onderhoud</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statVal}>{reward.progressPercent}%</span>
          <span style={styles.statLabel}>Game PC voortgang</span>
        </div>
      </div>

      {/* Today's check-ins */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Vandaag ingevuld</h2>
        {activeHabits.length === 0 ? (
          <Card><p style={styles.emptyText}>Nog geen actieve gewoontes.</p></Card>
        ) : (
          <div style={styles.checkInList}>
            {activeHabits.map(habit => {
              const ci = todayCheckIns.find(c => c.habitId === habit.id);
              const ciInfo = ci ? checkinLabels[ci.status] : null;
              return (
                <div key={habit.id} style={styles.checkInRow}>
                  <span style={styles.habitEmoji}>{habit.emoji}</span>
                  <span style={styles.habitName}>{habit.title}</span>
                  {ciInfo ? (
                    <span style={{ ...styles.ciStatus, color: ciInfo.color }}>
                      {ciInfo.emoji} {ciInfo.label}
                    </span>
                  ) : (
                    <span style={styles.ciPending}>Nog niet</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Category progress */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Voortgang per gebied (7 dagen)</h2>
        <div style={styles.categoryList}>
          {Object.entries(categoryMeta).map(([key, meta]) => {
            const pct = getCategoryProgress(key);
            const color = `var(${meta.color})`;
            return (
              <div key={key} style={styles.catRow}>
                <span style={styles.catEmoji}>{meta.emoji}</span>
                <div style={styles.catMiddle}>
                  <span style={styles.catLabel}>{meta.label}</span>
                  <div style={styles.catTrack}>
                    <div style={{ ...styles.catFill, width: `${pct}%`, backgroundColor: color }} />
                  </div>
                </div>
                <span style={{ ...styles.catPct, color }}>{pct}%</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick links */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Beheer</h2>
        <div style={styles.linkList}>
          <button style={styles.linkCard} onClick={() => navigate('/ouder/gewoontes')}>
            <span style={styles.linkIcon}>✏️</span>
            <div>
              <p style={styles.linkTitle}>Gewoontes beheren</p>
              <p style={styles.linkSub}>Toevoegen, aanpassen, status wijzigen</p>
            </div>
            <span style={styles.linkChev}>›</span>
          </button>
          <button style={styles.linkCard} onClick={() => navigate('/ouder/beloning')}>
            <span style={styles.linkIcon}>🎮</span>
            <div>
              <p style={styles.linkTitle}>Game PC voortgang</p>
              <p style={styles.linkSub}>Voortgang aanpassen, criteria bekijken</p>
            </div>
            <span style={styles.linkChev}>›</span>
          </button>
          <button style={styles.linkCard} onClick={() => navigate('/samen')}>
            <span style={styles.linkIcon}>💬</span>
            <div>
              <p style={styles.linkTitle}>Samenmoment starten</p>
              <p style={styles.linkSub}>Weekreflectie met {child.name}</p>
            </div>
            <span style={styles.linkChev}>›</span>
          </button>
        </div>
      </section>

      {/* Advice banner */}
      {activeHabits.length === 3 && (
        <Card style={styles.adviceBanner}>
          <span style={styles.adviceIcon}>💡</span>
          <p style={styles.adviceText}>
            <strong>Tip:</strong> Voeg pas een nieuwe gewoonte toe als er eentje naar "onderhoud" gaat.
            Max 1 nieuwe gewoonte per week.
          </p>
        </Card>
      )}
    </div>
  );
}

const styles = {
  page: { paddingBottom: 'var(--space-8)' },
  statsRow: {
    display: 'flex',
    gap: 'var(--space-3)',
    padding: '0 var(--space-5)',
    marginBottom: 'var(--space-6)',
  },
  statCard: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--space-1)',
    backgroundColor: 'var(--color-bg-card)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-4) var(--space-2)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--color-border)',
  },
  statVal: {
    fontSize: 'var(--font-size-lg)',
    fontWeight: 'var(--font-weight-black)',
    color: 'var(--color-primary)',
  },
  statLabel: {
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-text-muted)',
    textAlign: 'center',
  },
  section: {
    padding: '0 var(--space-5)',
    marginBottom: 'var(--space-6)',
  },
  sectionTitle: {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 'var(--space-3)',
  },
  checkInList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
  },
  checkInRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    padding: 'var(--space-3) var(--space-4)',
    backgroundColor: 'var(--color-bg-card)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
  },
  habitEmoji: { fontSize: 20, flexShrink: 0 },
  habitName: {
    flex: 1,
    fontSize: 'var(--font-size-base)',
    color: 'var(--color-text-primary)',
    fontWeight: 'var(--font-weight-medium)',
  },
  ciStatus: {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    flexShrink: 0,
  },
  ciPending: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-muted)',
    flexShrink: 0,
  },
  emptyText: {
    color: 'var(--color-text-muted)',
    textAlign: 'center',
    padding: 'var(--space-4)',
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-3)',
  },
  catRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    backgroundColor: 'var(--color-bg-card)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-3) var(--space-4)',
    border: '1px solid var(--color-border)',
  },
  catEmoji: { fontSize: 20, flexShrink: 0 },
  catMiddle: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  catLabel: {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-text-primary)',
  },
  catTrack: {
    height: 6,
    backgroundColor: 'var(--color-bg-subtle)',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
  },
  catFill: {
    height: '100%',
    borderRadius: 'var(--radius-full)',
    transition: 'width 0.5s ease',
  },
  catPct: {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-bold)',
    flexShrink: 0,
    minWidth: 36,
    textAlign: 'right',
  },
  linkList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
  },
  linkCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    padding: 'var(--space-4)',
    backgroundColor: 'var(--color-bg-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background var(--transition-fast)',
    boxShadow: 'var(--shadow-sm)',
    fontFamily: 'var(--font-family)',
  },
  linkIcon: { fontSize: 26, flexShrink: 0 },
  linkTitle: {
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text-primary)',
    marginBottom: 2,
  },
  linkSub: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-secondary)',
  },
  linkChev: {
    fontSize: 22,
    color: 'var(--color-text-muted)',
    flexShrink: 0,
  },
  adviceBanner: {
    margin: '0 var(--space-5)',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--space-3)',
    backgroundColor: 'var(--color-amber-soft)',
    border: '1px solid var(--color-amber)',
    boxShadow: 'none',
  },
  adviceIcon: { fontSize: 22, flexShrink: 0 },
  adviceText: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-primary)',
    lineHeight: 1.5,
  },
};
