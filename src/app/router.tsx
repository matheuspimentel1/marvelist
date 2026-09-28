import { Route, Routes } from "react-router";

import MainLayout from "../layouts/MainLayout";

import LandingPage from "../pages/LandingPage";
import HomePage from "../pages/HomePage";
import BrowsePage from "../pages/BrowsePage";
import VideoListPage from "../pages/VideoListPage";
import ProfilePage from "../pages/ProfilePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import ProtectedRoute from "../features/auth/ProtectedRoute";
import ProfileSettingsPage from "../pages/ProfileSettingsPage";

function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          index
          element={<LandingPage />}
        />

        <Route
          path="browse"
          element={<BrowsePage />}
        />

        <Route
          path="login"
          element={<LoginPage />}
        />

        <Route
          path="signup"
          element={<SignupPage />}
        />

        <Route
          path="profile/:username"
          element={<ProfilePage />}
        />

      <Route element={<ProtectedRoute />}>
        <Route
          path="home"
          element={<HomePage />}
        />

          <Route
            path="profile"
            element={<ProfilePage />}
          />

          <Route
            path="list"
            element={<VideoListPage />}
          />

          <Route
            path="settings/profile"
            element={<ProfileSettingsPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRouter;