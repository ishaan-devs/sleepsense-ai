import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import InsightsPanel from "../components/insights/InsightsPanel";

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeView, setActiveView] = useState("sleep");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">

      {/* Navbar */}
      <Navbar
        toggleMenu={() => setMobileOpen(!mobileOpen)}
        onLogout={handleLogout}
      />

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-1 max-w-7xl mx-auto w-full">

        {/* Sidebar */}
        <div className="w-80 border-r bg-white">
          <Sidebar />
        </div>

        {/* Chat / Main Content */}
        <div className="flex-1 p-6 flex justify-center">
          <div className="w-full max-w-3xl">
            {children}
          </div>
        </div>

        {/* Insights */}
        <div className="w-96 border-l bg-white h-full">
          <InsightsPanel />
        </div>

      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex-1 p-4">

        {activeView === "sleep" && <Sidebar />}
        {activeView === "chat" && children}
        {activeView === "insights" && <InsightsPanel />}

      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40">

          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl p-6">

            <h2 className="font-semibold mb-6">Menu</h2>

            <button
              className="block w-full text-left py-2"
              onClick={() => {
                setActiveView("sleep");
                setMobileOpen(false);
              }}
            >
              Sleep Log
            </button>

            <button
              className="block w-full text-left py-2"
              onClick={() => {
                setActiveView("chat");
                setMobileOpen(false);
              }}
            >
              Chat
            </button>

            <button
              className="block w-full text-left py-2"
              onClick={() => {
                setActiveView("insights");
                setMobileOpen(false);
              }}
            >
              Insights
            </button>

          </div>

        </div>
      )}
    </div>
  );
};

export default Layout;
