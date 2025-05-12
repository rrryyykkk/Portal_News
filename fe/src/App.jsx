import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Layout from "./layout/Layout";
import HomePage from "./pages/HomePage";
import SinglePage from "./pages/SinglePage";
import CategoryPage from "./pages/CategoryPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      <Route
        path="/news/:id"
        element={
          <Layout>
            <SinglePage />
          </Layout>
        }
      />
      <Route
        path="/category"
        element={
          <Layout>
            <CategoryPage />
          </Layout>
        }
        key="category"
      />
    </Routes>
  );
}

export default App;
