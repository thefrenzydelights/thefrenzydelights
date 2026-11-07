import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowRight, Eye, RotateCw, Instagram, Send, Layers } from 'lucide-react';
import { BRAND_CONFIG } from '../../data/brandConfig';
import { BAKERY_PRODUCTS, BakeryProduct } from '../../data/products';
import { ProductModal } from '../../components/ProductModal';
import { soundEngine } from '../../utils/soundEngine';

gsap.registerPlugin(ScrollTrigger);

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<BakeryProduct | null>(null);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [cardOffsets, setCardOffsets] = useState<Record<string, { x: number; y: number }>>({});
  const [draggingCard, setDraggingCard] = useState<{
    id: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);
  const [assembledFragments, setAssembledFragments] = useState<Record<string, boolean>>({
    'prod-01': false,
    'prod-02': false,
    'prod-03': false,
  });
  const [openWindows, setOpenWindows] = useState<Record<number, boolean>>({
    0: false,
    1: false,
    2: false,
  });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const heroRef = useRef<HTMLDivElement | null>(null);
  const memoryTextRef = useRef<HTMLDivElement | null>(null);
  const fragmentSectionRef = useRef<HTMLDivElement | null>(null);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth <= 960) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: nx, y: ny });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (memoryTextRef.current) {
        gsap.fromTo(
          memoryTextRef.current,
          { filter: 'blur(10px)', scale: 0.9, opacity: 0.3 },
          {
            filter: 'blur(0px)',
            scale: 1,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: memoryTextRef.current,
              start: 'top 88%',
              end: 'center 52%',
              scrub: 0.5,
            },
          }
        );
      }

      ['prod-01', 'prod-02', 'prod-03'].forEach((id) => {
        const el = document.getElementById(`frag-box-${id}`);
        if (el) {
          ScrollTrigger.create({
            trigger: el,
            start: 'top 78%',
            onEnter: () => {
              setAssembledFragments((prev) => ({ ...prev, [id]: true }));
            },
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!draggingCard) return;
    const handleMove = (e: MouseEvent) => {
      const dx = e.clientX - draggingCard.startX;
      const dy = e.clientY - draggingCard.startY;
      setCardOffsets((prev) => ({
        ...prev,
        [draggingCard.id]: {
          x: draggingCard.origX + dx,
          y: draggingCard.origY + dy,
        },
      }));
    };
    const handleUp = () => {
      setDraggingCard(null);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [draggingCard]);

  const toggleCardFlip = (id: string) => {
    soundEngine.playCardFlip();
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleWindow = (idx: number) => {
    soundEngine.playShutterLift();
    setOpenWindows((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const FRAGMENT_SCATTER = [
    { x: -24, y: -22, r: -11 },
    { x: 10, y: -28, r: 8 },
    { x: 26, y: -20, r: 12 },
    { x: -28, y: 6, r: -9 },
    { x: 0, y: -10, r: 5 },
    { x: 28, y: 10, r: -10 },
    { x: -22, y: 26, r: 11 },
    { x: -6, y: 30, r: -8 },
    { x: 24, y: 24, r: 13 },
  ];

  const HERO_GRID_CELLS = [
    { prod: BAKERY_PRODUCTS[0], word: 'FRENZY' },
    { prod: BAKERY_PRODUCTS[1], word: 'ENGAGED' },
    { prod: BAKERY_PRODUCTS[2], word: 'TRUFFLE' },
    { prod: BAKERY_PRODUCTS[3], word: 'FUDGE' },
    { prod: BAKERY_PRODUCTS[0], word: 'BLISS', isCenter: true },
    { prod: BAKERY_PRODUCTS[4], word: 'GOLDEN' },
    { prod: BAKERY_PRODUCTS[5], word: 'AQUA' },
    { prod: BAKERY_PRODUCTS[2], word: 'CRAVE' },
    { prod: BAKERY_PRODUCTS[3], word: 'BAKED' },
  ];

  return (
    <main style={{ overflow: 'hidden' }}>
      {/* =====================================================================
          SECTION 01: FULL-SCREEN EDITORIAL HERO + MOBILE PORTRAIT SHOWCASE & 3x3 MOSAIC
          ===================================================================== */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        className="tfd-hero-section"
      >
        {/* Desktop Floating Decorative Cutout Medallions (hidden on mobile to prevent overlap) */}
        <img
          src={BAKERY_PRODUCTS[3].images.cutout300}
          srcSet={BAKERY_PRODUCTS[3].images.cutoutSrcSet}
          sizes="150px"
          alt=""
          aria-hidden="true"
          className="tfd-hero-float-decor tfd-hero-float-top"
          style={{
            transform: `translate3d(${mousePos.x * -32}px, ${mousePos.y * -26}px, 0) rotate(${mousePos.x * 15}deg)`,
          }}
        />
        <img
          src={BAKERY_PRODUCTS[4].images.cutout300}
          srcSet={BAKERY_PRODUCTS[4].images.cutoutSrcSet}
          sizes="140px"
          alt=""
          aria-hidden="true"
          className="tfd-hero-float-decor tfd-hero-float-bottom"
          style={{
            transform: `translate3d(${mousePos.x * 28}px, ${mousePos.y * 28}px, 0) rotate(${mousePos.y * -15}deg)`,
          }}
        />

        <div className="tfd-hero-layout">
          {/* Left Column: Oversized Editorial Typography & CTAs */}
          <div>
            <div className="section-kicker">
              <Sparkles size={15} /> {BRAND_CONFIG.location.neighbourhood.toUpperCase()} • HOMEMADE CAKE ATELIER
            </div>

            <h1 className="tfd-hero-title">
              THE FRENZY{' '}
              <span
                style={{
                  color: 'var(--butter)',
                  display: 'inline-block',
                  transform: 'rotate(-1.5deg)',
                }}
              >
                DELIGHTS
              </span>
            </h1>

            <p className="handwritten-note" style={{ marginBottom: '0.95rem' }}>
              “A Little Frenzy. A Lot of Delight — Bliss in Every Bite.”
            </p>

            <p
              style={{
                fontSize: 'var(--text-body)',
                lineHeight: 1.66,
                color: 'rgba(244, 235, 221, 0.86)',
                maxWidth: '540px',
                marginBottom: '1.65rem',
              }}
            >
              Handcrafted custom celebration cakes, fairy-lit engagement tiers, decadent dark-chocolate
              truffle hearts, and signature crinkle-top fudge brownies baked fresh to order in{' '}
              <strong style={{ color: 'var(--butter)' }}>Thirumangalam</strong>.
            </p>

            {/* Mobile-First Dedicated Portrait Hero Feature Card (visible on <= 640px) */}
            <div
              className="tfd-mobile-hero-portrait"
              onClick={() => setSelectedProduct(BAKERY_PRODUCTS[0])}
            >
              <img
                src={BAKERY_PRODUCTS[0].images.card480}
                srcSet={BAKERY_PRODUCTS[0].images.cardSrcSet}
                sizes="(max-width: 640px) 92vw, 480px"
                alt={BAKERY_PRODUCTS[0].name}
                fetchPriority="high"
                decoding="async"
                className="tfd-mobile-hero-img"
              />
              <div className="tfd-mobile-hero-caption">
                <div>
                  <span className="section-kicker" style={{ marginBottom: 2, fontSize: '0.75rem' }}>
                    SIGNATURE CENTERPIECE • TAP TO INSPECT
                  </span>
                  <div
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.25rem',
                      color: 'var(--cream)',
                    }}
                  >
                    {BAKERY_PRODUCTS[0].shortTitle}
                  </div>
                </div>
                <span className="tfd-mobile-hero-pill">
                  <Eye size={14} /> VIEW
                </span>
              </div>
            </div>

            <div className="tfd-hero-cta-group">
              <button
                type="button"
                className="btn-frenzy-primary"
                onClick={() => navigate('/creations')}
              >
                EXPLORE OUR CREATIONS <ArrowRight size={17} />
              </button>
              <button
                type="button"
                className="btn-frenzy-outline"
                onClick={() => navigate('/contact')}
              >
                <Send size={16} /> ENQUIRE FOR YOUR DATE
              </button>
            </div>

            {/* Verified Brand Badges Row */}
            <div className="tfd-hero-badges-row">
              <div>
                <div className="tfd-hero-badge-title">100% HOMEMADE</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(244,235,221,0.68)' }}>
                  Fresh small-batch baking
                </div>
              </div>
              <div>
                <div className="tfd-hero-badge-title">3–4 DAYS NOTICE</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(244,235,221,0.68)' }}>
                  Bespoke theme &amp; tier crafting
                </div>
              </div>
              <div>
                <div className="tfd-hero-badge-title">THIRUMANGALAM</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(244,235,221,0.68)' }}>
                  Direct DM &amp; WhatsApp enquiries
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Reference-Style 3x3 Interactive Showcase Mosaic */}
          <div
            style={{
              position: 'relative',
              transform: `perspective(1000px) rotateY(${mousePos.x * 5}deg) rotateX(${mousePos.y * -5}deg)`,
              transition: 'transform 0.25s ease-out',
            }}
          >
            <div className="tfd-hero-mosaic-grid">
              {HERO_GRID_CELLS.map((cell, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    soundEngine.playCardFlip();
                    setSelectedProduct(cell.prod);
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Inspect ${cell.prod.name}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setSelectedProduct(cell.prod);
                  }}
                  style={{
                    position: 'relative',
                    aspectRatio: '1 / 1',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: cell.isCenter
                      ? '2px solid var(--butter)'
                      : '1px solid rgba(244, 235, 221, 0.15)',
                  }}
                >
                  <img
                    src={cell.prod.images.card480}
                    srcSet={cell.prod.images.cardSrcSet}
                    sizes="(max-width: 640px) 30vw, 220px"
                    alt={cell.prod.name}
                    fetchPriority={cell.isCenter ? 'high' : 'auto'}
                    decoding="async"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(180deg, rgba(18,12,10,0.1) 0%, rgba(18,12,10,0.82) 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: '0.45rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(0.82rem, 1.8vw, 1.4rem)',
                        letterSpacing: '0.06em',
                        color: cell.isCenter ? 'var(--butter)' : 'var(--cream)',
                        lineHeight: 1,
                      }}
                    >
                      {cell.word}
                    </span>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        color: 'rgba(244,235,221,0.82)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {cell.prod.shortTitle}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="tfd-hero-mosaic-note">
              Tap or click any frame to inspect close-up ↗
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 02: SCROLL-SCRUBBED MEMORY PHRASE (#hero-memoria)
          ===================================================================== */}
      <section
        style={{
          padding: 'clamp(3.8rem, 8vw, 6.5rem) 1.25rem',
          background: '#120c0a',
          textAlign: 'center',
          borderTop: '1px solid rgba(217, 185, 91, 0.15)',
          borderBottom: '1px solid rgba(217, 185, 91, 0.15)',
        }}
      >
        <div ref={memoryTextRef} style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <span className="section-kicker">THE FRENZY MANIFESTO</span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.1rem, 6.2vw, 5.6rem)',
              lineHeight: 0.98,
              letterSpacing: '0.03em',
              color: 'var(--vanilla)',
              textTransform: 'uppercase',
            }}
          >
            BEFORE THEY EVEN READ THE MENU,{' '}
            <span style={{ color: 'var(--butter)' }}>THEY SHOULD CRAVE THE CRAFT.</span>
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.15rem, 2.2vw, 1.8rem)',
              color: 'var(--peach)',
              marginTop: '1rem',
            }}
          >
            Every tier, every chocolate rosette, and every crinkle-top brownie is photographed straight
            from our Thirumangalam kitchen table.
          </p>
        </div>
      </section>

      {/* =====================================================================
          SECTION 03: INTERACTIVE PHYSICS CARD DECK (mix-card3d / itl-deck)
          ===================================================================== */}
      <section
        style={{
          padding: 'clamp(3.8rem, 8vw, 6rem) clamp(1rem, 4vw, 1.5rem)',
          background:
            'radial-gradient(circle at 50% 40%, #2d1e19 0%, #17100e 85%)',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.6rem' }}>
            <span className="section-kicker">
              <Layers size={15} /> INTERACTIVE TASTING DECK
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-h1)',
                letterSpacing: '0.04em',
                color: 'var(--cream)',
              }}
            >
              FLIP &amp; EXPLORE OUR SIGNATURE CARDS
            </h2>
            <p className="handwritten-note" style={{ marginTop: '0.35rem' }}>
              Tap to flip any recipe card for baker’s notes, or open in full studio view
            </p>
          </div>

          <div className="tfd-deck-grid">
            {BAKERY_PRODUCTS.map((prod, idx) => {
              const isFlipped = !!flippedCards[prod.id];
              const offset = cardOffsets[prod.id] || { x: 0, y: 0 };
              const restTilt = (idx % 2 === 0 ? -1 : 1) * (0.9 + (idx % 3) * 0.45);

              return (
                <div
                  key={prod.id}
                  onMouseDown={(e) => {
                    if (window.innerWidth <= 900) return;
                    if ((e.target as HTMLElement).closest('button')) return;
                    setDraggingCard({
                      id: prod.id,
                      startX: e.clientX,
                      startY: e.clientY,
                      origX: offset.x,
                      origY: offset.y,
                    });
                  }}
                  style={{
                    transform: `translate3d(${offset.x}px, ${offset.y}px, 0) rotate(${restTilt}deg)`,
                    cursor: draggingCard?.id === prod.id ? 'grabbing' : 'grab',
                    userSelect: 'none',
                    zIndex: draggingCard?.id === prod.id ? 30 : 1,
                    transition:
                      draggingCard?.id === prod.id ? 'none' : 'transform 0.35s var(--ease-editorial)',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '455px',
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.68s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                  >
                    {/* FRONT OF CARD: Polaroid Editorial Photo */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backfaceVisibility: 'hidden',
                        background: 'var(--paper-polaroid)',
                        color: 'var(--espresso-deep)',
                        borderRadius: '14px',
                        padding: '0.85rem 0.85rem 1.1rem',
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.55)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        border: '2px solid rgba(217, 185, 91, 0.5)',
                      }}
                    >
                      <div
                        onClick={() => setSelectedProduct(prod)}
                        style={{
                          position: 'relative',
                          height: '295px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          background: '#1a110e',
                          cursor: 'pointer',
                        }}
                      >
                        <img
                          src={prod.images.card480}
                          srcSet={prod.images.cardSrcSet}
                          sizes="(max-width: 640px) 90vw, (max-width: 1120px) 45vw, 380px"
                          alt={prod.name}
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            background: 'rgba(24, 17, 15, 0.85)',
                            color: 'var(--butter)',
                            fontFamily: 'var(--font-condensed)',
                            letterSpacing: '0.14em',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '999px',
                            fontSize: '0.8rem',
                          }}
                        >
                          NO. {prod.number} • {prod.category}
                        </span>
                      </div>

                      <div>
                        <div
                          style={{
                            fontFamily: 'var(--font-hand)',
                            fontSize: '1.35rem',
                            fontWeight: 700,
                            color: 'var(--chocolate)',
                            lineHeight: 1.15,
                          }}
                        >
                          {prod.shortTitle}
                        </div>
                        <div
                          style={{
                            fontSize: '0.8rem',
                            color: '#5c4038',
                            marginTop: '0.15rem',
                          }}
                        >
                          {prod.occasion}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                        <button
                          type="button"
                          onClick={() => toggleCardFlip(prod.id)}
                          style={{
                            flex: 1,
                            minHeight: '44px',
                            padding: '0.48rem',
                            borderRadius: '8px',
                            border: '1px solid var(--chocolate)',
                            background: 'transparent',
                            color: 'var(--chocolate)',
                            fontFamily: 'var(--font-condensed)',
                            letterSpacing: '0.12em',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          <RotateCw size={14} /> FLIP RECIPE CARD
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedProduct(prod)}
                          style={{
                            minHeight: '44px',
                            padding: '0.48rem 0.95rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'var(--chocolate)',
                            color: 'var(--cream)',
                            fontFamily: 'var(--font-condensed)',
                            letterSpacing: '0.12em',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          <Eye size={14} /> VIEW
                        </button>
                      </div>
                    </div>

                    {/* BACK OF CARD: Gold Foil Atelier Tasting Notes */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        background:
                          'linear-gradient(135deg, #2b1b16 0%, #18100d 55%, #3a241c 100%)',
                        color: 'var(--cream)',
                        borderRadius: '14px',
                        padding: '1.35rem',
                        border: '2px solid var(--butter)',
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <img
                          src={BRAND_CONFIG.logos.cupcakeCircle}
                          alt="Brand Seal"
                          width={42}
                          height={42}
                          style={{ width: 42, height: 42, borderRadius: '50%' }}
                        />
                        <span
                          style={{
                            fontFamily: 'var(--font-condensed)',
                            letterSpacing: '0.2em',
                            color: 'var(--butter)',
                            fontSize: '0.88rem',
                          }}
                        >
                          TASTING CARD #{prod.number}
                        </span>
                      </div>

                      <div>
                        <h3
                          style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '1.4rem',
                            color: 'var(--butter)',
                            marginBottom: '0.45rem',
                          }}
                        >
                          {prod.name}
                        </h3>
                        <p
                          style={{
                            fontSize: '0.88rem',
                            lineHeight: 1.52,
                            color: 'rgba(244, 235, 221, 0.85)',
                            marginBottom: '0.65rem',
                          }}
                        >
                          {prod.editorialDescription}
                        </p>
                        <div
                          style={{
                            fontFamily: 'var(--font-hand)',
                            fontSize: '1.18rem',
                            color: 'var(--peach)',
                          }}
                        >
                          “{prod.bakerNote}”
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => toggleCardFlip(prod.id)}
                          className="btn-frenzy-outline"
                          style={{ flex: 1, padding: '0.5rem', fontSize: '0.88rem' }}
                        >
                          <RotateCw size={14} /> FLIP FRONT
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/contact?product=${prod.slug}`)}
                          className="btn-frenzy-primary"
                          style={{ flex: 1, padding: '0.5rem', fontSize: '0.88rem' }}
                        >
                          ENQUIRE ↗
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 04: SCROLL-ASSEMBLED 3x3 PHOTO FRAGMENTS (mc-frag)
          ===================================================================== */}
      <section
        ref={fragmentSectionRef}
        style={{
          padding: 'clamp(3.8rem, 8vw, 6.5rem) clamp(1rem, 4vw, 1.5rem)',
          background: '#140d0b',
          borderTop: '1px solid rgba(217, 185, 91, 0.16)',
        }}
      >
        <div style={{ maxWidth: '1260px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.8rem' }}>
            <span className="section-kicker">RECONSTRUCTED PATISSERIE COLLAGES</span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-h1)',
                color: 'var(--vanilla)',
                letterSpacing: '0.04em',
              }}
            >
              PIECE BY PIECE, TIER BY TIER
            </h2>
            <p className="handwritten-note">
              Tap or click any mosaic to scatter or lock the 9 studio fragments
            </p>
          </div>

          <div className="tfd-three-col-grid">
            {BAKERY_PRODUCTS.slice(0, 3).map((prod) => {
              const isLocked = !!assembledFragments[prod.id];
              return (
                <div
                  key={prod.id}
                  id={`frag-box-${prod.id}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.15rem',
                  }}
                >
                  <div
                    onClick={() => {
                      soundEngine.playCardFlip();
                      setAssembledFragments((prev) => ({ ...prev, [prod.id]: !prev[prod.id] }));
                    }}
                    title="Tap to toggle fragment scatter / assembly"
                    style={{
                      width: '100%',
                      maxWidth: '340px',
                      aspectRatio: '4 / 5',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gridTemplateRows: 'repeat(3, 1fr)',
                      gap: isLocked ? '2px' : '6px',
                      padding: '8px',
                      background: 'var(--paper-polaroid)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      boxShadow: '0 24px 60px rgba(0,0,0,0.65)',
                      transition: 'gap 0.6s var(--ease-editorial)',
                    }}
                  >
                    {FRAGMENT_SCATTER.map((sc, cellIdx) => {
                      const col = cellIdx % 3;
                      const row = Math.floor(cellIdx / 3);
                      const bgPosX = col * 50;
                      const bgPosY = row * 50;

                      return (
                        <div
                          key={cellIdx}
                          style={{
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url(${prod.images.card480})`,
                            backgroundSize: '300% 300%',
                            backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                            borderRadius: isLocked ? '2px' : '5px',
                            transform: isLocked
                              ? 'translate3d(0,0,0) rotate(0deg) scale(1)'
                              : `translate3d(${sc.x}px, ${sc.y}px, 0) rotate(${sc.r}deg) scale(0.92)`,
                            transition: `transform 0.72s cubic-bezier(0.34, 1.56, 0.64, 1) ${cellIdx * 0.03}s`,
                            boxShadow: isLocked ? 'none' : '0 6px 16px rgba(0,0,0,0.42)',
                          }}
                        />
                      );
                    })}
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <h3
                      style={{
                        fontFamily: 'var(--font-condensed)',
                        fontSize: '1.55rem',
                        letterSpacing: '0.1em',
                        color: 'var(--butter)',
                      }}
                    >
                      {prod.shortTitle}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.88rem',
                        color: 'rgba(244,235,221,0.75)',
                        maxWidth: '310px',
                        margin: '0.25rem auto 0.85rem',
                      }}
                    >
                      {prod.scrapbookCaption}
                    </p>
                    <button
                      type="button"
                      className="btn-frenzy-outline"
                      style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
                      onClick={() => setSelectedProduct(prod)}
                    >
                      INSPECT CREATION ↗
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 05: 3-MODEL ARCHED PATISSERIE WINDOWS (ventanas-mosaico)
          ===================================================================== */}
      <section
        style={{
          padding: 'clamp(3.8rem, 8vw, 6.5rem) clamp(1rem, 4vw, 1.5rem)',
          background: 'linear-gradient(180deg, #1d1411 0%, #2b1d18 100%)',
          borderTop: '1px solid rgba(217, 185, 91, 0.2)',
        }}
      >
        <div style={{ maxWidth: '1260px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.8rem' }}>
            <span className="section-kicker">PATISSERIE DISPLAY WINDOWS</span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-h1)',
                color: 'var(--cream)',
                letterSpacing: '0.04em',
              }}
            >
              OPEN THE OVENS &amp; ATELIER SHUTTERS
            </h2>
            <p className="handwritten-note">
              Tap each arched patisserie window to open its Venetian blind, roll-up shade, or hinged wooden shutters
            </p>
          </div>

          <div className="tfd-three-col-grid">
            {[
              {
                winIdx: 0,
                typeLabel: 'MODEL 01 • VENETIAN CELOSÍA BLIND',
                mechanism: 'celosia',
                prod: BAKERY_PRODUCTS[4],
              },
              {
                winIdx: 1,
                typeLabel: 'MODEL 02 • ROLL-UP PERSIANA SHADE',
                mechanism: 'persiana',
                prod: BAKERY_PRODUCTS[3],
              },
              {
                winIdx: 2,
                typeLabel: 'MODEL 03 • HINGED WOODEN POSTIGOS',
                mechanism: 'postigos',
                prod: BAKERY_PRODUCTS[5],
              },
            ].map(({ winIdx, typeLabel, mechanism, prod }) => {
              const isOpen = !!openWindows[winIdx];
              return (
                <div
                  key={winIdx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <div
                    onClick={() => toggleWindow(winIdx)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${isOpen ? 'Close' : 'Open'} ${typeLabel} to view ${prod.shortTitle}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') toggleWindow(winIdx);
                    }}
                    style={{
                      position: 'relative',
                      width: '100%',
                      maxWidth: '340px',
                      height: 'clamp(360px, 75vw, 430px)',
                      borderRadius: '175px 175px 14px 14px',
                      overflow: 'hidden',
                      border: '6px solid #593b2d',
                      boxShadow:
                        'inset 0 0 30px rgba(0,0,0,0.8), 0 22px 50px rgba(0,0,0,0.65)',
                      cursor: 'pointer',
                      background: '#120b09',
                    }}
                  >
                    <img
                      src={prod.images.card480}
                      srcSet={prod.images.cardSrcSet}
                      sizes="(max-width: 640px) 88vw, 340px"
                      alt={prod.name}
                      loading="lazy"
                      decoding="async"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: isOpen ? 'scale(1.03)' : 'scale(0.92)',
                        filter: isOpen ? 'brightness(1)' : 'brightness(0.45)',
                        transition: 'all 0.75s var(--ease-editorial)',
                      }}
                    />

                    {mechanism === 'celosia' && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          pointerEvents: 'none',
                        }}
                      >
                        {Array.from({ length: 10 }).map((_, sIdx) => (
                          <div
                            key={sIdx}
                            style={{
                              flex: 1,
                              background:
                                'linear-gradient(180deg, #3c261e 0%, #241611 100%)',
                              borderBottom: '1.5px solid #d9b95b',
                              transformOrigin: 'top center',
                              transform: isOpen
                                ? 'rotateX(82deg) translateY(-12px)'
                                : 'rotateX(0deg)',
                              opacity: isOpen ? 0.15 : 0.96,
                              transition: `all 0.6s ease ${sIdx * 0.035}s`,
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {mechanism === 'persiana' && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'repeating-linear-gradient(180deg, #3a241b 0px, #3a241b 16px, #21140f 17px, #21140f 24px)',
                          borderBottom: '5px solid var(--butter)',
                          transform: isOpen ? 'translateY(-92%)' : 'translateY(0%)',
                          transition: 'transform 0.75s cubic-bezier(0.7, 0, 0.2, 1)',
                          pointerEvents: 'none',
                        }}
                      />
                    )}

                    {mechanism === 'postigos' && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          perspective: '900px',
                          pointerEvents: 'none',
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            background: 'linear-gradient(135deg, #42291f 0%, #241611 100%)',
                            borderRight: '2px solid var(--butter)',
                            transformOrigin: 'left center',
                            transform: isOpen ? 'rotateY(-105deg)' : 'rotateY(0deg)',
                            transition: 'transform 0.75s cubic-bezier(0.34, 1.56, 0.64, 1)',
                          }}
                        />
                        <div
                          style={{
                            flex: 1,
                            background: 'linear-gradient(225deg, #42291f 0%, #241611 100%)',
                            borderLeft: '2px solid var(--butter)',
                            transformOrigin: 'right center',
                            transform: isOpen ? 'rotateY(105deg)' : 'rotateY(0deg)',
                            transition: 'transform 0.75s cubic-bezier(0.34, 1.56, 0.64, 1)',
                          }}
                        />
                      </div>
                    )}

                    {!isOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '1.25rem',
                          textAlign: 'center',
                          pointerEvents: 'none',
                        }}
                      >
                        <span
                          style={{
                            background: 'rgba(24, 17, 15, 0.9)',
                            border: '1px solid var(--butter)',
                            color: 'var(--butter)',
                            padding: '0.55rem 1.1rem',
                            borderRadius: '999px',
                            fontFamily: 'var(--font-condensed)',
                            letterSpacing: '0.16em',
                            fontSize: '0.92rem',
                          }}
                        >
                          TAP TO OPEN WINDOW
                        </span>
                      </div>
                    )}
                  </div>

                  <span
                    style={{
                      fontFamily: 'var(--font-condensed)',
                      letterSpacing: '0.16em',
                      color: 'var(--butter)',
                      fontSize: '0.88rem',
                      marginTop: '0.95rem',
                    }}
                  >
                    {typeLabel}
                  </span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.45rem',
                      color: 'var(--cream)',
                      marginTop: '0.15rem',
                    }}
                  >
                    {prod.shortTitle}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(prod)}
                    style={{
                      marginTop: '0.4rem',
                      minHeight: '44px',
                      padding: '0.35rem 0.75rem',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--peach)',
                      fontFamily: 'var(--font-condensed)',
                      letterSpacing: '0.14em',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    VIEW FULL CREATION DETAILS ↗
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 06: 3D PERSPECTIVE TYPOGRAPHY ROOM BRIDGE (puente-wear)
          ===================================================================== */}
      <section
        style={{
          position: 'relative',
          minHeight: '480px',
          padding: '3.5rem 1rem',
          background: '#0d0807',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '850px',
          borderTop: '1px solid rgba(217, 185, 91, 0.25)',
          borderBottom: '1px solid rgba(217, 185, 91, 0.25)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '-20%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            opacity: 0.14,
            transform: 'rotate(-6deg) translateZ(-120px)',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
          aria-hidden="true"
        >
          {[0, 1, 2, 3].map((row) => (
            <div
              key={row}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.4rem, 7vw, 6rem)',
                whiteSpace: 'nowrap',
                color: row % 2 === 0 ? 'var(--butter)' : 'var(--vanilla)',
                animation: `tfdMarquee ${22 + row * 4}s linear infinite ${
                  row % 2 === 0 ? '' : 'reverse'
                }`,
              }}
            >
              THE FRENZY DELIGHTS • BLISS IN EVERY BITE • CUSTOM CELEBRATION CAKES • CRINKLE FUDGE
              BROWNIES • THIRUMANGALAM ATELIER •&nbsp;
            </div>
          ))}
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 3,
            textAlign: 'center',
            padding: '1rem',
            maxWidth: '680px',
            width: '100%',
          }}
        >
          <img
            src={BAKERY_PRODUCTS[0].images.cutout300}
            srcSet={BAKERY_PRODUCTS[0].images.cutoutSrcSet}
            sizes="150px"
            alt="Signature Cake Cutout"
            loading="lazy"
            decoding="async"
            style={{
              width: 'clamp(130px, 32vw, 170px)',
              height: 'clamp(130px, 32vw, 170px)',
              margin: '0 auto 1rem',
              filter: 'drop-shadow(0 16px 35px rgba(217, 185, 91, 0.35))',
              animation: 'tfdFloatSlow 5s ease-in-out infinite',
            }}
          />
          <span className="section-kicker">NEXT EXPERIENCE • INTERACTIVE 3D MENU</span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.1rem, 6vw, 4.8rem)',
              lineHeight: 0.96,
              color: 'var(--cream)',
              marginBottom: '1.25rem',
            }}
          >
            STEP INTO THE SIGNATURE DELIGHTS CAROUSEL
          </h2>
          <button
            type="button"
            className="btn-frenzy-primary"
            onClick={() => navigate('/menu')}
          >
            ENTER THE 3D MENU EXPERIENCE <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* =====================================================================
          SECTION 07: INSTAGRAM SHOWCASE (@thefrenzydelights)
          ===================================================================== */}
      <section style={{ padding: 'clamp(3.8rem, 8vw, 6rem) clamp(1rem, 4vw, 1.5rem)', background: '#17100e' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: '1.25rem',
              marginBottom: '2.2rem',
            }}
          >
            <div>
              <span className="section-kicker">
                <Instagram size={15} /> OFFICIAL INSTAGRAM ARCHIVE
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-h2)',
                  color: 'var(--vanilla)',
                  letterSpacing: '0.03em',
                }}
              >
                {BRAND_CONFIG.contact.instagramHandle.toUpperCase()}
              </h2>
            </div>
            <a
              href={BRAND_CONFIG.contact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-frenzy-outline"
            >
              <Instagram size={16} /> FOLLOW &amp; DM ON INSTAGRAM ↗
            </a>
          </div>

          <div className="tfd-insta-grid">
            {BAKERY_PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                onClick={() => setSelectedProduct(prod)}
                style={{
                  position: 'relative',
                  aspectRatio: '1 / 1',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid rgba(217, 185, 91, 0.25)',
                }}
              >
                <img
                  src={prod.images.insta400}
                  srcSet={prod.images.instaSrcSet}
                  sizes="(max-width: 640px) 46vw, (max-width: 1120px) 30vw, 200px"
                  alt={prod.name}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.45s ease',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductModal
        product={selectedProduct}
        allProducts={BAKERY_PRODUCTS}
        onClose={() => setSelectedProduct(null)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <style>{`
        .tfd-hero-section {
          min-height: 100vh;
          padding: clamp(5.8rem, 10vw, 7.8rem) clamp(1rem, 4vw, 2rem) clamp(3.5rem, 6vw, 4.5rem);
          position: relative;
          background: radial-gradient(circle at 72% 28%, rgba(217, 123, 41, 0.2) 0%, rgba(41, 32, 29, 0.45) 45%, #160f0d 90%);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .tfd-hero-title {
          font-family: var(--font-display);
          font-size: clamp(2.65rem, 8.2vw, 6.8rem);
          line-height: 0.92;
          letter-spacing: 0.03em;
          color: var(--vanilla);
          text-transform: uppercase;
          margin-bottom: 0.75rem;
          max-width: 100%;
          overflow-wrap: break-word;
        }
        .tfd-hero-float-decor {
          position: absolute;
          pointer-events: none;
          transition: transform 0.2s ease-out;
        }
        .tfd-hero-float-top {
          top: 13%;
          right: 4%;
          width: 150px;
          height: 150px;
          opacity: 0.28;
        }
        .tfd-hero-float-bottom {
          bottom: 9%;
          left: 3%;
          width: 140px;
          height: 140px;
          opacity: 0.24;
        }
        .tfd-mobile-hero-portrait {
          display: none;
        }
        .tfd-hero-cta-group {
          display: flex;
          flex-wrap: wrap;
          gap: 0.85rem;
          align-items: center;
        }
        .tfd-hero-badges-row {
          display: flex;
          gap: 1.4rem;
          margin-top: 2.2rem;
          padding-top: 1.35rem;
          border-top: 1px solid rgba(244, 235, 221, 0.12);
          flex-wrap: wrap;
        }
        .tfd-hero-badge-title {
          font-family: var(--font-condensed);
          font-size: 1.45rem;
          color: var(--butter);
          letter-spacing: 0.08em;
        }
        .tfd-hero-mosaic-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.6rem;
          padding: 0.75rem;
          background: rgba(244, 235, 221, 0.05);
          border: 1px solid rgba(217, 185, 91, 0.35);
          border-radius: 18px;
          box-shadow: 0 28px 75px rgba(0, 0, 0, 0.68);
        }
        .tfd-hero-mosaic-note {
          position: absolute;
          bottom: -16px;
          right: 16px;
          background: var(--paper-polaroid);
          color: var(--espresso-deep);
          padding: 0.4rem 1rem;
          border-radius: 6px;
          font-family: var(--font-hand);
          font-size: 1.2rem;
          font-weight: 700;
          transform: rotate(-2deg);
          box-shadow: 0 10px 25px rgba(0,0,0,0.45);
          border: 1px solid var(--butter);
        }
        @keyframes tfdMarquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-45%); }
        }
        @keyframes tfdFloatSlow {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }
        @media (max-width: 768px) {
          .tfd-hero-float-decor {
            display: none;
          }
        }
        @media (max-width: 640px) {
          .tfd-mobile-hero-portrait {
            display: block;
            position: relative;
            border-radius: 16px;
            overflow: hidden;
            border: 2px solid var(--butter);
            margin-bottom: 1.4rem;
            box-shadow: 0 18px 45px rgba(0, 0, 0, 0.65);
            cursor: pointer;
            background: #120b09;
          }
          .tfd-mobile-hero-img {
            width: 100%;
            aspect-ratio: 4 / 5;
            object-fit: cover;
          }
          .tfd-mobile-hero-caption {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 1rem;
            background: linear-gradient(180deg, transparent 0%, rgba(16, 10, 8, 0.94) 100%);
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            gap: 0.75rem;
          }
          .tfd-mobile-hero-pill {
            background: var(--butter);
            color: var(--espresso-deep);
            font-family: var(--font-condensed);
            font-size: 0.85rem;
            letter-spacing: 0.14em;
            font-weight: 700;
            padding: 0.45rem 0.85rem;
            border-radius: 999px;
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
            flex-shrink: 0;
          }
          .tfd-hero-cta-group {
            flex-direction: column;
            align-items: stretch;
          }
          .tfd-hero-cta-group .btn-frenzy-primary,
          .tfd-hero-cta-group .btn-frenzy-outline {
            width: 100%;
          }
          .tfd-hero-mosaic-grid {
            gap: 0.42rem;
            padding: 0.5rem;
          }
          .tfd-hero-mosaic-note {
            position: static;
            margin-top: 0.85rem;
            text-align: center;
            transform: none;
          }
        }
      `}</style>
    </main>
  );
};
