import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { categoryMeta, checkinLabels, statusLabels } from '../../data/mockData';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';

function getWeeklyDots(habitId, checkIns) {
  return Array.from({ length: 6 }, (_, i) => {
    const weekOffset = (5 - i) * 7;
    let done = 0;
    for (let d = 0; d < 7; d++) {
      const date = new Date(Date.now() - (weekOffset + d) * 86400000).toISOString().split('T')[0];
      if (checkIns.some(ci => ci.habitId === habitId && ci.date === date &&
          (ci.status === 'self_done' || ci.status === 'with_help'))) done++;
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
    <div style={{ display: 'flex', gap: 5, paddingLeft: 26 }}>
      {dots.map((done, i) => (
        <div key={i} style={{
          width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
          backgroundColor: dotColor(done),
          border: done === 0 ? '1.5px solid var(--color-border)' : 'none',
        }} />
      ))}
    </div>
  );
}

const statusBadgeStyle = {
  active:      { color: 'var(--color-primary)',    bg: 'var(--color-primary-soft)' },
  maintenance: { color: 'var(--color-green)',      bg: 'var(--color-green-soft)' },
  paused:      { color: 'var(--color-text-muted)', bg: 'var(--color-bg-subtle)' },
  not_started: { color: 'var(--color-amber)',      bg: 'var(--color-amber-soft)' },
};

function getDayLabel(dateStr) {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (dateStr === today) return 'Vandaag';
  if (dateStr === yesterday) return 'Gisteren';
  const d = new Date(dateStr + 'T12:00:00');
  return ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'][d.getDay()];
}

export default function ParentOverviewPage() {
  const { child, reward, habits, activeHabits, maintenanceHabits, checkIns, getCategoryProgress, setParentCheckIn, config } = useApp();
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [expandedCats, setExpandedCats] = useState(new Set());

  function toggleCat(key) {
    setExpandedCats(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - i * 86400000);
    return d.toISOString().split('T')[0];
  });

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
          <span style={styles.statVal}>{activeHabits.length}/{config.maxActiveHabits}</span>
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

      {/* Resultaten sectie */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Resultaten bekijken & invullen</h2>

        {/* Datumkiezer */}
        <div style={styles.dateChips}>
          {last7.map(dateStr => (
            <button
              key={dateStr}
              style={selectedDate === dateStr ? { ...styles.dateChip, ...styles.dateChipActive } : styles.dateChip}
              onClick={() => setSelectedDate(dateStr)}
            >
              {getDayLabel(dateStr)}
            </button>
          ))}
        </div>

        {activeHabits.length === 0 ? (
          <Card><p style={styles.emptyText}>Nog geen actieve gewoontes.</p></Card>
        ) : (
          <div style={styles.habitCardList}>
            {activeHabits.map(habit => {
              const ci = checkIns.find(c => c.habitId === habit.id && c.date === selectedDate) || null;
              const childStatus = ci?.status || null;
              const parentStatus = ci?.parentStatus || null;
              const hasDiff = childStatus && parentStatus && childStatus !== parentStatus;
              const isMatch = childStatus && parentStatus && childStatus === parentStatus;

              return (
                <div
                  key={habit.id}
                  style={hasDiff ? { ...styles.habitCard, ...styles.habitCardDiff } : styles.habitCard}
                >
                  {/* Hoofd rij: emoji + naam + badge */}
                  <div style={styles.habitCardHeader}>
                    <span style={styles.habitEmoji}>{habit.emoji}</span>
                    <span style={styles.habitName}>{habit.title}</span>
                    {hasDiff && <span style={styles.diffBadge}>Afwijking</span>}
                    {isMatch && <span style={styles.matchBadge}>Match</span>}
                  </div>

                  {/* Kind-resultaat */}
                  <div style={styles.resultRow}>
                    <span style={styles.resultLabel}>{child.name}:</span>
                    {childStatus ? (
                      <span style={{ ...styles.resultValue, color: checkinLabels[childStatus].color }}>
                        {checkinLabels[childStatus].emoji} {checkinLabels[childStatus].label}
                      </span>
                    ) : (
                      <span style={styles.resultEmpty}>Nog niet ingevuld</span>
                    )}
                  </div>

                  {/* Ouder-knoppen */}
                  <div style={styles.resultRow}>
                    <span style={styles.resultLabel}>Jij:</span>
                    <div style={styles.parentButtons}>
                      {Object.entries(checkinLabels).map(([key, info]) => (
                        <button
                          key={key}
                          style={parentStatus === key
                            ? { ...styles.parentBtn, backgroundColor: info.color, color: '#fff', borderColor: info.color }
                            : styles.parentBtn
                          }
                          onClick={() => setParentCheckIn(habit.id, selectedDate, parentStatus === key ? null : key)}
                        >
                          {info.emoji} {key === 'self_done' ? 'Zelf' : key === 'with_help' ? 'Hulp' : 'Nee'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Afwijking toelichting */}
                  {hasDiff && (
                    <p style={styles.diffExplain}>
                      {child.name} zei &ldquo;{checkinLabels[childStatus].label}&rdquo;, jij registreert &ldquo;{checkinLabels[parentStatus].label}&rdquo;
                    </p>
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
            const colorSoft = `var(${meta.colorSoft})`;
            const catHabits = habits.filter(h => h.category === key);
            const isExpanded = expandedCats.has(key);
            return (
              <div key={key} style={{ ...styles.catRow, borderColor: color, backgroundColor: colorSoft }}>
                <button
                  style={styles.catRowInner}
                  onClick={() => catHabits.length > 0 && toggleCat(key)}
                  aria-expanded={isExpanded}
                >
                  <span style={styles.catEmoji}>{meta.emoji}</span>
                  <div style={styles.catMiddle}>
                    <span style={styles.catLabel}>{meta.label}</span>
                    <div style={styles.catTrack}>
                      <div style={{ ...styles.catFill, width: `${pct}%`, backgroundColor: color }} />
                    </div>
                  </div>
                  <span style={{ ...styles.catPct, color }}>{pct}%</span>
                  {catHabits.length > 0 && (
                    <span style={styles.catChev}>{isExpanded ? '▲' : '▼'}</span>
                  )}
                </button>

                {isExpanded && catHabits.length > 0 && (
                  <div style={styles.catHabitList}>
                    {catHabits.map(h => {
                      const sc = statusBadgeStyle[h.status] || statusBadgeStyle.paused;
                      const showDots = h.status === 'active' || h.status === 'maintenance';
                      return (
                        <div key={h.id} style={styles.catHabitRow}>
                          <div style={styles.catHabitRowTop}>
                            <span style={styles.catHabitEmoji}>{h.emoji}</span>
                            <span style={styles.catHabitTitle}>{h.title}</span>
                            <span style={{ ...styles.catHabitBadge, color: sc.color, backgroundColor: sc.bg }}>
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
  dateChips: {
    display: 'flex',
    gap: 'var(--space-2)',
    overflowX: 'auto',
    paddingBottom: 'var(--space-2)',
    marginBottom: 'var(--space-3)',
  },
  dateChip: {
    flexShrink: 0,
    padding: 'var(--space-2) var(--space-3)',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg-card)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
  },
  dateChipActive: {
    backgroundColor: 'var(--color-primary)',
    borderColor: 'var(--color-primary)',
    color: '#fff',
  },
  habitCardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-3)',
  },
  habitCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
    padding: 'var(--space-4)',
    backgroundColor: 'var(--color-bg-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
  },
  habitCardDiff: {
    borderColor: 'var(--color-amber)',
    borderLeftWidth: 4,
    backgroundColor: 'var(--color-amber-soft)',
  },
  habitCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
  },
  habitEmoji: { fontSize: 20, flexShrink: 0 },
  habitName: {
    flex: 1,
    fontSize: 'var(--font-size-base)',
    color: 'var(--color-text-primary)',
    fontWeight: 'var(--font-weight-medium)',
  },
  diffBadge: {
    fontSize: 'var(--font-size-xs)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-amber)',
    backgroundColor: '#FDE68A',
    borderRadius: 'var(--radius-full)',
    padding: '2px 8px',
    flexShrink: 0,
  },
  matchBadge: {
    fontSize: 'var(--font-size-xs)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-green)',
    backgroundColor: 'var(--color-green-soft)',
    borderRadius: 'var(--radius-full)',
    padding: '2px 8px',
    flexShrink: 0,
  },
  resultRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
  },
  resultLabel: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-muted)',
    fontWeight: 'var(--font-weight-medium)',
    minWidth: 44,
    flexShrink: 0,
  },
  resultValue: {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
  },
  resultEmpty: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-muted)',
    fontStyle: 'italic',
  },
  parentButtons: {
    display: 'flex',
    gap: 'var(--space-2)',
    flexWrap: 'wrap',
  },
  parentBtn: {
    padding: '4px 10px',
    borderRadius: 'var(--radius-full)',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg-subtle)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    transition: 'all 0.15s ease',
  },
  diffExplain: {
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-amber)',
    fontStyle: 'italic',
    marginTop: 'var(--space-1)',
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
    borderRadius: 'var(--radius-md)',
    border: '1.5px solid',
    overflow: 'hidden',
  },
  catRowInner: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    width: '100%',
    padding: 'var(--space-3) var(--space-4)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'var(--font-family)',
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
    backgroundColor: 'rgba(255,255,255,0.55)',
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
  catChev: {
    fontSize: 11,
    color: 'var(--color-text-muted)',
    flexShrink: 0,
  },
  catHabitList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
    padding: '0 var(--space-4) var(--space-3)',
  },
  catHabitRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
    padding: 'var(--space-2) var(--space-3)',
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 'var(--radius-md)',
  },
  catHabitRowTop: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
  },
  catHabitEmoji: { fontSize: 18, flexShrink: 0 },
  catHabitTitle: {
    flex: 1,
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-primary)',
    fontWeight: 'var(--font-weight-medium)',
  },
  catHabitBadge: {
    fontSize: 'var(--font-size-xs)',
    fontWeight: 'var(--font-weight-medium)',
    padding: '2px 8px',
    borderRadius: 'var(--radius-full)',
    flexShrink: 0,
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
