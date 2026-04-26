import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import AppLayout from './components/layout/AppLayout';
import LoadingScreen from './components/shared/LoadingScreen';
import ChildTodayPage from './pages/child/ChildTodayPage';
import HabitDetailPage from './pages/child/HabitDetailPage';
import GrowthOverviewPage from './pages/child/GrowthOverviewPage';
import WeeklyReviewPage from './pages/child/WeeklyReviewPage';
import ParentOverviewPage from './pages/parent/ParentOverviewPage';
import HabitsManagerPage from './pages/parent/HabitsManagerPage';
import RewardManagerPage from './pages/parent/RewardManagerPage';

function AppRoutes() {
  const { loading } = useApp();

  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Child routes */}
        <Route index element={<ChildTodayPage />} />
        <Route path="gewoonte/:habitId" element={<HabitDetailPage />} />
        <Route path="groei" element={<GrowthOverviewPage />} />
        <Route path="samen" element={<WeeklyReviewPage />} />

        {/* Parent routes */}
        <Route path="ouder" element={<ParentOverviewPage />} />
        <Route path="ouder/gewoontes" element={<HabitsManagerPage />} />
        <Route path="ouder/beloning" element={<RewardManagerPage />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
