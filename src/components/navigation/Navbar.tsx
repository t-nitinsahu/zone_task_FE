import { NavLink } from "react-router-dom";

import { theme } from "../../theme/theme";

const navClassName = ({ isActive }: { isActive: boolean }): string => {
  return isActive
    ? "rounded-lg bg-brand-700 px-3 py-2 text-sm font-semibold text-white"
    : "rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100";
};

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div>
          <p className="text-lg font-bold text-slate-900">{theme.appName}</p>
          <p className="text-xs text-slate-500">Lead pipeline and realtime operations</p>
        </div>
        <nav className="flex items-center gap-1">
          {theme.navigation.map((item) => (
            <NavLink key={item.path} to={item.path} className={navClassName}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};
