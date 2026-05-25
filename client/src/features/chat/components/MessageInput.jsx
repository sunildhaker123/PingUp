import { SendHorizonal } from 'lucide-react';
import { useRef, useState } from 'react';
import { useAuthStore } from '../../../store/authStore.js';
import { useChatStore } from '../../../store/chatStore.js';
import { SOCKET_EVENTS, useSocketStore } from '../../../store/socketStore.js';

export function MessageInput({ conversationId }) {
  const [body, setBody] = useState('');
  const typingTimeoutRef = useRef(null);
  const user = useAuthStore((state) => state.user);
  const addMessage = useChatStore((state) => state.addMessage);
  const emit = useSocketStore((state) => state.emit);

  const stopTypingSoon = () => {
    window.clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = window.setTimeout(() => {
      emit(SOCKET_EVENTS.TYPING_STOP, { conversationId });
    }, 900);
  };

  const handleChange = (event) => {
    setBody(event.target.value);
    emit(SOCKET_EVENTS.TYPING_START, { conversationId });
    stopTypingSoon();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedBody = body.trim();

    if (!trimmedBody) return;

    const tempMessage = {
      id: crypto.randomUUID(),
      conversationId,
      senderId: user?.id || 'me',
      senderName: 'You',
      body: trimmedBody,
      createdAt: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    addMessage(tempMessage);
    emit(SOCKET_EVENTS.MESSAGE_SEND, {
      conversationId,
      tempId: tempMessage.id,
      message: { body: trimmedBody },
    });
    emit(SOCKET_EVENTS.TYPING_STOP, { conversationId });
    setBody('');
  };

  return (
    <form className="flex items-end gap-3 border-t border-slate-200 bg-white p-3" onSubmit={handleSubmit}>
      <textarea
        className="max-h-32 min-h-11 flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        placeholder="Type a message"
        rows={1}
        value={body}
        onChange={handleChange}
      />
      <button
        type="submit"
        className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50"
        aria-label="Send message"
        disabled={!body.trim()}
      >
        <SendHorizonal size={20} aria-hidden="true" />
      </button>
    </form>
  );
}
