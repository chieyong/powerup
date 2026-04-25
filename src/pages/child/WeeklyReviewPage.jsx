import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';

/*
  ── Vragenlijst ────────────────────────────────────────────────────────────────
  VOOR: 3 vragen + parent note, geen veiligheidsframing per vraag
  NA:   4 vragen — nieuwe: "Wat maakt het makkelijker?" — plus subtiele
        veiligheidsframing bij de moeilijke vraag
  WAAROM: "Wat maakt het makkelijker?" verschuift focus van falen naar
          oplossen. Het nodigt uit tot concrete, kleine ideeën i.p.v. excuses.
*/
const questions = [
  {
    key: 'wentWell',
    label: 'Wat ging goed deze week?',
    emoji: '✅',
    placeholder: 'Schrijf hier iets wat lukte, groot of klein...',
    hint: null,
  },
  {
    key: 'wasHard',
    label: 'Wat was lastig?',
    emoji: '💭',
    placeholder: 'Dat mag je gewoon zeggen — alles is oké om te delen.',
    // Hint geeft psychologische veiligheid bij de moeilijkste vraag
    hint: 'Er is geen goed of fout antwoord.',
  },
  {
    key: 'makeEasier',
    label: 'Wat zou het makkelijker maken?',
    emoji: '💡',
    placeholder: 'Een klein idee is genoeg — iets dat kan helpen volgende week...',
    hint: 'Denk aan iets kleins: een herinnering, een andere tijd, iemand om je bij te helpen.',
  },
  {
    key: 'childReflection',
    label: 'Hoe voelde jij je deze week?',
    emoji: '🫶',
    placeholder: 'Gewoon zeggen hoe het was — er is geen verkeerd gevoel.',
    hint: null,
  },
];

export default function WeeklyReviewPage() {
  const { weeklyReview, saveWeeklyReview, activeHabits, habits } = useApp();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    wentWell:        weeklyReview?.wentWell || '',
    wasHard:         weeklyReview?.wasHard || '',
    makeEasier:      weeklyReview?.makeEasier || '',
    childReflection: weeklyReview?.childReflection || '',
    parentNote:      weeklyReview?.parentNote || '',
  });

  const handleSave = () => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    saveWeeklyReview({
      ...weeklyReview,
      ...form,
      weekStart: weekStart.toISOString().split('T')[0],
      nextFocusHabitIds: activeHabits.map(h => h.id),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const nextHabitSuggestion = habits.find(h => h.status === 'not_started');

  return (
    <div style={styles.page}>
      <PageHeader
        emoji="💬"
        title="Samenmoment"
        subtitle="Even samen terugkijken — geen score, gewoon een gesprek"
      />

      {/*
        ── Intro card ─────────────────────────────────────────────────────────
        VOOR: "Er zijn geen goede of foute antwoorden."
        NA:   Explicieter veiligheidsframe + uitleg WAT dit moment is
        WAAROM: Kinderen van 12 zijn snel bang om iets "fout" te zeggen als
                ze denken dat er consequenties zijn. De framing maakt eerlijkheid veilig.
      */}
      <Card style={styles.introCard}>
        <span style={styles.introIcon}>👨‍👦</span>
        <div>
          <p style={styles.introTitle}>Doe dit samen, rustig</p>
          <p style={styles.introText}>
            Dit is geen toets. Het doel is om samen te begrijpen hoe de week was —
            zodat volgende week nét iets makkelijker kan worden.
          </p>
          <p style={styles.introSafety}>
            Eerlijk zijn is waardevoller dan een goed antwoord geven.
          </p>
        </div>
      </Card>

      {/*
        ── Data-als-gesprek toelichting ────────────────────────────────────────
        VOOR: niet aanwezig
        NA:   kleine contextbruggen tussen data en gesprek
        WAAROM: zonder dit kader kijkt het kind naar de getallen en voelt het
                als beoordeling. Met dit kader is het input voor samen nadenken.
      */}
      <div style={styles.dataContext}>
        <span style={styles.dataContextIcon}>💬</span>
        <p style={styles.dataContextText}>
          De app laat zien hoe de week ging — gebruik het als startpunt voor jullie gesprek, niet als oordeel.
        </p>
      </div>

      {/* Questions */}
      <div style={styles.questionsSection}>
        {questions.map(q => (
          <div key={q.key} style={styles.questionBlock}>
            <label style={styles.questionLabel}>
              <span>{q.emoji}</span>
              <span>{q.label}</span>
            </label>
            {q.hint && (
              <p style={styles.questionHint}>{q.hint}</p>
            )}
            <textarea
              style={styles.textarea}
              value={form[q.key]}
              onChange={e => setForm(prev => ({ ...prev, [q.key]: e.target.value }))}
              placeholder={q.placeholder}
              rows={3}
            />
          </div>
        ))}

        {/*
          ── Ouderbericht ───────────────────────────────────────────────────────
          VOOR: "Schrijf een bemoedigend bericht voor je kind..."
          NA:   meer gericht op echte observatie i.p.v. compliment-als-taak
          WAAROM: een specifiek opgemerkt detail ("ik zag dat jij...") is
                  oprechter en krachtiger dan een generiek "goed bezig!"
        */}
        <div style={styles.questionBlock}>
          <label style={styles.questionLabel}>
            <span>💌</span>
            <span>Bericht van ouder aan {/* child name via props? — hardcoded voor nu */}jou</span>
          </label>
          <p style={styles.questionHint}>
            Schrijf iets wat je deze week écht hebt gezien of gemerkt.
          </p>
          <textarea
            style={{ ...styles.textarea, borderColor: 'var(--color-amber)', backgroundColor: 'var(--color-amber-soft)' }}
            value={form.parentNote}
            onChange={e => setForm(prev => ({ ...prev, parentNote: e.target.value }))}
            placeholder="Bijv: ik zag dat jij deze week ... dat viel me op omdat ..."
            rows={2}
          />
        </div>
      </div>

      {/* Next week suggestion */}
      {nextHabitSuggestion && (
        <Card style={styles.suggestionCard}>
          <p style={styles.suggestionTitle}>💡 Klaar voor een nieuwe gewoonte?</p>
          <p style={styles.suggestionText}>
            Volgende week kun je "{nextHabitSuggestion.title}" {nextHabitSuggestion.emoji} proberen.
          </p>
          <p style={styles.suggestionHint}>
            Beslis dit samen — niet meer dan 1 nieuwe gewoonte per week.
          </p>
        </Card>
      )}

      {/* Active habits next week */}
      <div style={styles.habitsSection}>
        <h2 style={styles.sectionTitle}>Gewoontes voor volgende week</h2>
        <p style={styles.sectionHint}>Zijn dit nog de goede? Of moet er iets anders?</p>
        <div style={styles.habitsList}>
          {activeHabits.map(h => (
            <div key={h.id} style={styles.habitItem}>
              <span style={styles.habitEmoji}>{h.emoji}</span>
              <span style={styles.habitTitle}>{h.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div style={styles.saveSection}>
        <button
          style={{ ...styles.saveBtn, ...(saved ? styles.saveBtnDone : {}) }}
          onClick={handleSave}
        >
          {saved ? '✓ Opgeslagen!' : 'Samenmoment afronden'}
        </button>
        <p style={styles.saveHint}>Jullie antwoorden helpen om volgende week beter voor te bereiden.</p>
      </div>
    </div>
  );
}

const styles = {
  page: { paddingBottom: 'var(--space-8)' },

  introCard: {
    margin: '0 var(--space-5) var(--space-4)',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--space-3)',
    padding: 'var(--space-4)',
    backgroundColor: 'var(--color-primary-soft)',
    border: '1px solid var(--color-primary)',
    boxShadow: 'none',
  },
  introIcon: { fontSize: 32, flexShrink: 0 },
  introTitle: {
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-primary-dark)',
    marginBottom: 4,
  },
  introText: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.5,
    marginBottom: 6,
  },
  introSafety: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-primary-dark)',
    fontWeight: 'var(--font-weight-medium)',
    fontStyle: 'italic',
  },

  // Data-als-gesprek brug
  dataContext: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--space-2)',
    margin: '0 var(--space-5) var(--space-5)',
    padding: 'var(--space-3) var(--space-4)',
    backgroundColor: 'var(--color-bg-subtle)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
  },
  dataContextIcon: { fontSize: 16, flexShrink: 0, marginTop: 2 },
  dataContextText: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-muted)',
    lineHeight: 1.4,
    fontStyle: 'italic',
  },

  questionsSection: {
    padding: '0 var(--space-5)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-5)',
    marginBottom: 'var(--space-5)',
  },
  questionBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
  },
  questionLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text-primary)',
  },
  questionHint: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-muted)',
    fontStyle: 'italic',
    lineHeight: 1.4,
    paddingLeft: 'var(--space-6)', // inspring onder de emoji
  },
  textarea: {
    width: '100%',
    padding: 'var(--space-3) var(--space-4)',
    backgroundColor: 'var(--color-bg-card)',
    border: '1.5px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-size-base)',
    color: 'var(--color-text-primary)',
    resize: 'vertical',
    lineHeight: 1.5,
    outline: 'none',
    transition: 'border-color var(--transition-fast)',
    fontFamily: 'var(--font-family)',
  },

  suggestionCard: {
    margin: '0 var(--space-5) var(--space-5)',
    backgroundColor: 'var(--color-green-soft)',
    border: '1px solid var(--color-green)',
    boxShadow: 'none',
  },
  suggestionTitle: {
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--space-1)',
  },
  suggestionText: {
    fontSize: 'var(--font-size-base)',
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--space-2)',
  },
  suggestionHint: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-secondary)',
    fontStyle: 'italic',
  },

  habitsSection: {
    padding: '0 var(--space-5)',
    marginBottom: 'var(--space-5)',
  },
  sectionTitle: {
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--space-1)',
  },
  sectionHint: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-muted)',
    marginBottom: 'var(--space-3)',
    fontStyle: 'italic',
  },
  habitsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
  },
  habitItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    padding: 'var(--space-3) var(--space-4)',
    backgroundColor: 'var(--color-bg-card)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
  },
  habitEmoji: { fontSize: 20, flexShrink: 0 },
  habitTitle: {
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-text-primary)',
  },

  saveSection: {
    padding: '0 var(--space-5)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-3)',
    alignItems: 'center',
  },
  saveBtn: {
    width: '100%',
    padding: 'var(--space-4)',
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-lg)',
    fontSize: 'var(--font-size-md)',
    fontWeight: 'var(--font-weight-bold)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    fontFamily: 'var(--font-family)',
    boxShadow: '0 4px 14px rgba(79,122,232,0.35)',
  },
  saveBtnDone: {
    backgroundColor: 'var(--color-green)',
    boxShadow: '0 4px 14px rgba(76,175,130,0.35)',
  },
  saveHint: {
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-text-muted)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
};
