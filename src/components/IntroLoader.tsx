import React, { useEffect, useState } from 'react';
import { BRAND_CONFIG } from '../data/brandConfig';
import { BAKERY_PRODUCTS } from '../data/products';
import { soundEngine } from '../utils/soundEngine';

interface IntroLoaderProps {
  onComplete?: () => void;
}

export const IntroLoader: React.FC<IntroLoaderProps> = ({ onComplete }) => {
  const [lifted, setLifted] = useState(false);
  const [hidden, setHidden] = useState(false);

  const triggerLift = () => {
    if (lifted) return;
    soundEngine.playShutterLift();
    setLifted(true);
    setTimeout(() => {
      setHidden(true);
      onComplete?.();
    }, 1250);
  };

  useEffect(() => {
    const handleWheelOrTouch = () => {
      triggerLift();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'Escape') {
        triggerLift();
      }
    };

    window.addEventListener('wheel', handleWheelOrTouch, { passive: true });
    window.addEventListener('touchmove', handleWheelOrTouch, { passive: true });
    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('wheel', handleWheelOrTouch);
      window.removeEventListener('touchmove', handleWheelOrTouch);
      window.removeEventListener('keydown', handleKey);
    };
  }, [lifted]);

  if (hidden) return null;

  return (
    <div
      className={`intro-curtain ${lifted ? 'lifted' : ''}`}
      onClick={triggerLift}
      role="dialog"
      aria-label="Welcome to The Frenzy Delights — Tap or scroll to raise the bakery shutter"
    >
      {/* Peepholes showing actual hero cakes behind the shutter */}
      <div className="intro-peepholes">
        {BAKERY_PRODUCTS.slice(0, 4).map((prod) => (
          <div key={prod.id} className="intro-peephole">
            <img
              src={prod.images.hero640}
              srcSet={prod.images.heroSrcSet}
              sizes="(max-width: 640px) 45vw, 180px"
              alt={prod.shortTitle}
              decoding="async"
            />
          </div>
        ))}
      </div>

      <div className="intro-badge-wrap">
        <div className="intro-logo-ring">
          <img
            src={BRAND_CONFIG.logos.bakerSquare}
            alt="The Frenzy Delights Baker Emblem"
            width={110}
            height={110}
          />
        </div>
        <span className="section-kicker">THIRUMANGALAM • ARTISANAL CAKE &amp; BROWNIE ATELIER</span>
        <h1 className="intro-title">{BRAND_CONFIG.name}</h1>
        <p className="intro-tagline">“{BRAND_CONFIG.tagline}”</p>

        <button
          type="button"
          className="intro-enter-btn"
          onClick={(e) => {
            e.stopPropagation();
            triggerLift();
          }}
        >
          RAISE THE ATELIER SHUTTER ↓
        </button>
      </div>
    </div>
  );
};
