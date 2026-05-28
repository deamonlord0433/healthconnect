import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function CitizenRegister() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validate = () => {
    if (!name || !email || !password || !confirmPassword) return 'Please fill in all fields';
    if (!email.includes('@')) return 'Please enter a valid email';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Client-side demo registration (no backend persistence in this project yet)
    // Store a simple flag so we can route to citizen dashboard without breaking existing backend.
    try {
      localStorage.setItem(
        'healthconnect_citizen_registered',
        JSON.stringify({ name, email, createdAt: Date.now() })
      );
    } catch (_) {
      // ignore storage errors
    }

    setSuccess('Registration successful. Please log in.');
    setTimeout(() => {
      navigate('/login');
    }, 1200);
  };

  return (
    <div className="animate-fade-in py-16 bg-light min-h-screen flex items-center justify-center">
      <div className="container" style={{ maxWidth: '520px' }}>
        <div className="card text-center mb-6 p-8 shadow-lg">
          <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <User size={32} />
          </div>

          <h1 className="text-3xl font-bold mb-2">Citizen Registration</h1>
          <p className="text-gray mb-6">Create your citizen profile</p>

          {error && (
            <div className="bg-danger-light text-danger p-3 rounded-md mb-6 flex items-center gap-2 justify-center font-medium">
              <AlertTriangle size={18} /> {error}
            </div>
          )}
          {success && (
            <div className="bg-success-light text-success p-3 rounded-md mb-6 flex items-center gap-2 justify-center font-medium">
              <CheckCircle2 size={18} /> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="text-left">
            <div className="input-group mb-4">
              <label>Full Name</label>
              <input
                type="text"
                className="input-control"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="input-group mb-4">
              <label>Email Address</label>
              <input
                type="email"
                className="input-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group mb-4">
              <label>Password</label>
              <input
                type="password"
                className="input-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="input-group mb-6">
              <label>Confirm Password</label>
              <input
                type="password"
                className="input-control"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary w-full text-lg py-3">
              Register
            </button>
          </form>

          <div className="mt-6 text-sm text-gray">
            <p className="mb-1">
              <Mail size={16} style={{ marginRight: 8 }} /> After registration, use the demo citizen login from the Login page.
            </p>
            <p>
              <Lock size={16} style={{ marginRight: 8 }} /> This is a UI registration flow (no backend persistence yet).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

