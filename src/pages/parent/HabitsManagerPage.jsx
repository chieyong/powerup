import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { categoryMeta, statusLabels } from '../../data/mockData';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';

const statusColors = {
  active:      { color: 'var(--color-primary)',  bg: 'var(--color-primary-soft)' },
  maintenance: { color: 'var(--color-green)',    bg: 'var(--color-green-soft)' },
  paused:      { color: 'var(--color-text-muted)', bg: 'var(--color-bg-subtle)' },
  not_started: { color: 'var(--color-amber)',    bg: 'var(--color-amber-soft)' },
};

const defaultHabit = {
  title: '',
  category: 'screen_sleep',
  status: 'not_started',
  difficulty: 'medium',
  emoji: '⭐',
  why: ['', '', ''],
  replacementOptions: ['', ''],
  ifThenRule: { if: '', then: '' },
};

function HabitRow({ habit, onEdit, onStatusChange }) {
  const meta = categoryMeta[habit.category];
  const sc = statusColors[habit.status];
  return (
    <div style={styles.habitRow}>
      <span style={styles.hrEmoji}>{habit.emoji}</span>
      <div style={styles.hrMiddle}>
        <span style={styles.hrTitle}>{habit.title}</span>
        <span style={{ fontSize: 12, color: `var(${meta.color})` }}>{meta.emoji} {meta.label}</span>
      </div>
      <div style={styles.hrActions}>
        <select
          value={habit.status}
          onChange={e => onStatusChange(habit.id, e.target.value)}
          style={{ ...styles.statusSelect, color: sc.color, backgroundColor: sc.bg }}
          aria-label="Status"
        >
          {Object.entries(statusLabels).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
        <button style={styles.editBtn} onClick={() => onEdit(habit)} aria-label="Bewerken">✏️</button>
      </div>
    </div>
  );
}

function HabitForm({ habit, onSave, onCancel }) {
  const [form, setForm] = useState({
    ...defaultHabit,
    ...habit,
    why: habit?.why?.length ? [...habit.why] : ['', '', ''],
    replacementOptions: habit?.replacementOptions?.length ? [...habit.replacementOptions] : ['', ''],
    ifThenRule: habit?.ifThenRule || { if: '', then: '' },
  });

  const setField = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const updateWhy = (i, val) => {
    const why = [...form.why];
    why[i] = val;
    setField('why', why);
  };

  const updateReplacement = (i, val) => {
    const rep = [...form.replacementOptions];
    rep[i] = val;
    setField('replacementOptions', rep);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    onSave({
      ...form,
      why: form.why.filter(w => w.trim()),
      replacementOptions: form.replacementOptions.filter(r => r.trim()),
    });
  };

  return (
    <div style={styles.formOverlay}>
      <div style={styles.formSheet}>
        <div style={styles.formHeader}>
          <h2 style={styles.formTitle}>
            {habit?.id ? 'Gewoonte bewerken' : 'Nieuwe gewoonte'}
          </h2>
          <button style={styles.closeBtn} onClick={onCancel}>✕</button>
        </div>
        <div style={styles.formBody}>
          {/* Emoji */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Emoji</label>
            <input
              style={{ ...styles.input, width: 80, textAlign: 'center', fontSize: 24 }}
              value={form.emoji}
              onChange={e => setField('emoji', e.target.value)}
              maxLength={2}
            />
          </div>
          {/* Title */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Titel *</label>
            <input
              style={styles.input}
              value={form.title}
              onChange={e => setField('title', e.target.value)}
              placeholder="Bijv. Scherm uit om 20:30"
            />
          </div>
          {/* Category */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Categorie</label>
            <select style={styles.input} value={form.category} onChange={e => setField('category', e.target.value)}>
              {Object.entries(categoryMeta).map(([key, meta]) => (
                <option key={key} value={key}>{meta.emoji} {meta.label}</option>
              ))}
            </select>
          </div>
          {/* Difficulty */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Moeilijkheid</label>
            <div style={styles.diffBtns}>
              {[['easy','🟢 Makkelijk'], ['medium','🟡 Beetje lastig'], ['hard','🔴 Uitdagend']].map(([val, label]) => (
                <button
                  key={val}
                  style={{ ...styles.diffBtn, ...(form.difficulty === val ? styles.diffBtnActive : {}) }}
                  onClick={() => setField('difficulty', val)}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {/* Status */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Status</label>
            <select style={styles.input} value={form.status} onChange={e => setField('status', e.target.value)}>
              {Object.entries(statusLabels).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
          {/* Why */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Waarom? (max 3 redenen)</label>
            {[0, 1, 2].map(i => (
              <input
                key={i}
                style={{ ...styles.input, marginBottom: i < 2 ? 8 : 0 }}
                value={form.why[i] || ''}
                onChange={e => updateWhy(i, e.target.value)}
                placeholder={`Reden ${i + 1}...`}
              />
            ))}
          </div>
          {/* Replacements */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Alternatieven</label>
            {[0, 1, 2, 3].map(i => (
              <input
                key={i}
                style={{ ...styles.input, marginBottom: i < 3 ? 8 : 0 }}
                value={form.replacementOptions[i] || ''}
                onChange={e => updateReplacement(i, e.target.value)}
                placeholder={`Alternatief ${i + 1}...`}
              />
            ))}
          </div>
          {/* If-Then */}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Als-Dan plan (optioneel)</label>
            <input
              style={{ ...styles.input, marginBottom: 8 }}
              value={form.ifThenRule.if}
              onChange={e => setField('ifThenRule', { ...form.ifThenRule, if: e.target.value })}
              placeholder="ALS ik ... wil doen"
            />
            <input
              style={styles.input}
              value={form.ifThenRule.then}
              onChange={e => setField('ifThenRule', { ...form.ifThenRule, then: e.target.value })}
              placeholder="DAN doe ik ..."
            />
          </div>
        </div>
        <div style={styles.formFooter}>
          <button style={styles.cancelBtn} onClick={onCancel}>Annuleren</button>
          <button style={styles.saveBtn} onClick={handleSave}>Opslaan</button>
        </div>
      </div>
    </div>
  );
}

export default function HabitsManagerPage() {
  const { habits, updateHabit, addHabit, activeHabits } = useApp();
  const [editingHabit, setEditingHabit] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingHabit(null);
    setShowForm(true);
  };

  const handleSave = (data) => {
    if (data.id) updateHabit(data.id, data);
    else addHabit(data);
    setShowForm(false);
  };

  const handleStatusChange = (habitId, newStatus) => {
    // Regel: max 3 active
    if (newStatus === 'active' && activeHabits.length >= 3) {
      alert('Maximaal 3 actieve gewoontes tegelijk. Zet er eerst een op onderhoud of pauzeer er een.');
      return;
    }
    updateHabit(habitId, { status: newStatus });
  };

  const grouped = {
    active: habits.filter(h => h.status === 'active'),
    maintenance: habits.filter(h => h.status === 'maintenance'),
    not_started: habits.filter(h => h.status === 'not_started'),
    paused: habits.filter(h => h.status === 'paused'),
  };

  return (
    <div style={styles.page}>
      <PageHeader emoji="✏️" title="Gewoontes beheren" subtitle="Voeg toe, pas aan of wijzig de status" />

      {/* Regels reminder */}
      <Card style={styles.rulesCard}>
        <p style={styles.rulesTitle}>📋 Regels</p>
        <ul style={styles.rulesList}>
          <li>Max 3 actieve gewoontes tegelijk</li>
          <li>Max 1 nieuwe gewoonte per week</li>
          <li>Een gewoonte naar "onderhoud" als hij 5/7 dagen goed gaat</li>
        </ul>
      </Card>

      {/* Add button */}
      <div style={styles.addSection}>
        <button style={styles.addBtn} onClick={handleNew}>
          + Nieuwe gewoonte toevoegen
        </button>
      </div>

      {/* Habit groups */}
      {Object.entries({ active: 'Actief', maintenance: 'Onderhoud', not_started: 'Binnenkort', paused: 'Gepauzeerd' }).map(([key, label]) => (
        grouped[key].length > 0 && (
          <section key={key} style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>{label}</h2>
              <span style={{ ...styles.sectionBadge, ...statusColors[key] }}>
                {grouped[key].length}
              </span>
            </div>
            <div style={styles.habitList}>
              {grouped[key].map(h => (
                <HabitRow key={h.id} habit={h} onEdit={handleEdit} onStatusChange={handleStatusChange} />
              ))}
            </div>
          </section>
        )
      ))}

      {/* Form modal */}
      {showForm && (
        <HabitForm
          habit={editingHabit}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

const styles = {
  page: { paddingBottom: 'var(--space-8)' },
  rulesCard: {
    margin: '0 var(--space-5) var(--space-4)',
    backgroundColor: 'var(--color-primary-soft)',
    border: '1px solid var(--color-primary)',
    boxShadow: 'none',
    padding: 'var(--space-4)',
  },
  rulesTitle: {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-primary-dark)',
    marginBottom: 'var(--space-2)',
  },
  rulesList: {
    listStyle: 'disc',
    paddingLeft: 'var(--space-5)',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  addSection: {
    padding: '0 var(--space-5)',
    marginBottom: 'var(--space-5)',
  },
  addBtn: {
    width: '100%',
    padding: 'var(--space-4)',
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-lg)',
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-bold)',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    boxShadow: '0 4px 14px rgba(79,122,232,0.30)',
  },
  section: {
    padding: '0 var(--space-5)',
    marginBottom: 'var(--space-5)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    marginBottom: 'var(--space-3)',
  },
  sectionTitle: {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  sectionBadge: {
    fontSize: 'var(--font-size-xs)',
    fontWeight: 'var(--font-weight-bold)',
    padding: '2px 8px',
    borderRadius: 'var(--radius-full)',
  },
  habitList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
  },
  habitRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    backgroundColor: 'var(--color-bg-card)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-3) var(--space-4)',
    border: '1px solid var(--color-border)',
  },
  hrEmoji: { fontSize: 22, flexShrink: 0 },
  hrMiddle: { flex: 1, display: 'flex', flexDirection: 'column', gap: 2 },
  hrTitle: { fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' },
  hrActions: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 },
  statusSelect: {
    fontSize: 'var(--font-size-xs)',
    fontWeight: 'var(--font-weight-medium)',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    padding: '4px 8px',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    outline: 'none',
  },
  editBtn: {
    fontSize: 18,
    padding: 4,
    cursor: 'pointer',
    background: 'none',
    border: 'none',
  },
  // Form styles
  formOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 200,
    display: 'flex',
    alignItems: 'flex-end',
  },
  formSheet: {
    backgroundColor: 'var(--color-bg-card)',
    borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
    width: '100%',
    maxWidth: 'var(--max-width)',
    margin: '0 auto',
    maxHeight: '85dvh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  formHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--space-5)',
    borderBottom: '1px solid var(--color-border)',
    flexShrink: 0,
  },
  formTitle: {
    fontSize: 'var(--font-size-md)',
    fontWeight: 'var(--font-weight-black)',
    color: 'var(--color-text-primary)',
  },
  closeBtn: {
    fontSize: 20,
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
    padding: 4,
    background: 'none',
    border: 'none',
  },
  formBody: {
    overflowY: 'auto',
    padding: 'var(--space-5)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-4)',
    flex: 1,
  },
  formGroup: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' },
  formLabel: {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text-secondary)',
  },
  input: {
    width: '100%',
    padding: '10px var(--space-4)',
    backgroundColor: 'var(--color-bg-subtle)',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-size-base)',
    color: 'var(--color-text-primary)',
    outline: 'none',
    fontFamily: 'var(--font-family)',
  },
  diffBtns: { display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' },
  diffBtn: {
    padding: '8px var(--space-3)',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    cursor: 'pointer',
    backgroundColor: 'var(--color-bg-subtle)',
    color: 'var(--color-text-secondary)',
    fontFamily: 'var(--font-family)',
    transition: 'all var(--transition-fast)',
  },
  diffBtnActive: {
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    borderColor: 'var(--color-primary)',
  },
  formFooter: {
    display: 'flex',
    gap: 'var(--space-3)',
    padding: 'var(--space-4) var(--space-5)',
    borderTop: '1px solid var(--color-border)',
    flexShrink: 0,
  },
  cancelBtn: {
    flex: 1,
    padding: 'var(--space-3)',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    fontFamily: 'var(--font-family)',
  },
  saveBtn: {
    flex: 2,
    padding: 'var(--space-3)',
    border: 'none',
    borderRadius: 'var(--radius-lg)',
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-bold)',
    color: '#fff',
    cursor: 'pointer',
    backgroundColor: 'var(--color-primary)',
    fontFamily: 'var(--font-family)',
    boxShadow: '0 4px 14px rgba(79,122,232,0.30)',
  },
};
