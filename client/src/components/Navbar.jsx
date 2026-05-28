import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HeartPulse, Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const links = [
    { name: t('home'), path: '/' },
    { name: t('awareness_hub'), path: '/awareness' },
    { name: t('report_issue'), path: '/report' },
    { name: 'Login', path: '/login' },
  ];

  useEffect(() => {
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement({ pageLanguage: 'en', autoDisplay: false }, 'google_translate_element');
      };
    }
  }, []);

  const handleLanguageChange = (e) => {
    const val = e.target.value;
    const nativeLangs = ['en', 'te', 'hi'];
    if (nativeLangs.includes(val)) {
      const hasCookie = document.cookie.includes('googtrans=');
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=localhost; path=/;';
      setLanguage(val);
      if (hasCookie) window.location.reload();
    } else {
      document.cookie = `googtrans=/en/${val}; path=/`;
      document.cookie = `googtrans=/en/${val}; domain=localhost; path=/`;
      setLanguage(val);
      window.location.reload();
    }
  };

  return (
    <>
      <nav style={{
        background: 'linear-gradient(135deg, rgba(239, 246, 255, 0.96), rgba(240, 253, 250, 0.96))',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '1rem 0',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', textDecoration: 'none' }}>
            <HeartPulse size={32} />
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>HealthConnect</span>
          </Link>

          {/* Desktop Navigation + Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {/* Desktop nav links */}
            <div className="desktop-nav" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    fontWeight: 500,
                    color: location.pathname === link.path ? 'var(--primary)' : 'var(--gray)',
                    textDecoration: 'none',
                    transition: 'color 0.3s',
                  }}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/report" className="btn btn-primary">{t('report_now')}</Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="mobile-menu-btn"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dark)' }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Globe Language Selector — always visible, always rightmost */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Globe size={18} color="var(--primary)" />
              <select
                value={language}
                onChange={handleLanguageChange}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--gray-light)',
                  borderRadius: '0.4rem',
                  padding: '0.3rem 0.5rem',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  color: 'var(--dark)',
                  outline: 'none',
                }}
              >
                <option value="en">English</option>
                <option value="te">తెలుగు</option>
                <option value="hi">हिंदी</option>
                <option disabled>──────</option>
                <option value="ta">தமிழ்</option>
                <option value="bn">বাংলা</option>
                <option value="mr">मराठी</option>
                <option value="gu">ગુજરાતી</option>
                <option value="kn">ಕನ್ನಡ</option>
                <option value="ml">മലയാളം</option>
                <option value="pa">ਪੰਜਾਬੀ</option>
                <option value="or">ଓଡ଼ିଆ</option>
                <option value="ur">اردو</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {isOpen && (
          <div style={{
            background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.98), rgba(240, 253, 250, 0.98))',
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--gray-light)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}>
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                style={{
                  fontWeight: 500,
                  color: location.pathname === link.path ? 'var(--primary)' : 'var(--dark)',
                  textDecoration: 'none',
                  padding: '0.5rem 0',
                }}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/report" className="btn btn-primary" style={{ textAlign: 'center' }} onClick={() => setIsOpen(false)}>
              {t('report_now')}
            </Link>
          </div>
        )}
      </nav>

      {/* Hidden Google Translate container */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>

      <style>{`
        body { top: 0 !important; }
        .skiptranslate iframe { display: none !important; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}
