export function Button({ className = '', variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  };

  return (
    <button
      className={`inline-flex h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      type="button"
      {...props}
    />
  );
}
