import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button.jsx';
import { Input } from '../../../components/ui/Input.jsx';
import { useAuthStore } from '../../../store/authStore.js';

export function AuthForm({ mode }) {
  const isRegister = mode === 'register';
  const navigate = useNavigate();
  const location = useLocation();
  const authAction = useAuthStore((state) => (isRegister ? state.register : state.login));
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = isRegister ? form : { email: form.email, password: form.password };

    await authAction(payload);
    navigate(location.state?.from?.pathname || '/chat', { replace: true });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {isRegister && (
        <Input
          id="name"
          label="Name"
          name="name"
          autoComplete="name"
          value={form.name}
          onChange={updateField}
          required
        />
      )}
      <Input
        id="email"
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        value={form.email}
        onChange={updateField}
        required
      />
      <Input
        id="password"
        label="Password"
        name="password"
        type="password"
        autoComplete={isRegister ? 'new-password' : 'current-password'}
        value={form.password}
        onChange={updateField}
        required
      />

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <Button className="w-full" type="submit" disabled={isLoading}>
        {isLoading ? 'Please wait...' : isRegister ? 'Create account' : 'Log in'}
      </Button>

      <p className="text-center text-sm text-slate-500">
        {isRegister ? 'Already have an account?' : 'New here?'}{' '}
        <Link className="font-semibold text-brand-600 hover:text-brand-700" to={isRegister ? '/login' : '/register'}>
          {isRegister ? 'Log in' : 'Create account'}
        </Link>
      </p>
    </form>
  );
}
