// src/App.tsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const WorkoutsPage = lazy(() => import('./pages/WorkoutsPage'));
const WorkoutDetailPage = lazy(() => import('./pages/WorkoutDetailPage'));
const ExercisesPage = lazy(() => import('./pages/ExercisesPage'));
const ExerciseDetailPage = lazy(() => import('./pages/ExerciseDetailPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const EditWorkoutPage = lazy(() => import('./pages/EditWorkoutPage'));
const WeeklyPlanPage = lazy(() => import('./pages/WeeklyPlanPage'));
const ActiveWorkoutPage = lazy(() => import('./pages/ActiveWorkoutPage'));



const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Suspense fallback={<LoadingSpinner fullPage />}>
            <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protégées */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workouts"
              element={
                <ProtectedRoute>
                  <WorkoutsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workouts/:id"
              element={
                <ProtectedRoute>
                  <WorkoutDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workouts/:id/edit"
              element={
                <ProtectedRoute>
                  <EditWorkoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workouts/:id/play"
              element={
                <ProtectedRoute>
                  <ActiveWorkoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exercises"
              element={
                <ProtectedRoute>
                  <ExercisesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/exercises/:id"
              element={
                <ProtectedRoute>
                  <ExerciseDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/weekly-plan"
              element={
                <ProtectedRoute>
                  <WeeklyPlanPage />
                </ProtectedRoute>
              }
            />
            </Routes>
          </Suspense>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
