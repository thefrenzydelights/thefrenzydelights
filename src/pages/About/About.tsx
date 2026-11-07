import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Heart, MapPin, Clock, Send, Instagram } from 'lucide-react';
import { BRAND_CONFIG } from '../../data/brandConfig';
import { BAKERY_PRODUCTS } from '../../data/products';
import { CursorFallingTitle } from '../../components/CursorFallingTitle';

export const About: React.FC = () => {
  const [portraitColor, setPortraitColor] = useState(false);
  const navigate = useNavigate();

  return (
    <main style={{ minHeight: '100vh', background: '#160f0d' }}>
      <CursorFallingTitle
        text="OUR STORY"
        subtitle="PAGE 04 • THE THIRUMANGALAM HOME-BAKERY MANIFESTO"
        lampFlicker={false}
      />

      {/* =====================================================================
          SPLIT-SCREEN EDITORIAL MANIFESTO (.about-split Reinterpretation)
          ===================================================================== */}
      <section
        style={{
          maxWidth: '1320px',
          margin: '0 auto 5rem',
          padding: '0.5rem clamp(1rem, 4vw, 1.5rem)',
        }}
      >
        <div className="tfd-about-split">
          {/* Sticky Left Column: Baker Emblem & Grayscale-to-Color Collage Frame */}
          <div className="tfd-about-left">
            <div
              onMouseEnter={() => setPortraitColor(true)}
              onMouseLeave={() => setPortraitColor(false)}
              onClick={() => setPortraitColor((prev) => !prev)}
              role="button"
              tabIndex={0}
              aria-label="Toggle portrait colour grading"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setPortraitColor((prev) => !prev);
              }}
              className="tfd-about-portrait-card"
            >
              <div
                style={{
                  position: 'relative',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  aspectRatio: '4 / 5',
                  background: '#1c120f',
                }}
              >
                <img
                  src={BAKERY_PRODUCTS[1].images.card480}
                  srcSet={BAKERY_PRODUCTS[1].images.cardSrcSet}
                  sizes="(max-width: 960px) 90vw, 460px"
                  alt="The Frenzy Delights Signature Engagement Cake"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: portraitColor
                      ? 'grayscale(0%) contrast(1.05)'
                      : 'grayscale(70%) sepia(16%) contrast(1.06)',
                    transform: portraitColor ? 'scale(1.03)' : 'scale(1)',
                    transition: 'filter 0.6s ease, transform 0.6s var(--ease-editorial)',
                  }}
                />

                <img
                  src={BRAND_CONFIG.logos.bakerSquare}
                  alt="The Frenzy Delights Official Baker Illustration"
                  width={88}
                  height={88}
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    width: 'clamp(72px, 18vw, 96px)',
                    height: 'clamp(72px, 18vw, 96px)',
                    borderRadius: '12px',
                    border: '2px solid var(--butter)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.55)',
                    objectFit: 'cover',
                  }}
                />
              </div>

              <div
                style={{
                  marginTop: '0.9rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.4rem',
                  color: 'var(--espresso-deep)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-hand)',
                    fontSize: 'clamp(1.2rem, 3.5vw, 1.45rem)',
                    fontWeight: 700,
                  }}
                >
                  The Frenzy Delights — “Bliss in Every Bite”
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-condensed)',
                    fontSize: '0.78rem',
                    letterSpacing: '0.14em',
                    color: '#7a5244',
                  }}
                >
                  TAP / HOVER FOR COLOUR
                </span>
              </div>
            </div>

            {/* Secondary Mini Polaroid Strip */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                marginTop: '1.4rem',
              }}
            >
              {[BAKERY_PRODUCTS[0], BAKERY_PRODUCTS[2], BAKERY_PRODUCTS[3]].map((p, i) => (
                <div
                  key={p.id}
                  style={{
                    background: 'var(--paper-polaroid)',
                    padding: '0.35rem 0.35rem 0.6rem',
                    borderRadius: '6px',
                    transform: `rotate(${i % 2 === 0 ? 1.8 : -1.8}deg)`,
                    boxShadow: '0 10px 24px rgba(0,0,0,0.45)',
                  }}
                >
                  <img
                    src={p.images.insta400}
                    srcSet={p.images.instaSrcSet}
                    sizes="(max-width: 640px) 28vw, 140px"
                    alt={p.shortTitle}
                    loading="lazy"
                    decoding="async"
                    style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 4 }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Scrolling Right Column: Editorial Manifesto */}
          <div className="tfd-about-right">
            <span className="section-kicker">
              <Sparkles size={15} /> ARTISANAL HOME BAKERY • THIRUMANGALAM
            </span>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.1rem, 5vw, 4.3rem)',
                lineHeight: 0.98,
                letterSpacing: '0.03em',
                color: 'var(--cream)',
                marginBottom: '1.35rem',
              }}
            >
              WE ARE THE FRENZY DELIGHTS
              <span className="tfd-cursor-blink" style={{ color: 'var(--butter)' }}>
                _
              </span>
            </h2>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                fontSize: 'clamp(0.96rem, 1.2vw, 1.08rem)',
                lineHeight: 1.72,
                color: 'rgba(244, 235, 221, 0.88)',
              }}
            >
              <p>
                Every celebration has a moment when the room goes quiet and all eyes turn toward the
                centerpiece. At <strong style={{ color: 'var(--butter)' }}>The Frenzy Delights</strong>,
                we believe that moment should feel personal, handcrafted, and unforgettable — never off
                a factory conveyor belt.
              </p>

              <p>
                Based in <strong style={{ color: 'var(--butter)' }}>Thirumangalam</strong>, our
                home-based patisserie studio crafts 100% homemade custom celebration cakes, multi-tier
                engagement centerpieces, rich dark-chocolate truffle hearts, and crackled fudge
                brownies from scratch.
              </p>

              <blockquote
                style={{
                  fontFamily: 'var(--font-hand)',
                  fontSize: 'clamp(1.38rem, 3vw, 1.7rem)',
                  color: 'var(--butter)',
                  padding: '0.95rem 1.25rem',
                  background: 'rgba(217, 185, 91, 0.08)',
                  borderLeft: '4px solid var(--butter)',
                  borderRadius: '0 12px 12px 0',
                  lineHeight: 1.25,
                }}
              >
                “From tweezers-placed edible gold leaf on a child’s first birthday cake to the molten
                crinkle top of an anniversary brownie slab — every detail is made by hand.”
              </blockquote>

              <p>
                Because every creation is baked fresh to order around your theme, colour palette, and
                occasion, we take custom enquiries directly via Instagram DM (
                <a
                  href={BRAND_CONFIG.contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--butter)', textDecoration: 'underline' }}
                >
                  {BRAND_CONFIG.contact.instagramHandle}
                </a>
                ) with a recommended lead time of <strong>3 to 4 days in advance</strong>.
              </p>
            </div>

            {/* Verified Pillars Grid */}
            <div className="tfd-about-pillars-grid">
              <div className="tfd-about-pillar-card">
                <Heart size={20} style={{ color: 'var(--butter)', marginBottom: '0.5rem' }} />
                <h3
                  style={{
                    fontFamily: 'var(--font-condensed)',
                    letterSpacing: '0.12em',
                    fontSize: '1.2rem',
                    color: 'var(--cream)',
                  }}
                >
                  100% HOMEMADE CRAFT
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(244,235,221,0.75)', marginTop: 4 }}>
                  Small-batch sponges, ganache, buttercream, and fudgy brownies baked fresh for every
                  single order.
                </p>
              </div>

              <div className="tfd-about-pillar-card">
                <MapPin size={20} style={{ color: 'var(--butter)', marginBottom: '0.5rem' }} />
                <h3
                  style={{
                    fontFamily: 'var(--font-condensed)',
                    letterSpacing: '0.12em',
                    fontSize: '1.2rem',
                    color: 'var(--cream)',
                  }}
                >
                  THIRUMANGALAM ATELIER
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(244,235,221,0.75)', marginTop: 4 }}>
                  Proudly serving families and celebrations in Thirumangalam with bespoke themed cakes.
                </p>
              </div>

              <div className="tfd-about-pillar-card">
                <Clock size={20} style={{ color: 'var(--butter)', marginBottom: '0.5rem' }} />
                <h3
                  style={{
                    fontFamily: 'var(--font-condensed)',
                    letterSpacing: '0.12em',
                    fontSize: '1.2rem',
                    color: 'var(--cream)',
                  }}
                >
                  3–4 DAYS ADVANCE NOTICE
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(244,235,221,0.75)', marginTop: 4 }}>
                  Gives our kitchen the time to prepare custom acrylic toppers, fondant figures, and
                  layered tiers.
                </p>
              </div>
            </div>

            {/* Clearly Marked Editable Placeholders for Unverified Founder/History Details */}
            <div
              style={{
                marginTop: '2rem',
                padding: '1.2rem 1.35rem',
                borderRadius: '14px',
                border: '1px dashed rgba(217, 185, 91, 0.45)',
                background: 'rgba(24, 17, 15, 0.65)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-condensed)',
                  letterSpacing: '0.16em',
                  color: 'var(--butter)',
                  fontSize: '0.86rem',
                  marginBottom: '0.45rem',
                }}
              >
                EDITABLE OWNER BIOGRAPHY &amp; TIMELINE BLOCK (CONFIGURE IN src/data/brandConfig.ts)
              </div>
              <p style={{ fontSize: '0.88rem', color: 'rgba(244, 235, 221, 0.78)', lineHeight: 1.6, overflowWrap: 'break-word' }}>
                <strong>Head Baker / Founder:</strong>{' '}
                {BRAND_CONFIG.storyPlaceholders.founderNamePlaceholder}
                <br />
                <strong>Kitchen Origin Note:</strong>{' '}
                {BRAND_CONFIG.storyPlaceholders.establishedNotePlaceholder}
              </p>
            </div>

            {/* Closing CTA */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', marginTop: '2rem' }}>
              <button
                type="button"
                className="btn-frenzy-primary"
                onClick={() => navigate('/contact')}
              >
                <Send size={16} /> ENQUIRE ABOUT YOUR CELEBRATION CAKE
              </button>
              <a
                href={BRAND_CONFIG.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-frenzy-outline"
              >
                <Instagram size={16} /> VISIT {BRAND_CONFIG.contact.instagramHandle}
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .tfd-about-split {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 3.2rem;
          align-items: start;
        }
        .tfd-about-left {
          position: sticky;
          top: 6.2rem;
        }
        .tfd-about-portrait-card {
          background: var(--paper-polaroid);
          padding: 1rem 1rem 1.5rem;
          border-radius: 14px;
          box-shadow: 0 26px 65px rgba(0, 0, 0, 0.65);
          transform: rotate(-1.2deg);
          cursor: pointer;
          position: relative;
          border: 2px solid var(--butter);
        }
        .tfd-about-pillars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-top: 2rem;
        }
        .tfd-about-pillar-card {
          background: rgba(244, 235, 221, 0.04);
          border: 1px solid rgba(217, 185, 91, 0.25);
          border-radius: 14px;
          padding: 1.15rem;
        }
        .tfd-cursor-blink {
          animation: tfdBlink 1s step-end infinite;
        }
        @keyframes tfdBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @media (max-width: 960px) {
          .tfd-about-split {
            grid-template-columns: 1fr;
            gap: 2.4rem;
          }
          .tfd-about-left {
            position: static;
            max-width: 480px;
            width: 100%;
            margin: 0 auto;
          }
          .tfd-about-portrait-card {
            transform: none;
          }
        }
        @media (max-width: 680px) {
          .tfd-about-pillars-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
};
