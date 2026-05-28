import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, Shield, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Login() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [role, setRole] = useState('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (role === 'admin' && email === 'admin@healthconnect.com' && password === 'admin123') {
      navigate('/admin/dashboard');
    } else if (role === 'citizen' && email === 'citizen@gmail.com' && password === '123456') {
      navigate('/citizen/dashboard');
    } else {
      setError('Invalid email or password for the selected role');
    }
  };

  return (
    <div className="animate-fade-in py-16 bg-light min-h-screen flex items-center justify-center">
      <div className="container" style={{ maxWidth: '500px' }}>
        <div className="card text-center mb-8 p-8 shadow-lg">
          <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-2">{t('login_welcome_back')}</h1>
          <p className="text-gray mb-6">{t('login_description')}</p>

          
          {error && (
              <div className="bg-danger-light text-danger p-3 rounded-md mb-6 flex items-center gap-2 justify-center font-medium">
              <AlertTriangle size={18} /> {error}
            </div>

          )}

          <div className="flex justify-center gap-4 mb-6">
            <button 
              type="button"
              className={`btn flex-1 ${role === 'citizen' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => { setRole('citizen'); setError(''); }}
            >
              <User size={18} /> {t('login_citizen_role')}
            </button>
            <button 
              type="button"
              className={`btn flex-1 ${role === 'admin' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => { setRole('admin'); setError(''); }}
            >
              <Shield size={18} /> {t('login_admin_role')}
            </button>

          </div>

          <div className="mb-6" style={{ textAlign: 'left' }}>
            <p className="text-sm text-gray" style={{ marginBottom: '0.5rem' }}>
              New to HealthConnect?{' '}
              <button
                type="button"
                className="btn btn-outline"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                onClick={() => navigate('/citizen/register')}
              >
                Register as Citizen
              </button>
            </p>
          </div>

          <form onSubmit={handleLogin} className="text-left">
            <div className="input-group mb-4">
              <label>{t('login_email')}</label>


              <input 
                type="email" 
                className="input-control" 
                placeholder={t('login_email_placeholder')} 

                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="input-group mb-8">
              <label>{t('login_password')}</label>

              <input 
                type="password" 
                className="input-control" 
                placeholder={t('login_password_placeholder')} 

                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button type="submit" className="btn btn-primary w-full text-lg py-3">
              Log In
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
