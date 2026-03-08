import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const LandingPage = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/app");
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-blue-100 flex flex-col">

      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>

      {/* Floating Moon */}
      <div className="absolute right-10 top-24 text-8xl opacity-80 animate-bounce hidden lg:block">
        🌙
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 relative z-10">

        <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
          SleepSense AI
        </h1>

        <p className="max-w-xl text-gray-600 text-lg mb-10">
          An intelligent sleep companion that helps you understand your sleep,
          analyze patterns, and improve your wellbeing with the help of AI.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">

          <Link to="/login">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl shadow-lg transition">
              Login
            </button>
          </Link>

          <Link to="/signup">
            <button className="bg-green-500 hover:bg-green-600 text-white px-7 py-3 rounded-xl shadow-lg transition">
              Get Started
            </button>
          </Link>

        </div>

      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-8 relative z-10">

        <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg p-6 text-center hover:scale-105 transition">

          <div className="text-3xl mb-3">🧠</div>

          <h3 className="font-semibold text-lg mb-2">
            AI Sleep Companion
          </h3>

          <p className="text-gray-600 text-sm">
            Chat with an AI assistant designed to help you manage sleep,
            stress, and emotional wellbeing.
          </p>

        </div>

        <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg p-6 text-center hover:scale-105 transition">

          <div className="text-3xl mb-3">📊</div>

          <h3 className="font-semibold text-lg mb-2">
            Sleep Insights
          </h3>

          <p className="text-gray-600 text-sm">
            Visualize your sleep data with charts and understand patterns
            that affect your health.
          </p>

        </div>

        <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg p-6 text-center hover:scale-105 transition">

          <div className="text-3xl mb-3">🌿</div>

          <h3 className="font-semibold text-lg mb-2">
            Improve Your Wellbeing
          </h3>

          <p className="text-gray-600 text-sm">
            Learn how sleep influences your mood, energy, and daily
            productivity.
          </p>

        </div>

      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 pb-8 relative z-10">
        © {new Date().getFullYear()} SleepSense AI
      </div>

    </div>
  );
};

export default LandingPage;