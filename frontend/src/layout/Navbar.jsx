const Navbar = ({ toggleMenu, onLogout }) => {

  return (

    <div className="h-16 flex-shrink-0 bg-primary text-white flex items-center justify-between px-4 lg:px-6 shadow-md">

      {/* Left Section */}
      <div className="flex items-center gap-3">

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-xl"
          onClick={toggleMenu}
        >
          ☰
        </button>

        {/* Logo */}
        <span className="text-2xl">🌙</span>

        <h1 className="font-semibold text-lg tracking-wide">
          SleepSense AI
        </h1>

      </div>

      {/* Center Tagline (Desktop only) */}
      <div className="hidden lg:block text-sm opacity-80">
        Understand Your Sleep. Improve Your Mood.
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">

        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md text-sm transition"
        >
          Logout
        </button>

      </div>

    </div>

  );

};

export default Navbar;