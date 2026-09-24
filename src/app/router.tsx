import { Route, Routes } from "react-router";

import MainLayout from "../layouts/MainLayout";

import LandingPage from "../pages/LandingPage";
import HomePage from "../pages/HomePage";
import BrowsePage from "../pages/BrowsePage";
import VideoListPage from "../pages/VideoListPage";
import ProfilePage from "../pages/ProfilePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";

function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<LandingPage />} />

        <Route path="home" element={<HomePage />} />

        <Route path="browse" element={<BrowsePage />} />

        <Route path="list" element={<VideoListPage />} />

        <Route path="profile" element={<ProfilePage />} />

        <Route path="login" element={<LoginPage />} />

        <Route path="signup" element={<SignupPage />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;