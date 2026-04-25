import { createContext, useContext, useState, useCallback } from 'react';
import {
  mockChild, mockReward, mockHabits, mockCheckIns, mockWeeklyReview
} from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [child] = useState(mockChild);
  const [reward, setReward] = useState(mockReward);
  const [habits, setHabits] = useState(mockHabits);
  const [checkIns, setCheckIns] = useState(mockCheckIns);
  const [weeklyReview, setWeeklyReview] = useState(mockWeeklyReview);
  const [mode, setMode] = useState('child'); // 'child' | 'parent'

  const activeHabits = habits.filter(h => h.status === 'active').slice(0, 3);
  const maintenanceHabits = habits.filter(h => h.status === 'maintenance');
  const notStartedHabits = habits.filter(h => h.status === 'not_started');
  const pausedHabits = habits.filter(h => h.status === 'paused');

  const getTodayCheckIn = useCallback((habitId) => {
    const today = new Date().toISOString().split('T')[0];
    return checkIns.find(ci => ci.habitId === habitId && ci.date === today) || null;
  }, [checkIns]);

  const setCheckIn = useCallback((habitId, status, note = '') => {
    const today = new Date().toISOString().split('T')[0];
    setCheckIns(prev => {
      const existing = prev.findIndex(ci => ci.habitId === habitId && ci.date === today);
      const newEntry = {
        id: `ci_${Date.now()}`,
        childId: child.id,
        habitId,
        date: today,
        status,
        note,
      };
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = newEntry;
        return updated;
      }
      return [...prev, newEntry];
    });
  }, [child.id]);

  const updateHabit = useCallback((habitId, updates) => {
    setHabits(prev => prev.map(h =>
      h.id === habitId ? { ...h, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : h
    ));
  }, []);

  const addHabit = useCallback((habit) => {
    const newHabit = {
      ...habit,
      id: `habit_${Date.now()}`,
      childId: child.id,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setHabits(prev => [...prev, newHabit]);
  }, [child.id]);

  // Bereken voortgang per categorie (0-100)
  const getCategoryProgress = useCallback((category) => {
    const catHabits = habits.filter(h =>
      h.category === category && (h.status === 'active' || h.status === 'maintenance')
    );
    if (catHabits.length === 0) return 0;
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(Date.now() - i * 86400000);
      return d.toISOString().split('T')[0];
    });
    let total = 0, possible = 0;
    catHabits.forEach(habit => {
      last7Days.forEach(date => {
        possible++;
        const ci = checkIns.find(c => c.habitId === habit.id && c.date === date);
        if (ci && (ci.status === 'self_done' || ci.status === 'with_help')) total++;
      });
    });
    return possible > 0 ? Math.round((total / possible) * 100) : 0;
  }, [habits, checkIns]);

  const saveWeeklyReview = useCallback((review) => {
    setWeeklyReview(review);
  }, []);

  const updateReward = useCallback((updates) => {
    setReward(prev => ({ ...prev, ...updates }));
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
