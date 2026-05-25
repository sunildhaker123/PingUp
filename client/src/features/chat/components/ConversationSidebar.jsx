import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useChatStore } from '../../../store/chatStore.js';
import { ConversationListItem } from './ConversationListItem.jsx';

export function ConversationSidebar({ onSelectConversation }) {
  const [query, setQuery] = useState('');
  const conversations = useChatStore((state) => state.conversations);
  const users = useChatStore((state) => state.users);
  const activeConversationId = useChatStore((state) => state.activeConversationId);
  const isSearchingUsers = useChatStore((state) => state.isSearchingUsers);
  const error = useChatStore((state) => state.error);
  const setActiveConversation = useChatStore((state) => state.setActiveConversation);
  const searchUsers = useChatStore((state) => state.searchUsers);
  const startDirectConversation = useChatStore((state) => state.startDirectConversation);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      searchUsers(query);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [query, searchUsers]);

  const filteredConversations = useMemo(
    () =>
      conversations.filter((conversation) =>
        conversation.name.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [conversations, query]
  );

  const selectConversation = (conversationId) => {
    setActiveConversation(conversationId);
    onSelectConversation?.();
  };

  const selectUser = async (userId) => {
    await startDirectConversation(userId);
    setQuery('');
    onSelectConversation?.();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 p-4">
        <h2 className="text-lg font-semibold text-slate-950">Chats</h2>
        <label className="mt-3 flex h-10 items-center gap-2 rounded-lg bg-slate-100 px-3 text-slate-500">
          <Search size={18} aria-hidden="true" />
          <input
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            placeholder="Search conversations"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {query.trim() && (
          <div className="border-b border-slate-200">
            <p className="px-4 pb-2 pt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              People
            </p>
            {isSearchingUsers && <p className="px-4 py-3 text-sm text-slate-500">Searching...</p>}
            {!isSearchingUsers &&
              users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50"
                  onClick={() => selectUser(user.id)}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-200 text-sm font-semibold text-slate-700">
                    {user.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-slate-950">{user.name}</span>
                    <span className="block truncate text-xs text-slate-500">{user.email}</span>
                  </span>
                </button>
              ))}
            {!isSearchingUsers && users.length === 0 && (
              <p className="px-4 py-3 text-sm text-slate-500">No users found</p>
            )}
          </div>
        )}

        {error && <p className="mx-4 my-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <p className="px-4 pb-2 pt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Conversations
        </p>
        {filteredConversations.length === 0 && (
          <p className="px-4 py-3 text-sm text-slate-500">Search for a registered user to start chatting.</p>
        )}
        {filteredConversations.map((conversation) => (
          <ConversationListItem
            key={conversation.id}
            conversation={conversation}
            active={conversation.id === activeConversationId}
            onClick={() => selectConversation(conversation.id)}
          />
        ))}
      </div>
    </div>
  );
}
