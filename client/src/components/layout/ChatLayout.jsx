import { LogOut, Menu, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ConversationSidebar } from '../../features/chat/components/ConversationSidebar.jsx';
import { useAuthStore } from '../../store/authStore.js';
import { useChatStore } from '../../store/chatStore.js';
import { useSocketStore } from '../../store/socketStore.js';

export function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const connect = useSocketStore((state) => state.connect);
  const disconnect = useSocketStore((state) => state.disconnect);
  const fetchConversations = useChatStore((state) => state.fetchConversations);

  useEffect(() => {
    if (!token) return undefined;

    connect(token);
    fetchConversations();
    return () => disconnect();
  }, [connect, disconnect, fetchConversations, token]);

  return (
    <div className="flex h-full bg-white">
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-80 border-r border-slate-200 bg-white transition-transform md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <ConversationSidebar onSelectConversation={() => setSidebarOpen(false)} />
      </aside>

      {sidebarOpen && (
        <button
          className="fixed inset-0 z-20 bg-slate-950/30 md:hidden"
          type="button"
          aria-label="Close conversation list"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
              aria-label="Open conversation list"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} aria-hidden="true" />
            </button>
            <MessageCircle className="hidden text-brand-600 md:block" size={24} aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-slate-950">{user?.name || 'Chat'}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Log out"
            onClick={logout}
          >
            <LogOut size={20} aria-hidden="true" />
          </button>
        </header>
        <Outlet />
      </section>
    </div>
  );
}
