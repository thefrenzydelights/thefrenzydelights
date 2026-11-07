import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Instagram, Sparkles, MapPin, Clock, Send } from 'lucide-react';
import { BRAND_CONFIG } from '../data/brandConfig';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="ark-footer">
      <div className="ark-shimmer-line" />

      <div className="ark-footer-grid">
        {/* Col 1: Brand Identity & Quote */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <img
              src={BRAND_CONFIG.logos.bakerSquare}
              alt="The Frenzy Delights Baker Logo"
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '14px',
                border: '1.5px solid var(--butter)',
                objectFit: 'cover',
              }}
            />
            <div>
              <span className="section-kicker" style={{ marginBottom: '0.2rem' }}>
                <Sparkles size={13} /> {BRAND_CONFIG.tagline}
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.1rem',
                  letterSpacing: '0.06em',
                  color: 'var(--cream)',
                }}
              >
                {BRAND_CONFIG.name}
              </h3>
            </div>
          </div>

          <p className="ark-footer-quote">
            “A little frenzy in the kitchen. A lot of delight on your celebration table.”
          </p>

          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-frenzy-primary"
              onClick={() => {
                navigate('/contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <Send size={15} /> START AN ORDER ENQUIRY
            </button>
            <a
              href={BRAND_CONFIG.contact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-frenzy-outline"
            >
              <Instagram size={16} /> {BRAND_CONFIG.contact.instagramHandle}
            </a>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div>
          <h4
            style={{
              fontFamily: 'var(--font-condensed)',
              letterSpacing: '0.2em',
              color: 'var(--butter)',
              fontSize: '1.05rem',
              marginBottom: '1rem',
            }}
          >
            ATELIER DIRECTORY
          </h4>
          <ul
            style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              fontFamily: 'var(--font-condensed)',
              fontSize: '1.1rem',
              letterSpacing: '0.12em',
            }}
          >
            {[
              { label: '01 / HOME SHOWCASE', path: '/' },
              { label: '02 / OUR CREATIONS (SCRAPBOOK)', path: '/creations' },
              { label: '03 / SIGNATURE DELIGHTS (3D MENU)', path: '/menu' },
              { label: '04 / OUR STORY & CRAFT', path: '/story' },
              { label: '05 / CUSTOM CAKE ENQUIRY', path: '/contact' },
            ].map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{ transition: 'color 0.2s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--butter)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Studio Info & Logos */}
        <div>
          <h4
            style={{
              fontFamily: 'var(--font-condensed)',
              letterSpacing: '0.2em',
              color: 'var(--butter)',
              fontSize: '1.05rem',
              marginBottom: '1rem',
            }}
          >
            BAKERY ATELIER NOTES
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
              <MapPin size={18} style={{ color: 'var(--butter)', flexShrink: 0, marginTop: 3 }} />
              <span>{BRAND_CONFIG.location.fullDisplay}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
              <Clock size={18} style={{ color: 'var(--butter)', flexShrink: 0, marginTop: 3 }} />
              <span>{BRAND_CONFIG.ordering.leadTimeNotice}</span>
            </div>
          </div>

          {/* Official Brand Badges Stamp Strip */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', alignItems: 'center' }}>
            <img
              src={BRAND_CONFIG.logos.cupcakeCircle}
              alt="Cupcake Seal"
              style={{ width: 46, height: 46, borderRadius: '50%' }}
            />
            <img
              src={BRAND_CONFIG.logos.chefHatCircle}
              alt="Chef Hat Seal"
              style={{ width: 46, height: 46, borderRadius: '50%' }}
            />
            <img
              src={BRAND_CONFIG.logos.tieredCakeCircle}
              alt="Tiered Cake Seal"
              style={{ width: 46, height: 46, borderRadius: '50%' }}
            />
            <span className="handwritten-note" style={{ fontSize: '1.25rem', marginLeft: '0.3rem' }}>
              100% Homemade
            </span>
          </div>
        </div>
      </div>

      <div className="ark-footer-bottom">
        <span>© {new Date().getFullYear()} THE FRENZY DELIGHTS. ALL RIGHTS RESERVED.</span>
        <span>HANDCRAFTED CUSTOM CAKES, BROWNIES &amp; DESSERTS • THIRUMANGALAM</span>
      </div>
    </footer>
  );
};
