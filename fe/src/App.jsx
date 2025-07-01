import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Layout from "./layout/Layout";
import HomePage from "./pages/HomePage";
import SinglePage from "./pages/SinglePage";
import CategoryPage from "./pages/CategoryPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProfilePage from "./pages/ProfilePage";
import EditProfile from "./pages/profile/EditProfile";
import ProtectdRoutes from "./midlleware/ProtectedRoute";
import NewsPost from "./pages/news/NewsPost";
import LatestVideo from "./pages/news/LatestVideoPage";
import NotFound from "./pages/NotFound";

import { useAuthStore } from "./app/store/useAuthStore";

import Toast from "./components/common/Toast";

// data dummy videos
const videos = [
  {
    id: 1,
    video: "/videos/1.mp4",
    title: "Video 1",
    description: "Description 1",
  },
  {
    id: 2,
    video: "/videos/2.mp4",
    title: "Video 2",
    description: "Description 2",
  },
  {
    id: 3,
    video: "/videos/3.mp4",
    title: "Video 3",
    description: "Description 3",
  },
  {
    id: 4,
    video: "/videos/4.mp4",
    title: "Video 4",
    description: "Description 4",
  },
  {
    id: 5,
    video: "/videos/5.mp4",
    title: "Video 5",
    description: "Description 5",
  },
  {
    id: 6,
    video: "/videos/6.mp4",
    title: "Video 6",
    description: "Description 6",
  },
];

function App() {
  const meUser = useAuthStore((state) => state.user);

  return (
    <>
      <Toast />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <Layout meUser={meUser}>
              <HomePage video={videos} />
            </Layout>
          }
        />
        <Route
          path="/news/:id"
          element={
            <Layout meUser={meUser}>
              <SinglePage />
            </Layout>
          }
        />
        <Route
          path="/category/:categoryName"
          element={
            <Layout meUser={meUser}>
              <CategoryPage />
            </Layout>
          }
          key="category"
        />
        <Route
          path="/news-post"
          element={
            <Layout meUser={meUser}>
              <NewsPost />
            </Layout>
          }
        />
        <Route
          path="/latest-video"
          element={
            <Layout meUser={meUser}>
              <LatestVideo videos={videos} />
            </Layout>
          }
        />
        <Route
          path="/about-us"
          element={
            <Layout meUser={meUser}>
              <About />
            </Layout>
          }
        />
        <Route
          path="/contact-us"
          element={
            <Layout meUser={meUser}>
              <Contact />
            </Layout>
          }
        />
        <Route
          path="/profile/me"
          element={
            <Layout meUser={meUser}>
              <ProtectdRoutes>
                <ProfilePage isMe meUser={meUser} />
              </ProtectdRoutes>
            </Layout>
          }
        />
        <Route
          path="/profile/me/edit"
          element={
            <Layout meUser={meUser}>
              <ProtectdRoutes>
                <EditProfile isMe meUser={meUser} />
              </ProtectdRoutes>
            </Layout>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <Layout meUser={meUser}>
              <ProtectdRoutes>
                <ProfilePage meUser={meUser} />
              </ProtectdRoutes>
            </Layout>
          }
        />
        <Route
          path="*"
          element={
            <Layout meUser={meUser}>
              <NotFound />
            </Layout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
