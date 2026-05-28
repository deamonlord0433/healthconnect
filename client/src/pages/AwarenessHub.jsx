import { useMemo, useState } from 'react';
import { BookOpen, PlayCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { guideTopics } from '../i18n/guideContent';

const TOPIC_CARDS = [
  {
    id: 'water_sanitation',
    videoSrc: 'https://www.youtube.com/embed/TDBCq96R9Pc',
    videoTitle: 'Clean Water & Sanitation',
    duration: '6:34',
    guideTitleKey: guideTopics.water_sanitation.titleKey,
    guideDescriptionKey: guideTopics.water_sanitation.descriptionKey,
  },
  {
    id: 'mosquito_prevention',
    videoSrc: 'https://www.youtube.com/embed/qED2vJwcJCk',
    videoTitle: 'Let’s Do Our Part to Prevent Mosquito Breeding',
    duration: '7:20',
    guideTitleKey: guideTopics.mosquito_prevention.titleKey,
    guideDescriptionKey: guideTopics.mosquito_prevention.descriptionKey,
  },
  {
    id: 'hand_hygiene_kids',
    videoSrc: 'https://www.youtube.com/embed/eNmte6Xe3R4',
    videoTitle: 'Germ Smart Kids: How-To Handwashing',
    duration: '6:31',
    guideTitleKey: guideTopics.hand_hygiene_kids.titleKey,
    guideDescriptionKey: guideTopics.hand_hygiene_kids.descriptionKey,
  },
];

function GuideSection({ t, topicKey, isOpen }) {
  const topic = guideTopics[topicKey];

  // Smooth expand/collapse with no layout jumps
  return (
    <div
      style={{
        marginTop: '1rem',
        overflow: 'hidden',
        transition: 'max-height 380ms ease, opacity 250ms ease',
        maxHeight: isOpen ? 1000 : 0,
        opacity: isOpen ? 1 : 0,
        background: 'var(--light)',
        borderRadius: '0.5rem',
        borderLeft: '3px solid var(--primary)',
      }}
    >
      <div style={{ padding: '1rem' }}>
        <h4 style={{ fontWeight: 800, marginBottom: '0.75rem', color: 'var(--primary)' }}>
          {t(topic.titleKey)}
        </h4>
        <p className="text-gray" style={{ marginBottom: '1rem' }}>
          {t(topic.descriptionKey)}
        </p>

        {topic.sections.map((sec) => {
          const bullets = t(sec.bulletsKey);
          const isArray = Array.isArray(bullets);

          return (
            <div key={sec.headingKey} style={{ marginBottom: '1rem' }}>
              <h5 style={{ fontWeight: 700, color: 'var(--dark)', marginBottom: '0.5rem' }}>
                {t(sec.headingKey)}
              </h5>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {(isArray ? bullets : []).map((b, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
                    <span style={{ fontWeight: 650, color: 'var(--dark)' }}>• </span>
                    <span style={{ color: 'var(--gray)' }}>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        <div style={{ marginTop: '0.5rem' }}>
          <h5 style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.4rem' }}>
            {t('guide_safety_tips')}
          </h5>
          <p className="text-gray" style={{ marginBottom: 0 }}>
            {topicKey === 'water_sanitation'
              ? t('guide_water_sanitation_safety_tips')
              : topicKey === 'mosquito_prevention'
                ? t('guide_mosquito_prevention_safety_tips')
                : t('guide_hand_hygiene_kids_safety_tips')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AwarenessHub() {
  const { t } = useLanguage();
  const [expandedGuideId, setExpandedGuideId] = useState(null);

  const cards = useMemo(() => TOPIC_CARDS, []);

  const toggleGuide = (id) => setExpandedGuideId((prev) => (prev === id ? null : id));

  return (
    <div className="animate-fade-in py-12">
      <div className="container">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('awareness_hub')}</h1>
          <p className="text-xl text-gray max-w-2xl mx-auto">{t('awareness_hub_subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => {
            const isOpen = expandedGuideId === card.id;

            return (
              <div
                key={card.id}
                className="card p-0"
                style={{ padding: 0, display: 'flex', flexDirection: 'column' }}
              >
                {/* Responsive YouTube embed (inline play) */}
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                  <iframe
                    width="1128"
                    height="634"
                    src={card.videoSrc}
                    title={card.videoTitle}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  />
                </div>

                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <PlayCircle size={13} /> Video
                    </span>
                    <span className="text-sm text-gray font-medium">{card.duration}</span>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{t(card.guideTitleKey)}</h3>
                  <p className="text-gray mb-4" style={{ flex: 1 }}>
                    {t(card.guideDescriptionKey)}
                  </p>

                  <button
                    onClick={() => toggleGuide(card.id)}
                    className="btn btn-outline w-full"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <BookOpen size={16} /> {isOpen ? t('hide_guide') : t('guide')}
                  </button>

                  {/* Expandable Guide Panel */}
                  <GuideSection t={t} topicKey={card.id} isOpen={isOpen} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

