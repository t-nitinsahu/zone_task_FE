import { Outlet } from "react-router-dom";

import { Navbar } from "../components/navigation/Navbar";

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};
