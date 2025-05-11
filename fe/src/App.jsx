import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Layout from "./layout/Layout";
import HomePage from "./pages/HomePage";
import SinglePage from "./pages/SinglePage";

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
    </Routes>
  );
}

export default App;
