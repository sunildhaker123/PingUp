import { useAuthStore } from '../../../store/authStore.js';

export function MessageList({ messages }) {
  const currentUser = useAuthStore((state) => state.user);

  return (
    <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4">
      {messages.map((message) => {
        const isMine = message.senderId === currentUser?.id || message.senderName === 'You';

        return (
          <div key={message.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
            <article
              className={`max-w-[78%] rounded-lg px-3 py-2 shadow-sm ${
                isMine ? 'bg-brand-600 text-white' : 'bg-white text-slate-900'
              }`}
            >
              {!isMine && <p className="mb-1 text-xs font-semibold text-brand-600">{message.senderName}</p>}
              <p className="whitespace-pre-wrap break-words text-sm leading-6">{message.body}</p>
              <p className={`mt-1 text-right text-[11px] ${isMine ? 'text-blue-100' : 'text-slate-400'}`}>
                {message.createdAt}
              </p>
            </article>
          </div>
        );
      })}
    </div>
  );
}
