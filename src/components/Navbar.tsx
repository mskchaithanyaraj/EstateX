import ThemeToggler from "./ThemeToggler";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-slate-800 text-white">
      <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
        <span className="text-blue-800">HELLO</span>
        <span className="text-amber-200">Estate</span>
      </h1>
      <form>
        <input type="text" placeholder="Search..." className="" />
      </form>
      <div>
        <ThemeToggler />
      </div>
    </nav>
  );
};

export default Navbar;
