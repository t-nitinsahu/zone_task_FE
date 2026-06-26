import type { PropsWithChildren } from "react";

export const PageShell = ({ children }: PropsWithChildren) => {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-500 p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold sm:text-3xl">Zone Chat</h1>
        <p className="mt-2 text-sm text-cyan-50">Real-time messaging with clean architecture and strict type safety.</p>
      </header>
      {children}
    </main>
  );
};
