export function Input({ label, id, className = '', ...props }) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      <input
        id={id}
        className={`h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 ${className}`}
        {...props}
      />
    </label>
  );
}
