import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { collection, doc, getDocs, setDoc, query, where } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { db, auth, googleProvider } from '../firebase';
import {
  mockChild, mockReward, mockHabits, mockCheckIns, mockWeeklyReview,
} from '../data/mockData';

const AppContext = createContext(null);

// ─── E-mail whitelist (uit .env) ─────────────────────────────────────────────
const PARENT_EMAIL = import.meta.env.VITE_PARENT_EMAIL;
const CHILD_EMAIL  = import.meta.env.VITE_CHILD_EMAIL;

// ─── Firestore helpers ────────────────────────────────────────────────────────
async function loadFromFirestore() {
  const habitsSnap = await getDocs(collection(db, 'habits'));
  const habits = habitsSnap.docs.map(d => ({ ...d.data(), id: d.id }));

  const cutoff = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
  const ciSnap = await getDocs(
    query(collection(db, 'checkIns'), where('date', '>=', cutoff))
  );
  const checkIns = ciSnap.docs.map(d => ({ ...d.data(), id: d.id }));

  const settingsSnap = await getDocs(collection(db, 'settings'));
  const settingsMap = Object.fromEntries(settingsSnap.docs.map(d => [d.id, d.data()]));

  return {
    habits,
    checkIns,
    reward:      settingsMap.reward      ?? mockReward,
    weeklyReview: settingsMap.weeklyReview ?? mockWeeklyReview,
  };
}

async function seedFirestore() {
  for (const habit of mockHabits) {
    await setDoc(doc(db, 'habits', habit.id), habit);
  }
  for (const ci of mockCheckIns) {
    await setDoc(doc(db, 'checkIns', ci.id), ci);
  }
  await setDoc(doc(db, 'settings', 'reward'), mockReward);
  await setDoc(doc(db, 'settings', 'weeklyReview'), mockWeeklyReview);
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [child, setChild] = useState(mockChild);
  const [reward,       setReward]       = useState(mockReward);
  const [habits,       setHabits]       = useState(mockHabits);
  const [checkIns,     setCheckIns]     = useState(mockCheckIns);
  const [weeklyReview, setWeeklyReview] = useState(mockWeeklyReview);
  const [mode,         setMode]         = useState('child');
  const [user,         setUser]         = useState(null);
  const [isDemo,       setIsDemo]       = useState(true);   // demo totdat echte user inlogt
  const [loading,      setLoading]      = useState(true);   // wacht op auth + data

  // ── Auth state: bepaal rol en laad de juiste data ─────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      const email = firebaseUser?.email ?? '';
      const isParent = email === PARENT_EMAIL;
      const isChild  = email === CHILD_EMAIL;
      const isKnown  = isParent || isChild;

      if (!isKnown) {
        // Niet ingelogd of onbekend account → demo mode met mock data
        setHabits(mockHabits);
        setCheckIns(mockCheckIns);
        setReward(mockReward);
        setWeeklyReview(mockWeeklyReview);
        setChild(mockChild);   // herstel demo-naam "Liam"
        setMode('child');
        setIsDemo(true);
        setLoading(false);
        return;
      }

      // Bekend account → echte data laden uit Firestore
      setIsDemo(false);
      setMode(isParent ? 'parent' : 'child');
      // Zet de echte kindnaam (uit .env)
      setChild(prev => ({ ...prev, name: import.meta.env.VITE_CHILD_NAME ?? prev.name }));
      setLoading(true);

      try {
        const data = await loadFromFirestore();

        if (data.habits.length === 0) {
          // Eerste gebruik: seed en herlaad
          await seedFirestore();
          const seeded = await loadFromFirestore();
          setHabits(seeded.habits);
          setCheckIns(seeded.checkIns);
          setReward(seeded.reward);
          setWeeklyReview(seeded.weeklyReview);
        } else {
          setHabits(data.habits);
          setCheckIns(data.checkIns);
          setReward(data.reward);
          setWeeklyReview(data.weeklyReview);
        }
      } catch (err) {
        console.error('[PowerUp] Firestore laad-fout:', err);
        // Fallback naar mock zodat de app niet crasht
        setHabits(mockHabits);
        setCheckIns(mockCheckIns);
      } finally {
        setLoading(false);
      }
    });

    return unsub;
  }, []);

  // ── Computed ─────────────────────────────────────────────────────────────
  const activeHabits      = habits.filter(h => h.status === 'active').slice(0, 3);
  const maintenanceHabits = habits.filter(h => h.status === 'maintenance');
  const notStartedHabits  = habits.filter(h => h.status === 'not_started');
  const pausedHabits      = habits.filter(h => h.status === 'paused');

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getTodayCheckIn = useCallback((habitId) => {
    const today = new Date().toISOString().split('T')[0];
    return checkIns.find(ci => ci.habitId === habitId && ci.date === today) || null;
  }, [checkIns]);

  // ── Check-in (demo: alleen lokaal; echt: ook Firestore) ───────────────────
  const setCheckIn = useCallback((habitId, status, note = '') => {
    const today = new Date().toISOString().split('T')[0];
    const id = `ci_${habitId}_${today}`;
    const newEntry = { id, childId: child.id, habitId, date: today, status, note };

    setCheckIns(prev => {
      const idx = prev.findIndex(ci => ci.habitId === habitId && ci.date === today);
      if (idx >= 0) { const u = [...prev]; u[idx] = newEntry; return u; }
      return [...prev, newEntry];
    });

    if (!isDemo) {
      setDoc(doc(db, 'checkIns', id), newEntry).catch(err =>
        console.error('[PowerUp] setCheckIn fout:', err)
      );
    }
  }, [child.id, isDemo]);

  // ── Habit updaten ─────────────────────────────────────────────────────────
  const updateHabit = useCallback((habitId, updates) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h;
      const updated = { ...h, ...updates, updatedAt: new Date().toISOString().split('T')[0] };
      if (!isDemo) {
        setDoc(doc(db, 'habits', habitId), updated).catch(err =>
          console.error('[PowerUp] updateHabit fout:', err)
        );
      }
      return updated;
    }));
  }, [isDemo]);

  // ── Habit toevoegen ───────────────────────────────────────────────────────
  const addHabit = useCallback((habit) => {
    const id = `habit_${Date.now()}`;
    const newHabit = {
      ...habit, id, childId: child.id,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setHabits(prev => [...prev, newHabit]);
    if (!isDemo) {
      setDoc(doc(db, 'habits', id), newHabit).catch(err =>
        console.error('[PowerUp] addHabit fout:', err)
      );
    }
  }, [child.id, isDemo]);

  // ── Categorievoortgang ────────────────────────────────────────────────────
  const getCategoryProgress = useCallback((category) => {
    const catHabits = habits.filter(h =>
      h.category === category && (h.status === 'active' || h.status === 'maintenance')
    );
    if (catHabits.length === 0) return 0;
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.now() - i * 86400000);
      return d.toISOString().split('T')[0];
    });
    let total = 0, possible = 0;
    catHabits.forEach(habit => {
      last7.forEach(date => {
        possible++;
        const ci = checkIns.find(c => c.habitId === habit.id && c.date === date);
        if (ci && (ci.status === 'self_done' || ci.status === 'with_help')) total++;
      });
    });
    return possible > 0 ? Math.round((total / possible) * 100) : 0;
  }, [habits, checkIns]);

  // ── Weekreview opslaan ────────────────────────────────────────────────────
  const saveWeeklyReview = useCallback((review) => {
    setWeeklyReview(review);
    if (!isDemo) {
      setDoc(doc(db, 'settings', 'weeklyReview'), review).catch(err =>
        console.error('[PowerUp] saveWeeklyReview fout:', err)
      );
    }
  }, [isDemo]);

  // ── Beloning updaten ──────────────────────────────────────────────────────
  const updateReward = useCallback((updates) => {
    setReward(prev => {
      const updated = { ...prev, ...updates };
      if (!isDemo) {
        setDoc(doc(db, 'settings', 'reward'), updated).catch(err =>
          console.error('[PowerUp] updateReward fout:', err)
        );
      }
      return updated;
    });
  }, [isDemo]);

  // ── Google inloggen ───────────────────────────────────────────────────────
  const signInWithGoogle = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged handelt de rest af
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        console.error('[PowerUp] Inloggen mislukt:', err);
      }
    }
  }, []);

  // ── Uitloggen (→ demo mode) ───────────────────────────────────────────────
  const signOutUser = useCallback(async () => {
    await signOut(auth);
    // onAuthStateChanged zet alles terug naar demo
  }, []);

  return (
    <AppContext.Provider value={{
      child,
      reward,
      habits,
      activeHabits,
      maintenanceHabits,
      notStartedHabits,
      pausedHabits,
      checkIns,
      weeklyReview,
      mode,
      setMode,
      loading,
      isDemo,
      user,
      signInWithGoogle,
      signOutUser,
      getTodayCheckIn,
      setCheckIn,
      updateHabit,
      addHabit,
      getCategoryProgress,
      saveWeeklyReview,
      updateReward,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
