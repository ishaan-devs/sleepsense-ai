import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./layout/Layout";
import ChatWindow from "./components/chat/ChatWindow";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const ProtectedRoute = ({ children }) => {

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {

  return (

    <Routes>

      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected App */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Layout>
              <ChatWindow />
            </Layout>
          </ProtectedRoute>
        }
      />

    </Routes>

  );

}

export default App;