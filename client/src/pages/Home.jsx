import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Droplets, Activity, Users, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  const stats = [
    { label: t('stats_issues_resolved'), value: '1,240+', icon: <ShieldAlert size={32} className="text-success" /> },
    { label: t('stats_villages_covered'), value: '45', icon: <Users size={32} className="text-primary" /> },
    { label: t('stats_water_sources_safe'), value: '89%', icon: <Droplets size={32} className="text-secondary" /> },
    { label: t('stats_active_volunteers'), value: '320', icon: <Activity size={32} className="text-warning" /> }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section 
        className="text-white py-20 text-center relative"
        style={{
          backgroundImage: 'linear-gradient(rgba(14, 165, 233, 0.8), rgba(16, 185, 129, 0.8)), url("https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container relative z-10">
          <h1 className="text-4xl font-bold mb-6">{t('hero_title')}</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ opacity: 0.9 }}>
            {t('hero_subtitle')}
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/report" className="btn bg-white text-primary px-8 py-3 rounded-full font-bold text-lg" style={{ color: '#0EA5E9' }}>
              {t('report_now')} <ArrowRight size={20} />
            </Link>
            <Link to="/awareness" className="btn bg-white text-dark px-8 py-3 rounded-full font-bold text-lg" style={{ opacity: 0.9 }}>
              {t('learn_hygiene')}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16" style={{ backgroundColor: 'var(--light)' }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center flex-col items-center gap-4 no-hover" style={{ padding: '1rem' }}>
                <div className="mb-2">{stat.icon}</div>
                <h3 className="text-3xl font-bold text-dark mb-1">{stat.value}</h3>
                <p className="text-gray font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-light">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('how_it_works')}</h2>
            <p className="text-gray max-w-xl mx-auto">{t('how_it_works_sub')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card text-center">
              <div className="bg-gradient-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">1</div>
              <h3 className="text-xl font-bold mb-3">{t('learn_aware')}</h3>
              <p className="text-gray">{t('learn_aware_desc')}</p>
            </div>
            <div className="card text-center">
              <div className="bg-secondary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">2</div>
              <h3 className="text-xl font-bold mb-3">{t('report_instantly')}</h3>
              <p className="text-gray">{t('report_instantly_desc')}</p>
            </div>
            <div className="card text-center">
              <div className="bg-dark text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">3</div>
              <h3 className="text-xl font-bold mb-3">{t('rapid_response')}</h3>
              <p className="text-gray">{t('rapid_response_desc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
