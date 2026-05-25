import { Phone, Video } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useChatStore } from '../../../store/chatStore.js';
import { SOCKET_EVENTS, useSocketStore } from '../../../store/socketStore.js';
import { MessageInput } from './MessageInput.jsx';
import { MessageList } from './MessageList.jsx';
import { TypingIndicator } from './TypingIndicator.jsx';

export function MessageArea() {
  const conversations = useChatStore((state) => state.conversations);
  const activeConversationId = useChatStore((state) => state.activeConversationId);
  const messagesByConversation = useChatStore((state) => state.messagesByConversation);
  const typingUsersByConversation = useChatStore((state) => state.typingUsersByConversation);
  const fetchMessages = useChatStore((state) => state.fetchMessages);
  const emit = useSocketStore((state) => state.emit);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId),
    [activeConversationId, conversations]
  );

  const messages = messagesByConversation[activeConversationId] || [];
  const typingUsers = typingUsersByConversation[activeConversationId] || [];

  useEffect(() => {
    if (!activeConversationId) return undefined;

    fetchMessages(activeConversationId);
    emit(SOCKET_EVENTS.ROOM_JOIN, { conversationId: activeConversationId });

    return () => emit(SOCKET_EVENTS.ROOM_LEAVE, { conversationId: activeConversationId });
  }, [activeConversationId, emit, fetchMessages]);

  if (!activeConversation) {
    return (
      <div className="grid flex-1 place-items-center px-6 text-center text-sm text-slate-500">
        Search for a registered user from the sidebar to start a real conversation.
      </div>
    );
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-200 text-sm font-semibold text-slate-700">
            {activeConversation.name.slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-slate-950">{activeConversation.name}</h2>
            <p className="text-xs text-slate-500">{activeConversation.type === 'group' ? 'Group chat' : 'Direct chat'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="grid h-10 w-10 place-items-center rounded-lg text-slate-500 hover:bg-slate-100" type="button" aria-label="Start audio call">
            <Phone size={19} aria-hidden="true" />
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-lg text-slate-500 hover:bg-slate-100" type="button" aria-label="Start video call">
            <Video size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      <MessageList messages={messages} />
      <TypingIndicator users={typingUsers} />
      <MessageInput conversationId={activeConversationId} />
    </main>
  );
}
