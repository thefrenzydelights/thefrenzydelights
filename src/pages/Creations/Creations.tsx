import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Sparkles, Eye, Send, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  BAKERY_PRODUCTS,
  BakeryProduct,
  PRODUCT_CATEGORIES,
  ProductCategory,
  SCRAPBOOK_ITEMS,
} from '../../data/products';
import { CursorFallingTitle } from '../../components/CursorFallingTitle';
import { ProductModal } from '../../components/ProductModal';
import { soundEngine } from '../../utils/soundEngine';

export const Creations: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('All');
  const [selectedProduct, setSelectedProduct] = useState<BakeryProduct | null>(null);
  const [tappedItemId, setTappedItemId] = useState<string | null>(null);
  const [twinePaths, setTwinePaths] = useState<string[]>([]);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const pinRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const navigate = useNavigate();

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return SCRAPBOOK_ITEMS;
    return SCRAPBOOK_ITEMS.filter(
      (item) =>
        item.product.category === activeCategory ||
        item.product.secondaryCategories.includes(activeCategory)
    );
  }, [activeCategory]);

  // Recompute SVG red baker's twine connecting pushpins across the corkboard
  useEffect(() => {
    const computeTwine = () => {
      if (!boardRef.current) return;
      const boardRect = boardRef.current.getBoundingClientRect();
      const pts: { x: number; y: number }[] = [];

      filteredItems.forEach((item) => {
        const el = pinRefs.current[item.id];
        if (el) {
          const r = el.getBoundingClientRect();
          pts.push({
            x: r.left - boardRect.left + r.width / 2,
            y: r.top - boardRect.top + r.height / 2,
          });
        }
      });

      const paths: string[] = [];
      for (let i = 0; i < pts.length - 1; i++) {
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const midX = (p1.x + p2.x) / 2;
        const sag = Math.min(80, Math.hypot(p2.x - p1.x, p2.y - p1.y) * 0.15);
        const midY = (p1.y + p2.y) / 2 + sag;
        paths.push(
          `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(
            1
          )} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
        );
      }
      setTwinePaths(paths);
    };

    const timer = setTimeout(computeTwine, 180);
    window.addEventListener('resize', computeTwine);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', computeTwine);
    };
  }, [filteredItems]);

  // Split filtered items into 4 asymmetrical columns on desktop
  const columns = useMemo(() => {
    const cols: typeof SCRAPBOOK_ITEMS[] = [[], [], [], []];
    filteredItems.forEach((item, idx) => {
      cols[idx % 4].push(item);
    });
    return cols;
  }, [filteredItems]);

  return (
    <main style={{ minHeight: '100vh', background: '#17100e' }}>
      <CursorFallingTitle
        text="CREATIONS"
        subtitle="PAGE 02 • THE BAKER’S STUDIO CORKBOARD & SCRAPBOOK"
        lampFlicker={true}
      />

      {/* Category Filter Bar */}
      <div className="tfd-filter-bar" role="tablist" aria-label="Product Category Filter">
        {PRODUCT_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                soundEngine.playCardFlip();
                setActiveCategory(cat);
              }}
              className={`tfd-filter-pill ${isActive ? 'active' : ''}`}
            >
              {cat.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          THE STUDIO CORKBOARD (#tablero Reinterpretation)
          ===================================================================== */}
      <section className="tfd-cork-outer">
        <div ref={boardRef} className="tfd-cork-board">
          {/* SVG Red Baker's Twine Connecting Pushpins (#hiloSvg) */}
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 4,
            }}
            aria-hidden="true"
          >
            {twinePaths.map((d, idx) => (
              <g key={idx}>
                <path
                  d={d}
                  fill="none"
                  stroke="rgba(0, 0, 0, 0.2)"
                  strokeWidth="3"
                  transform="translate(2, 4)"
                />
                <path
                  d={d}
                  fill="none"
                  stroke="#B83A2D"
                  strokeWidth="2.2"
                  strokeDasharray="6 2"
                />
              </g>
            ))}
          </svg>

          {/* Top Handwritten Baker's Sticky Notes */}
          <div className="tfd-cork-sticky-header">
            <div className="tfd-sticky-yellow">
              📌 <strong>Atelier Pinboard Note:</strong> Every photograph pinned here is an authentic
              creation baked in our Thirumangalam kitchen. Tap any polaroid to preview or open full screen!
            </div>

            <div className="tfd-sticky-cream">
              ✨ Custom cake orders: Enquire <strong>3–4 days</strong> in advance via DM!
            </div>
          </div>

          {/* 4-Column (Desktop) / 2-Column (Tablet) / 1-Column (Mobile) Scrapbook Masonry */}
          <div className="tfd-cork-columns">
            {columns.map((colItems, colIdx) => (
              <div
                key={colIdx}
                className={`tfd-cork-col ${colIdx % 2 === 1 ? 'tfd-cork-col-offset' : ''}`}
              >
                {colItems.map((item, itemIdx) => {
                  const isPin =
                    item.attachment === 'pin-red' || item.attachment === 'pin-gold';
                  const isTapped = tappedItemId === item.id;

                  return (
                    <article
                      key={item.id}
                      className={`tfd-polaroid-card ${isTapped ? 'is-tapped' : ''}`}
                      onClick={() => {
                        soundEngine.playCardFlip();
                        if (window.innerWidth <= 768 && !isTapped) {
                          setTappedItemId(item.id);
                        } else {
                          setSelectedProduct(item.product);
                        }
                      }}
                      style={{
                        transform: `rotate(${item.rotation}deg)`,
                        animation: `tfdSway ${5.5 + (itemIdx % 3)}s ease-in-out infinite alternate`,
                      }}
                    >
                      {/* Pushpin or Washi Tape Attachment */}
                      <div
                        ref={(el) => {
                          pinRefs.current[item.id] = el;
                        }}
                        style={{
                          position: 'absolute',
                          top: isPin ? '-11px' : '-13px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          zIndex: 6,
                        }}
                      >
                        {isPin ? (
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background:
                                item.attachment === 'pin-red'
                                  ? 'radial-gradient(circle at 35% 35%, #ff6b5b, #9e2217 75%)'
                                  : 'radial-gradient(circle at 35% 35%, #ffe699, #b58922 75%)',
                              boxShadow:
                                '0 4px 8px rgba(0,0,0,0.45), inset 0 2px 4px rgba(255,255,255,0.6)',
                              border: '1px solid rgba(0,0,0,0.25)',
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '92px',
                              height: '26px',
                              background: 'rgba(233, 191, 164, 0.78)',
                              borderLeft: '2px dashed rgba(74, 44, 36, 0.25)',
                              borderRight: '2px dashed rgba(74, 44, 36, 0.25)',
                              transform:
                                item.attachment === 'washi-left'
                                  ? 'rotate(-8deg)'
                                  : 'rotate(5deg)',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
                            }}
                          />
                        )}
                      </div>

                      {/* Product Image */}
                      <div
                        style={{
                          position: 'relative',
                          overflow: 'hidden',
                          borderRadius: '4px',
                          background: '#1c1310',
                        }}
                      >
                        <img
                          src={item.imageSrc}
                          srcSet={item.imageSrcSet}
                          sizes="(max-width: 560px) 88vw, (max-width: 1120px) 44vw, 310px"
                          alt={item.product.name}
                          loading="lazy"
                          decoding="async"
                          className="tfd-polaroid-img"
                        />

                        {/* Desktop Hover Badge */}
                        <div className="tfd-polaroid-hover-badge">
                          <Eye size={14} /> OPEN FULL VIEWER
                        </div>
                      </div>

                      {/* Handwritten Polaroid Caption */}
                      <div style={{ marginTop: '0.85rem', color: '#29201D' }}>
                        <div
                          style={{
                            fontFamily: 'var(--font-hand)',
                            fontSize: '1.32rem',
                            fontWeight: 700,
                            lineHeight: 1.15,
                          }}
                        >
                          {item.caption}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.25rem',
                            marginTop: '0.35rem',
                            fontSize: '0.76rem',
                            fontFamily: 'var(--font-condensed)',
                            letterSpacing: '0.12em',
                            color: '#7a5244',
                          }}
                        >
                          <span>{item.product.category.toUpperCase()}</span>
                          <span>{item.product.occasion.toUpperCase()}</span>
                        </div>
                      </div>

                      {item.handwrittenNote && (
                        <div
                          style={{
                            marginTop: '0.6rem',
                            background: '#fff8d6',
                            padding: '0.4rem 0.65rem',
                            borderRadius: '4px',
                            fontFamily: 'var(--font-hand)',
                            fontSize: '1.1rem',
                            color: '#4A2C24',
                            borderLeft: '3px solid var(--butter)',
                          }}
                        >
                          ✎ {item.handwrittenNote}
                        </div>
                      )}

                      {/* Mobile Tap-to-Reveal Details & Always-Accessible Touch Buttons */}
                      {isTapped && (
                        <div
                          style={{
                            marginTop: '0.65rem',
                            padding: '0.6rem',
                            borderRadius: '6px',
                            background: 'rgba(74, 44, 36, 0.08)',
                            fontSize: '0.82rem',
                            color: '#29201D',
                            lineHeight: 1.48,
                          }}
                        >
                          {item.product.editorialDescription}
                        </div>
                      )}

                      <div className="tfd-polaroid-touch-actions">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            soundEngine.playCardFlip();
                            setTappedItemId(isTapped ? null : item.id);
                          }}
                          className="tfd-polaroid-btn-secondary"
                        >
                          <Info size={13} /> {isTapped ? 'HIDE INFO' : 'QUICK INFO'}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            soundEngine.playCardFlip();
                            setSelectedProduct(item.product);
                          }}
                          className="tfd-polaroid-btn-primary"
                        >
                          <Eye size={13} /> FULL VIEWER
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Custom Creation CTA */}
      <section
        style={{
          maxWidth: '940px',
          margin: '0 auto 4.5rem',
          padding: 'clamp(1.75rem, 5vw, 2.5rem) clamp(1.15rem, 4vw, 2rem)',
          textAlign: 'center',
          background: 'rgba(244, 235, 221, 0.04)',
          border: '1px solid rgba(217, 185, 91, 0.28)',
          borderRadius: '18px',
          width: 'calc(100% - 2rem)',
        }}
      >
        <span className="section-kicker">
          <Sparkles size={15} /> HAVE A THEME IN MIND?
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-h2)',
            color: 'var(--cream)',
            letterSpacing: '0.04em',
            marginBottom: '0.75rem',
          }}
        >
          LET’S BAKE YOUR NEXT CELEBRATION CENTERPIECE
        </h2>
        <p
          style={{
            color: 'rgba(244, 235, 221, 0.8)',
            maxWidth: '600px',
            margin: '0 auto 1.5rem',
            lineHeight: 1.6,
          }}
        >
          From first birthdays and ring ceremonies to dark-chocolate anniversary brownies, send us your
          date and theme idea 3–4 days in advance.
        </p>
        <button
          type="button"
          className="btn-frenzy-primary"
          onClick={() => navigate('/contact')}
        >
          <Send size={16} /> START CUSTOM CAKE ENQUIRY
        </button>
      </section>

      <ProductModal
        product={selectedProduct}
        allProducts={BAKERY_PRODUCTS}
        onClose={() => setSelectedProduct(null)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <style>{`
        .tfd-filter-bar {
          max-width: 1180px;
          margin: 0 auto 2rem;
          padding: 0 1rem;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.55rem;
        }
        .tfd-filter-pill {
          padding: 0.55rem 1.2rem;
          min-height: 44px;
          border-radius: 999px;
          border: 1px solid rgba(217, 185, 91, 0.45);
          background: rgba(24, 17, 15, 0.78);
          color: var(--cream);
          font-family: var(--font-condensed);
          font-size: 0.98rem;
          letter-spacing: 0.14em;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .tfd-filter-pill.active {
          background: var(--butter);
          color: var(--espresso-deep);
          font-weight: 700;
        }
        .tfd-cork-outer {
          max-width: 1420px;
          margin: 0 auto 4.5rem;
          padding: 0 1.25rem;
        }
        .tfd-cork-board {
          position: relative;
          background-image: radial-gradient(rgba(41, 32, 29, 0.12) 1px, transparent 0), url(${import.meta.env.BASE_URL}assets/images/backgrounds/kraft-cork.webp);
          background-size: 24px 24px, 420px 420px;
          background-color: #d9c3a5;
          border-radius: 22px;
          border: 12px solid #3c261d;
          box-shadow: inset 0 0 65px rgba(35, 20, 14, 0.55), 0 30px 80px rgba(0, 0, 0, 0.75);
          padding: 3.2rem 2rem 4rem;
          overflow: hidden;
        }
        .tfd-cork-sticky-header {
          position: relative;
          z-index: 5;
          max-width: 980px;
          margin: 0 auto 2.5rem;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 1.15rem;
        }
        .tfd-sticky-yellow {
          background: #FFF3B0;
          color: #2c1d18;
          padding: 0.95rem 1.3rem;
          border-radius: 4px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.25);
          transform: rotate(-1.5deg);
          font-family: var(--font-hand);
          font-size: 1.3rem;
          max-width: 460px;
          border-top: 14px solid rgba(217, 185, 91, 0.45);
        }
        .tfd-sticky-cream {
          background: #FBF7F0;
          color: #2c1d18;
          padding: 0.8rem 1.25rem;
          border-radius: 6px;
          box-shadow: 0 10px 24px rgba(0,0,0,0.22);
          transform: rotate(1.4deg);
          font-family: var(--font-hand);
          font-size: 1.25rem;
          border-left: 4px solid #B83A2D;
        }
        .tfd-cork-columns {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2.1rem;
          position: relative;
          z-index: 3;
        }
        .tfd-cork-col {
          display: flex;
          flex-direction: column;
          gap: 2.4rem;
        }
        .tfd-cork-col-offset {
          margin-top: 2.2rem;
        }
        .tfd-polaroid-card {
          position: relative;
          background: var(--paper-polaroid);
          padding: 0.85rem 0.85rem 1.15rem;
          border-radius: 6px;
          box-shadow: 0 16px 36px rgba(28, 17, 12, 0.36);
          cursor: pointer;
          z-index: 3;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease;
        }
        @media (hover: hover) {
          .tfd-polaroid-card:hover {
            transform: scale(1.04) rotate(0deg) !important;
            box-shadow: 0 26px 55px rgba(18, 10, 7, 0.58) !important;
            z-index: 15 !important;
            animation-play-state: paused !important;
          }
          .tfd-polaroid-card:hover .tfd-polaroid-img {
            transform: scale(1.05);
          }
          .tfd-polaroid-card:hover .tfd-polaroid-hover-badge {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .tfd-polaroid-img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.45s var(--ease-editorial);
        }
        .tfd-polaroid-hover-badge {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(24, 17, 15, 0.88);
          color: var(--butter);
          padding: 0.35rem 0.75rem;
          border-radius: 999px;
          font-family: var(--font-condensed);
          font-size: 0.8rem;
          letter-spacing: 0.14em;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          opacity: 0;
          transform: translateY(6px);
          transition: all 0.25s ease;
        }
        .tfd-polaroid-touch-actions {
          display: flex;
          gap: 0.45rem;
          margin-top: 0.75rem;
        }
        .tfd-polaroid-btn-secondary {
          flex: 1;
          min-height: 40px;
          border-radius: 6px;
          border: 1px solid rgba(74, 44, 36, 0.35);
          background: transparent;
          color: #4A2C24;
          font-family: var(--font-condensed);
          font-size: 0.82rem;
          letter-spacing: 0.12em;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
        }
        .tfd-polaroid-btn-primary {
          flex: 1;
          min-height: 40px;
          border-radius: 6px;
          border: none;
          background: #4A2C24;
          color: var(--cream);
          font-family: var(--font-condensed);
          font-size: 0.82rem;
          letter-spacing: 0.12em;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
        }
        @keyframes tfdSway {
          0% { margin-left: -1.5px; }
          100% { margin-left: 1.5px; }
        }
        @media (max-width: 1120px) {
          .tfd-cork-columns {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .tfd-cork-outer {
            padding: 0 0.75rem;
          }
          .tfd-cork-board {
            border-width: 6px;
            border-radius: 16px;
            padding: 1.6rem 0.9rem 2.2rem;
          }
          .tfd-cork-columns {
            grid-template-columns: 1fr;
            gap: 1.8rem;
          }
          .tfd-cork-col {
            gap: 1.8rem;
          }
          .tfd-cork-col-offset {
            margin-top: 0;
          }
          .tfd-polaroid-btn-secondary,
          .tfd-polaroid-btn-primary {
            min-height: 44px;
            font-size: 0.88rem;
          }
        }
      `}</style>
    </main>
  );
};
