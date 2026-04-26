// PowerUp — Mock Data
// Alle data is in het Nederlands, child-friendly

export const mockChild = {
  id: 'child_1',
  name: 'Liam',      // demo-naam — echte naam komt uit .env
  age: 12,
  parentId: 'parent_1',
};

export const mockReward = {
  childId: 'child_1',
  title: 'Game PC',
  progressPercent: 42,
  readinessWeeksCompleted: 3,
  targetWeeks: 8,
  criteria: [
    'Scherm uit om 20:30 (5 van 7 dagen)',
    'Spullen opruimen na gebruik',
    'Rustig op gang en trap',
    '2x per week naar buiten gaan',
  ],
  nextMilestone: 'Nog 1 goede week tot de volgende stap 🌟',
};

export const mockHabits = [
  // === ACTIVE (max 3) ===
  {
    id: 'habit_1',
    childId: 'child_1',
    title: 'Scherm uit om 20:30',
    category: 'screen_sleep',
    status: 'active',
    difficulty: 'medium',
    emoji: '📴',
    why: [
      'Je valt sneller in slaap',
      'Je hoofd wordt rustiger',
      'Je hebt morgen meer energie',
    ],
    replacementOptions: [
      'Lezen',
      'Podcast luisteren',
      'Tekenen of schrijven',
      'Rustige muziek',
    ],
    ifThenRule: {
      if: 'Ik wil toch nog even scrollen',
      then: 'Pak een boek of zet een podcast op',
    },
    createdAt: '2026-04-01',
    updatedAt: '2026-04-15',
  },
  {
    id: 'habit_2',
    childId: 'child_1',
    title: 'Spullen direct opruimen',
    category: 'cleanup',
    status: 'active',
    difficulty: 'easy',
    emoji: '🧹',
    why: [
      'Alles is makkelijker terug te vinden',
      'Het huis voelt fijner voor iedereen',
      'Je hebt er zelf minder last van later',
    ],
    replacementOptions: [
      'Leg het direct terug op zijn plek',
      'Maak een vaste plek voor je spullen',
      'Ruim op voor je iets nieuws pakt',
    ],
    ifThenRule: {
      if: 'Ik ben klaar met iets gebruiken',
      then: 'Leg het meteen terug voor ik iets anders doe',
    },
    createdAt: '2026-04-01',
    updatedAt: '2026-04-15',
  },
  {
    id: 'habit_3',
    childId: 'child_1',
    title: 'Rustig op de gang en trap',
    category: 'home_calm',
    status: 'active',
    difficulty: 'easy',
    emoji: '🤫',
    why: [
      'Kiki blijft lekker slapen',
      'Het huis blijft rustig voor iedereen',
      'Je helpt mee aan een fijne ochtend of avond',
    ],
    replacementOptions: [
      'Rustig lopen in plaats van rennen',
      'Zacht praten op de gang',
      'Deuren zacht dichtdoen',
    ],
    ifThenRule: {
      if: 'Ik loop naar boven of beneden',
      then: 'Doe ik dat rustig en zacht',
    },
    createdAt: '2026-04-01',
    updatedAt: '2026-04-15',
  },

  // === MAINTENANCE ===
  {
    id: 'habit_4',
    childId: 'child_1',
    title: 'Lamp uit om 21:00',
    category: 'screen_sleep',
    status: 'maintenance',
    difficulty: 'easy',
    emoji: '💡',
    why: [
      'Je lichaam weet dat het slaaptijd is',
      'Je slaapt dieper en beter',
    ],
    replacementOptions: ['Luister nog even muziek', 'Droom lekker weg'],
    ifThenRule: { if: 'Het is 21:00', then: 'Gaat de lamp uit' },
    createdAt: '2026-03-15',
    updatedAt: '2026-04-10',
  },
  {
    id: 'habit_5',
    childId: 'child_1',
    title: 'WC netjes achterlaten',
    category: 'cleanup',
    status: 'maintenance',
    difficulty: 'easy',
    emoji: '🚽',
    why: [
      'Het is fijner voor iedereen',
      'Je laat zien dat je verantwoordelijkheid neemt',
    ],
    replacementOptions: [
      'Even checken na gebruik',
      'Borstel gebruiken als nodig',
      'Doorspoel goed',
    ],
    ifThenRule: {
      if: 'Ik ga van de WC af',
      then: 'Check ik even snel of alles netjes is',
    },
    createdAt: '2026-03-15',
    updatedAt: '2026-04-10',
  },

  // === NOT STARTED (komende gewoontes) ===
  {
    id: 'habit_6',
    childId: 'child_1',
    title: '2x per week hardlopen',
    category: 'healthy_active',
    status: 'not_started',
    difficulty: 'medium',
    emoji: '🏃',
    why: [
      'Je hoofd wordt er helder van',
      'Je slaapt beter na bewegen',
      'Het geeft je energie voor de rest van de dag',
    ],
    replacementOptions: [
      'Begin met 10 minuten, bouw langzaam op',
      'Doe het samen met iemand',
      'Luister muziek of een podcast tijdens het lopen',
    ],
    ifThenRule: {
      if: 'Het is dinsdag of donderdag',
      then: 'Trek ik mijn sportschoenen aan na school',
    },
    createdAt: '2026-04-20',
    updatedAt: '2026-04-20',
  },
  {
    id: 'habit_7',
    childId: 'child_1',
    title: 'Elke ochtend naar buiten',
    category: 'healthy_active',
    status: 'not_started',
    difficulty: 'medium',
    emoji: '☀️',
    why: [
      'Daglicht in de ochtend helpt je wakker worden',
      'Frisse lucht geeft energie',
      'Je begint de dag actief',
    ],
    replacementOptions: [
      'Breng de hond even uit',
      'Loop een klein blokje om',
      'Haal even iets bij de winkel',
    ],
    ifThenRule: {
      if: 'Ik heb ontbeten',
      then: 'Ga ik even naar buiten, al is het maar 5 minuten',
    },
    createdAt: '2026-04-20',
    updatedAt: '2026-04-20',
  },
  {
    id: 'habit_8',
    childId: 'child_1',
    title: 'Lezen voor het slapengaan',
    category: 'screen_sleep',
    status: 'paused',
    difficulty: 'easy',
    emoji: '📚',
    why: [
      'Je valt sneller in slaap dan na schermgebruik',
      'Lezen maakt je hoofd rustiger',
    ],
    replacementOptions: [
      'Leg een boek naast je bed',
      'Kies een boek dat je echt leuk vindt',
    ],
    ifThenRule: {
      if: 'Ik ga naar bed',
      then: 'Lees ik eerst 10 minuten',
    },
    createdAt: '2026-03-20',
    updatedAt: '2026-04-18',
  },
];

// Dagelijkse check-ins voor deze week
const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];

export const mockCheckIns = [
  // Today — nog niet ingevuld
  // Yesterday
  { id: 'ci_1', childId: 'child_1', habitId: 'habit_1', date: yesterday, status: 'self_done', note: '' },
  { id: 'ci_2', childId: 'child_1', habitId: 'habit_2', date: yesterday, status: 'with_help', note: '' },
  { id: 'ci_3', childId: 'child_1', habitId: 'habit_3', date: yesterday, status: 'self_done', note: '' },
  // Two days ago
  { id: 'ci_4', childId: 'child_1', habitId: 'habit_1', date: twoDaysAgo, status: 'self_done', note: '' },
  { id: 'ci_5', childId: 'child_1', habitId: 'habit_2', date: twoDaysAgo, status: 'not_yet', note: '' },
  { id: 'ci_6', childId: 'child_1', habitId: 'habit_3', date: twoDaysAgo, status: 'self_done', note: '' },
];

// Weekreview data
export const mockWeeklyReview = {
  id: 'wr_1',
  childId: 'child_1',
  weekStart: '2026-04-14',
  wentWell: 'Lamp bijna elke avond op tijd uit!',
  wasHard: 'Scherm om 20:30 was soms lastig als er nog iets spannends was.',
  nextFocusHabitIds: ['habit_1', 'habit_2', 'habit_3'],
  parentNote: 'Je doet het echt goed. Trots op je!',
  childReflection: 'Ik vind opruimen nog wel moeilijk maar ik probeer het.',
};

// Categorieën metadata
export const categoryMeta = {
  screen_sleep: {
    label: 'Scherm & Slaap',
    emoji: '🌙',
    color: '--color-purple',
    colorSoft: '--color-purple-soft',
  },
  cleanup: {
    label: 'Zelf opruimen',
    emoji: '🧹',
    color: '--color-green',
    colorSoft: '--color-green-soft',
  },
  home_calm: {
    label: 'Rust in huis',
    emoji: '🏠',
    color: '--color-teal',
    colorSoft: '--color-teal-soft',
  },
  healthy_active: {
    label: 'Gezond & Actief',
    emoji: '💪',
    color: '--color-coral',
    colorSoft: '--color-coral-soft',
  },
};

// Status labels
export const statusLabels = {
  active: 'Actief',
  maintenance: 'Onderhoud',
  paused: 'Gepauzeerd',
  not_started: 'Binnenkort',
};

// Check-in status labels
export const checkinLabels = {
  self_done: { label: 'Zelf gelukt', emoji: '⭐', color: 'var(--color-done)' },
  with_help: { label: 'Gelukt met hulp', emoji: '🤝', color: 'var(--color-help)' },
  not_yet:   { label: 'Nog niet gedaan', emoji: '💭', color: 'var(--color-not-yet)' },
};
