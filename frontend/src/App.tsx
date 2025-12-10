// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WorkoutsPage from './pages/WorkoutsPage';
import WorkoutDetailPage from './pages/WorkoutDetailPage';
import ExercisesPage from './pages/ExercisesPage';
import ExerciseDetailPage from './pages/ExerciseDetailPage';
import ProfilePage from './pages/ProfilePage';
import EditWorkoutPage from './pages/EditWorkoutPage';
import WeeklyPlanPage from './pages/WeeklyPlanPage';
import ActiveWorkoutPage from './pages/ActiveWorkoutPage';



const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
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
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
