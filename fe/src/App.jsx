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
import LatestVideo from "./pages/news/LatestVideo";

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
            <HomePage news={news} />
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
        path="/about-us"
        element={
          <Layout meUser={meUser} news={news}>
            <LatestVideo />
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
    </Routes>
  );
}

export default App;
