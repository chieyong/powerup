import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';

export default function RewardManagerPage() {
  const { reward, updateReward } = useApp();

  // Beloningsinstellingen
  const [title, setTitle] = useState(reward.title);
  const [criteria, setCriteria] = useState(reward.criteria ?? []);
  const [newCriterion, setNewCriterion] = useState('');

  // Voortgang
  const [progress, setProgress] = useState(reward.progressPercent);
  const [weeksCompleted, setWeeksCompleted] = useState(reward.readinessWeeksCompleted);
  const [targetWeeks, setTargetWeeks] = useState(reward.targetWeeks);

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateReward({
      title: title.trim() || reward.title,
      criteria,
      progressPercent: progress,
      readinessWeeksCompleted: Math.min(weeksCompleted, targetWeeks),
      targetWeeks,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const addCriterion = () => {
    const trimmed = newCriterion.trim();
    if (!trimmed) return;
    setCriteria(prev => [...prev, trimmed]);
    setNewCriterion('');
  };

  const removeCriterion = (i) => {
    setCriteria(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleCriterionKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addCriterion(); }
  };

  return (
    <div style={styles.page}>
      <PageHeader
        emoji="🎮"
        title={`${title || 'Beloning'} instellen`}
        subtitle="Beheer de beloning samen met je kind"
      />

      {/* ── Preview kaart ─────────────────────────────────────────────── */}
      <Card style={styles.progressCard}>
        <div style={styles.progressHero}>
          <span style={styles.progressEmoji}>🎮</span>
          <div style={{ flex: 1 }}>
            <p style={styles.progressTitle}>{title || '—'}</p>
            <p style={styles.progressSub}>Week {Math.min(weeksCompleted, targetWeeks)} van {targetWeeks}</p>
          </div>
          <span style={styles.progressPct}>{progress}%</span>
        </div>
        <div style={styles.track}>
          <div style={{ ...styles.fill, width: `${progress}%` }} />
        </div>
      </Card>

      {/* ── Beloning instellen ────────────────────────────────────────── */}
      <Card style={styles.editCard}>
        <h2 style={styles.editTitle}>🎯 Wat is de beloning?</h2>
        <p style={styles.editHint}>
          Kies samen met je kind iets waar hij echt naar uitkijkt.
        </p>

        <label style={styles.fieldLabel}>Naam van de beloning</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="bijv. Game PC, Weekend weg, Nieuw boek…"
          style={styles.textInput}
          maxLength={60}
        />
      </Card>

      {/* ── Criteria ─────────────────────────────────────────────────── */}
      <Card style={styles.criteriaEditCard}>
        <h2 style={styles.editTitle}>✅ Criteria</h2>
        <p style={styles.editHint}>
          Dit zijn de afspraken die laten zien dat hij er klaar voor is.
        </p>

        <ul style={styles.criteriaList}>
          {criteria.map((c, i) => (
            <li key={i} style={styles.criteriaItem}>
              <span style={styles.criteriaBullet}>→</span>
              <span style={{ flex: 1, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)', lineHeight: 1.4 }}>{c}</span>
              <button
                style={styles.removeBtn}
                onClick={() => removeCriterion(i)}
                aria-label={`Verwijder: ${c}`}
              >
                ✕
              </button>
            </li>
          ))}
          {criteria.length === 0 && (
            <li style={styles.emptyCriteria}>Nog geen criteria — voeg er hieronder een toe.</li>
          )}
        </ul>

        <div style={styles.addRow}>
          <input
            type="text"
            value={newCriterion}
            onChange={e => setNewCriterion(e.target.value)}
            onKeyDown={handleCriterionKeyDown}
            placeholder="Nieuw criterium toevoegen…"
            style={{ ...styles.textInput, marginBottom: 0, flex: 1 }}
            maxLength={100}
          />
          <button
            style={styles.addBtn}
            onClick={addCriterion}
            disabled={!newCriterion.trim()}
          >
            +
          </button>
        </div>
      </Card>

      {/* ── Voortgang aanpassen ───────────────────────────────────────── */}
      <Card style={styles.editCard}>
        <h2 style={styles.editTitle}>📊 Voortgang aanpassen</h2>
        <p style={styles.editHint}>
          Doe dit samen tijdens het Samenmoment. Bespreek of de voortgang klopt.
        </p>

        <div style={styles.sliderGroup}>
          <label style={styles.sliderLabel}>
            Voortgang: <strong>{progress}%</strong>
          </label>
          <input
            type="range" min={0} max={100} step={5}
            value={progress}
            onChange={e => setProgress(Number(e.target.value))}
            style={styles.slider}
          />
          <div style={styles.sliderMarks}>
            <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
          </div>
        </div>

        <div style={styles.sliderGroup}>
          <label style={styles.sliderLabel}>
            Doelperiode: <strong>{targetWeeks} weken</strong>
          </label>
          <input
            type="range" min={4} max={16} step={1}
            value={targetWeeks}
            onChange={e => setTargetWeeks(Number(e.target.value))}
            style={styles.slider}
          />
          <div style={styles.sliderMarks}>
            <span>4 wk</span><span>8 wk</span><span>12 wk</span><span>16 wk</span>
          </div>
        </div>

        <div style={styles.sliderGroup}>
          <label style={styles.sliderLabel}>
            Goede weken: <strong>{Math.min(weeksCompleted, targetWeeks)} van {targetWeeks}</strong>
          </label>
          <input
            type="range" min={0} max={targetWeeks} step={1}
            value={Math.min(weeksCompleted, targetWeeks)}
            onChange={e => setWeeksCompleted(Number(e.target.value))}
            style={styles.slider}
          />
        </div>

        <button
          style={{ ...styles.saveBtn, ...(saved ? styles.saveBtnDone : {}) }}
          onClick={handleSave}
        >
          {saved ? '✓ Opgeslagen!' : 'Alles opslaan'}
        </button>
      </Card>

      {/* ── Tips voor ouders ──────────────────────────────────────────── */}
      <Card style={styles.guidanceCard}>
        <p style={styles.guidanceTitle}>💡 Tips voor ouders</p>
        <ul style={styles.guidanceList}>
          <li>Verander de beloning alleen samen met je kind — het is zijn doel.</li>
          <li>Verhoog de voortgang samen bij het Samenmoment.</li>
          <li>Geen automatische sancties — beslis altijd samen.</li>
          <li>Als een gewoonte te moeilijk is, maak hem kleiner — niet minder voortgang geven.</li>
        </ul>
      </Card>
    </div>
  );
}

const styles = {
  page: { paddingBottom: 'var(--space-8)' },

  progressCard: {
    margin: '0 var(--space-5) var(--space-4)',
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
    border: 'none',
    color: '#fff',
  },
  progressHero: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    marginBottom: 'var(--space-4)',
  },
  progressEmoji: { fontSize: 40, lineHeight: 1, flexShrink: 0 },
  progressTitle: { fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-black)' },
  progressSub: { fontSize: 'var(--font-size-sm)', opacity: 0.8 },
  progressPct: { fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-black)', flexShrink: 0 },
  track: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 'var(--radius-full)',
    transition: 'width 0.5s ease',
  },

  editCard: {
    margin: '0 var(--space-5) var(--space-4)',
    padding: 'var(--space-5)',
  },
  criteriaEditCard: {
    margin: '0 var(--space-5) var(--space-4)',
    padding: 'var(--space-5)',
    backgroundColor: 'var(--color-green-soft)',
    border: '1px solid var(--color-green)',
    boxShadow: 'none',
  },
  editTitle: {
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--space-2)',
  },
  editHint: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-secondary)',
    marginBottom: 'var(--space-4)',
    lineHeight: 1.4,
  },

  fieldLabel: {
    display: 'block',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-text-secondary)',
    marginBottom: 'var(--space-2)',
  },
  textInput: {
    display: 'block',
    width: '100%',
    padding: 'var(--space-3) var(--space-4)',
    fontSize: 'var(--font-size-base)',
    fontFamily: 'var(--font-body)',
    color: 'var(--color-text-primary)',
    backgroundColor: 'var(--color-bg-card)',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: 'var(--space-2)',
    transition: 'border-color var(--transition-fast)',
  },

  criteriaList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
    marginBottom: 'var(--space-4)',
  },
  criteriaItem: {
    display: 'flex',
    gap: 'var(--space-2)',
    alignItems: 'flex-start',
    backgroundColor: 'var(--color-bg-card)',
    padding: 'var(--space-2) var(--space-3)',
    borderRadius: 'var(--radius-md)',
  },
  criteriaBullet: {
    color: 'var(--color-green)',
    fontWeight: 'var(--font-weight-bold)',
    flexShrink: 0,
    marginTop: 2,
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
    fontSize: 13,
    padding: '0 2px',
    lineHeight: 1,
    flexShrink: 0,
    fontFamily: 'var(--font-body)',
  },
  emptyCriteria: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-muted)',
    fontStyle: 'italic',
  },
  addRow: {
    display: 'flex',
    gap: 'var(--space-2)',
    alignItems: 'center',
  },
  addBtn: {
    padding: 'var(--space-3) var(--space-4)',
    backgroundColor: 'var(--color-green)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontSize: 20,
    lineHeight: 1,
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    flexShrink: 0,
    opacity: 1,
    transition: 'opacity var(--transition-fast)',
  },

  sliderGroup: { marginBottom: 'var(--space-5)' },
  sliderLabel: {
    display: 'block',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-text-secondary)',
    marginBottom: 'var(--space-2)',
  },
  slider: {
    width: '100%',
    accentColor: 'var(--color-primary)',
    height: 6,
    cursor: 'pointer',
  },
  sliderMarks: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 4,
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-text-muted)',
  },

  saveBtn: {
    width: '100%',
    padding: 'var(--space-3) var(--space-4)',
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-lg)',
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-bold)',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    transition: 'background var(--transition-fast)',
    boxShadow: '0 4px 14px rgba(79,122,232,0.30)',
  },
  saveBtnDone: {
    backgroundColor: 'var(--color-green)',
    boxShadow: '0 4px 14px rgba(76,175,130,0.30)',
  },

  guidanceCard: {
    margin: '0 var(--space-5)',
    backgroundColor: 'var(--color-amber-soft)',
    border: '1px solid var(--color-amber)',
    boxShadow: 'none',
  },
  guidanceTitle: {
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--space-3)',
  },
  guidanceList: {
    listStyle: 'disc',
    paddingLeft: 'var(--space-5)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-primary)',
    lineHeight: 1.5,
  },
};
