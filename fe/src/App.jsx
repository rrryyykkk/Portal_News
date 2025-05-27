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
import { currentUserId, users } from "./data/userData";
import news from "./data/news.json";
import NewsPost from "./pages/news/NewsPost";
import LatestVideo from "./pages/news/LatestVideoPage";
import NotFound from "./pages/NotFound";

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
  const meUser = users.find((u) => u.id === currentUserId);
  console.log("news:", news);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <Layout meUser={meUser} news={news}>
            <HomePage news={news} video={videos} />
          </Layout>
        }
      />
      <Route
        path="/news/:id"
        element={
          <Layout meUser={meUser} news={news}>
            <SinglePage />
          </Layout>
        }
      />
      <Route
        path="/category/:categoryName"
        element={
          <Layout meUser={meUser} news={news}>
            <CategoryPage news={news} />
          </Layout>
        }
        key="category"
      />
      <Route
        path="/news-post"
        element={
          <Layout meUser={meUser} news={news}>
            <NewsPost news={news} />
          </Layout>
        }
      />
      <Route
        path="/latest-video"
        element={
          <Layout meUser={meUser} news={news}>
            <LatestVideo videos={videos} />
          </Layout>
        }
      />
      <Route
        path="/about-us"
        element={
          <Layout meUser={meUser} news={news}>
            <About />
          </Layout>
        }
      />
      <Route
        path="/contact-us"
        element={
          <Layout meUser={meUser} news={news}>
            <Contact />
          </Layout>
        }
      />
      <Route
        path="/profile/me"
        element={
          <Layout meUser={meUser} news={news}>
            <ProfilePage isMe meUser={meUser} />
          </Layout>
        }
      />
      <Route
        path="/profile/me/edit"
        element={
          <Layout meUser={meUser} news={news}>
            <EditProfile isMe meUser={meUser} />
          </Layout>
        }
      />
      <Route
        path="/profile/:id"
        element={
          <Layout meUser={meUser}>
            <ProfilePage meUser={meUser} />
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
  );
}

export default App;
