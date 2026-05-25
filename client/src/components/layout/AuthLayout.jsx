import { MessageCircle } from 'lucide-react';
import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <main className="grid min-h-full place-items-center bg-slate-100 px-4 py-8">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-600 text-white">
            <MessageCircle size={22} aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-slate-950">Chat App</h1>
            <p className="text-sm text-slate-500">Secure real-time messaging</p>
          </div>
        </div>
        <Outlet />
      </section>
    </main>
  );
}
