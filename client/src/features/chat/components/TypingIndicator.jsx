export function TypingIndicator({ users }) {
  if (!users.length) {
    return null;
  }

  const names = users.map((user) => user.name).join(', ');

  return (
    <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-xs text-slate-500">
      {names} {users.length === 1 ? 'is' : 'are'} typing
      <span className="ml-1 inline-flex gap-0.5 align-middle">
        <span className="h-1 w-1 rounded-full bg-slate-400" />
        <span className="h-1 w-1 rounded-full bg-slate-400" />
        <span className="h-1 w-1 rounded-full bg-slate-400" />
      </span>
    </div>
  );
}
