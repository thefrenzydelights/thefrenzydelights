import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Volume2, VolumeX, Sparkles, X, Menu, Instagram, Send } from 'lucide-react';
import { BRAND_CONFIG } from '../data/brandConfig';
import { soundEngine } from '../utils/soundEngine';

interface NavRoute {
  num: string;
  label: string;
  sub: string;
  path: string;
  rotRest: number;
}

const NAV_ROUTES: NavRoute[] = [
  { num: '01', label: 'HOME', sub: 'The Atelier Showcase', path: '/', rotRest: -1.4 },
  { num: '02', label: 'OUR CREATIONS', sub: 'The Baker’s Scrapbook', path: '/creations', rotRest: 1.2 },
  { num: '03', label: 'SIGNATURE MENU', sub: 'Interactive 3D Delights', path: '/menu', rotRest: -1.1 },
  { num: '04', label: 'OUR STORY', sub: 'Thirumangalam Craft', path: '/story', rotRest: 1.5 },
  { num: '05', label: 'ORDER / ENQUIRE', sub: 'Custom Cake Requests', path: '/contact', rotRest: -0.9 },
];

export const Navigation: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [morphing, setMorphing] = useState(false);
  const [morphLabel, setMorphLabel] = useState('');
  const [soundOn, setSoundOn] = useState(true);
  const grainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const menuItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Ensure menu closes automatically whenever route changes and unlock scroll
  useEffect(() => {
    setMenuOpen(false);
    document.body.classList.remove('tfd-scroll-locked');
  }, [location.pathname]);

  // Lock background scrolling & handle Escape key while menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('tfd-scroll-locked');
      // GSAP staggered entrance for menu items
      const els = menuItemsRef.current.filter(Boolean);
      gsap.fromTo(
        els,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.48, stagger: 0.06, ease: 'power3.out', overwrite: true }
      );
    } else {
      document.body.classList.remove('tfd-scroll-locked');
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.classList.remove('tfd-scroll-locked');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  // Animated grain canvas inside ANK menu overlay (lightweight 12fps on mobile)
  useEffect(() => {
    if (!menuOpen || !grainCanvasRef.current) return;
    const canvas = grainCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let lastTime = 0;
    const w = (canvas.width = 180);
    const h = (canvas.height = 180);

    const drawGrain = (now: number) => {
      if (now - lastTime > 80) {
        lastTime = now;
        const imgData = ctx.createImageData(w, h);
        const buf = imgData.data;
        for (let i = 0; i < buf.length; i += 4) {
          const v = (Math.random() * 255) | 0;
          buf[i] = v;
          buf[i + 1] = (v * 0.92) | 0;
          buf[i + 2] = (v * 0.8) | 0;
          buf[i + 3] = 34;
        }
        ctx.putImageData(imgData, 0, 0);
      }
      animId = requestAnimationFrame(drawGrain);
    };
    animId = requestAnimationFrame(drawGrain);
    return () => cancelAnimationFrame(animId);
  }, [menuOpen]);

  const handleNavigate = (path: string, label: string) => {
    if (location.pathname === path) {
      setMenuOpen(false);
      return;
    }
    soundEngine.playCardFlip();
    setMenuOpen(false);
    setMorphLabel(label);
    setMorphing(true);
    setTimeout(() => {
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }, 260);
    setTimeout(() => {
      setMorphing(false);
    }, 580);
  };

  const handleSoundToggle = () => {
    const enabled = soundEngine.toggleMute();
    setSoundOn(enabled);
  };

  return (
    <>
      {/* Morph Page Transition Curtain */}
      <div className={`morph-overlay ${morphing ? 'active' : ''}`} aria-hidden="true">
        <div className="morph-overlay-inner">{morphLabel}</div>
      </div>

      {/* Top Bar */}
      <header className="tfd-topbar">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleNavigate('/', 'HOME');
          }}
          className="tfd-brand-pill"
          aria-label="The Frenzy Delights — Home"
        >
          <img
            src={BRAND_CONFIG.logos.cupcakeCircle}
            alt="The Frenzy Delights Logo"
            width={34}
            height={34}
          />
          <div className="tfd-brand-pill-text">
            <span className="tfd-brand-pill-name">THE FRENZY DELIGHTS</span>
            <span className="tfd-brand-pill-sub">{BRAND_CONFIG.tagline}</span>
          </div>
        </a>

        <div className="tfd-topbar-actions">
          <nav className="tfd-quick-nav" aria-label="Primary Desktop Navigation">
            {NAV_ROUTES.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate(item.path, item.label);
                }}
                className={`tfd-quick-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="tfd-sound-btn"
            onClick={handleSoundToggle}
            title={soundOn ? 'Mute Atelier Sound Effects' : 'Enable Atelier Sound Effects'}
            aria-label={soundOn ? 'Mute sound effects' : 'Enable sound effects'}
          >
            {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          <button
            type="button"
            className="ank-trigger"
            onClick={() => {
              soundEngine.playCardFlip();
              setMenuOpen((prev) => !prev);
            }}
            aria-expanded={menuOpen}
            aria-controls="tfd-ank-overlay-menu"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
            <span>{menuOpen ? 'CLOSE' : 'MENU'}</span>
          </button>
        </div>
      </header>

      {/* Fullscreen ANK-Style Overlay Menu */}
      <div
        id="tfd-ank-overlay-menu"
        className={`ank-overlay ${menuOpen ? 'open' : ''}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Site Navigation Menu"
      >
        <canvas ref={grainCanvasRef} className="ank-grain-canvas" />

        <nav className="ank-menu-list" aria-label="Full Screen Navigation">
          {NAV_ROUTES.map((route, idx) => {
            const isCurrent = location.pathname === route.path;
            return (
              <div
                key={route.path}
                ref={(el) => {
                  menuItemsRef.current[idx] = el;
                }}
                className={`ank-item ${isCurrent ? 'active-route' : ''}`}
                style={{ transform: `rotate(${route.rotRest}deg)` }}
                onClick={() => handleNavigate(route.path, route.label)}
                role="button"
                tabIndex={menuOpen ? 0 : -1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNavigate(route.path, route.label);
                  }
                }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.6rem' }}>
                  <span className="ank-item-num">{route.num}</span>
                  <span>{route.label}</span>
                </div>
                <span className="ank-item-sub">— {route.sub}</span>
              </div>
            );
          })}
        </nav>

        {/* Dedicated Quick Action CTAs inside Mobile/Overlay Menu */}
        <div className="ank-mobile-cta-row">
          <button
            type="button"
            className="btn-frenzy-primary"
            onClick={() => handleNavigate('/contact', 'ORDER / ENQUIRE')}
            tabIndex={menuOpen ? 0 : -1}
          >
            <Send size={16} /> START CUSTOM CAKE ENQUIRY
          </button>
          <a
            href={BRAND_CONFIG.contact.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-frenzy-outline"
            tabIndex={menuOpen ? 0 : -1}
          >
            <Instagram size={16} /> {BRAND_CONFIG.contact.instagramHandle}
          </a>
        </div>

        <div className="ank-overlay-footer">
          <span>
            <Sparkles size={14} style={{ display: 'inline', marginRight: 6, color: 'var(--butter)' }} />
            {BRAND_CONFIG.location.fullDisplay}
          </span>
          <span>{BRAND_CONFIG.ordering.leadTimeNotice}</span>
        </div>
      </div>
    </>
  );
};
