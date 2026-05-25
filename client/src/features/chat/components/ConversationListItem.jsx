export function ConversationListItem({ conversation, active, onClick }) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left transition ${
        active ? 'bg-brand-50' : 'hover:bg-slate-50'
      }`}
      onClick={onClick}
    >
      <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-slate-200 text-sm font-semibold text-slate-700">
        {conversation.name.slice(0, 2).toUpperCase()}
        {conversation.online && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold text-slate-950">{conversation.name}</span>
          <span className="shrink-0 text-xs text-slate-400">{conversation.updatedAt}</span>
        </span>
        <span className="mt-0.5 flex items-center justify-between gap-2">
          <span className="truncate text-sm text-slate-500">{conversation.lastMessage}</span>
          {conversation.unreadCount > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1.5 text-xs font-semibold text-white">
              {conversation.unreadCount}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}
