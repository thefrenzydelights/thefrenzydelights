import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, Sparkles, Calendar, Send } from 'lucide-react';
import { BakeryProduct } from '../data/products';
import { soundEngine } from '../utils/soundEngine';

interface ProductModalProps {
  product: BakeryProduct | null;
  allProducts: BakeryProduct[];
  onClose: () => void;
  onSelectProduct: (prod: BakeryProduct) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  allProducts,
  onClose,
  onSelectProduct,
}) => {
  const [activeView, setActiveView] = useState<'detail' | 'card' | 'instagram' | 'cutout'>('detail');
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setActiveView('detail');
  }, [product?.id]);

  useEffect(() => {
    if (!product) {
      document.body.classList.remove('tfd-scroll-locked');
      return;
    }
    document.body.classList.add('tfd-scroll-locked');

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.classList.remove('tfd-scroll-locked');
      window.removeEventListener('keydown', handleKey);
    };
  }, [product, allProducts]);

  if (!product) return null;

  const currentIndex = allProducts.findIndex((p) => p.id === product.id);

  const handlePrev = () => {
    soundEngine.playCardFlip();
    const prevIdx = (currentIndex - 1 + allProducts.length) % allProducts.length;
    onSelectProduct(allProducts[prevIdx]);
  };

  const handleNext = () => {
    soundEngine.playCardFlip();
    const nextIdx = (currentIndex + 1) % allProducts.length;
    onSelectProduct(allProducts[nextIdx]);
  };

  const getCurrentImage = () => {
    switch (activeView) {
      case 'card':
        return product.images.card;
      case 'instagram':
        return product.images.instagram;
      case 'cutout':
        return product.images.cutout;
      default:
        return product.images.detail;
    }
  };

  return (
    <div
      className="tfd-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div
        className="tfd-modal-sheet"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Mobile Header Bar so Close Button is ALWAYS visible */}
        <div className="tfd-modal-sticky-bar">
          <span className="section-kicker" style={{ marginBottom: 0 }}>
            <Sparkles size={14} /> {product.number} / 0{allProducts.length} • {product.category}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Product Viewer"
            className="tfd-modal-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        <div className="tfd-modal-grid">
          {/* Left: High-Resolution Photograph & Aspect Switcher */}
          <div className="tfd-modal-media-col">
            <div
              className="tfd-modal-img-stage"
              style={{
                background:
                  activeView === 'cutout'
                    ? 'radial-gradient(circle, rgba(217,185,91,0.18) 0%, rgba(17,11,10,0.95) 75%)'
                    : '#0c0807',
              }}
              onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (touchStartX !== null && e.changedTouches[0]) {
                  const dx = e.changedTouches[0].clientX - touchStartX;
                  if (dx < -45) handleNext();
                  if (dx > 45) handlePrev();
                  setTouchStartX(null);
                }
              }}
            >
              <img
                src={getCurrentImage()}
                alt={product.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  transition: 'transform 0.35s ease',
                }}
              />
            </div>

            {/* Thumbnail / Framing Switcher */}
            <div className="tfd-modal-view-tabs">
              {(
                [
                  { key: 'detail', label: '16:9 Studio' },
                  { key: 'card', label: '4:5 Portrait' },
                  { key: 'instagram', label: '1:1 Square' },
                  { key: 'cutout', label: 'Medallion' },
                ] as const
              ).map((view) => (
                <button
                  key={view.key}
                  type="button"
                  onClick={() => {
                    soundEngine.playCardFlip();
                    setActiveView(view.key);
                  }}
                  style={{
                    padding: '0.5rem 0.9rem',
                    minHeight: '40px',
                    borderRadius: '999px',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-condensed)',
                    letterSpacing: '0.12em',
                    cursor: 'pointer',
                    border: '1px solid rgba(217, 185, 91, 0.35)',
                    background: activeView === view.key ? 'var(--butter)' : 'transparent',
                    color: activeView === view.key ? 'var(--espresso-deep)' : 'var(--cream)',
                    fontWeight: activeView === view.key ? 700 : 400,
                  }}
                >
                  {view.label}
                </button>
              ))}
            </div>

            {/* Prev / Next Navigation */}
            <div className="tfd-modal-nav-row">
              <button
                type="button"
                onClick={handlePrev}
                className="btn-frenzy-outline"
                style={{ padding: '0.55rem 1.1rem', fontSize: '0.9rem', minHeight: '44px' }}
              >
                <ChevronLeft size={16} /> PREV
              </button>
              <span
                style={{
                  fontFamily: 'var(--font-condensed)',
                  letterSpacing: '0.16em',
                  color: 'var(--butter)',
                  alignSelf: 'center',
                  fontSize: '0.92rem',
                }}
              >
                SWIPE OR TAP ({product.number}/0{allProducts.length})
              </span>
              <button
                type="button"
                onClick={handleNext}
                className="btn-frenzy-outline"
                style={{ padding: '0.55rem 1.1rem', fontSize: '0.9rem', minHeight: '44px' }}
              >
                NEXT <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Right: Editorial Details & Enquiry CTA */}
          <div className="tfd-modal-info-col">
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.55rem, 2.8vw, 2.45rem)',
                lineHeight: 1.14,
                color: 'var(--cream)',
              }}
            >
              {product.name}
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-hand)',
                fontSize: 'clamp(1.25rem, 2.2vw, 1.45rem)',
                color: 'var(--butter)',
                background: 'rgba(217, 185, 91, 0.08)',
                padding: '0.6rem 1rem',
                borderRadius: '10px',
                borderLeft: '3px solid var(--butter)',
              }}
            >
              “{product.bakerNote}”
            </p>

            <p style={{ fontSize: '0.96rem', lineHeight: 1.65, color: 'rgba(255, 249, 240, 0.86)' }}>
              {product.editorialDescription}
            </p>

            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-condensed)',
                  letterSpacing: '0.16em',
                  color: 'var(--peach)',
                  fontSize: '0.95rem',
                  marginBottom: '0.45rem',
                }}
              >
                SIGNATURE CRAFT DETAILS:
              </h3>
              <ul
                style={{
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  fontSize: '0.9rem',
                  color: 'rgba(244, 235, 221, 0.84)',
                }}
              >
                {product.visualHighlights.map((item, i) => (
                  <li key={i}>✦ {item}</li>
                ))}
              </ul>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                fontSize: '0.88rem',
                color: 'var(--butter)',
                marginTop: 'auto',
                paddingTop: '0.4rem',
              }}
            >
              <Calendar size={15} />
              <span>{product.leadTime} • Handcrafted in Thirumangalam</span>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
              <button
                type="button"
                className="btn-frenzy-primary"
                style={{ width: '100%' }}
                onClick={() => {
                  onClose();
                  navigate(`/contact?product=${encodeURIComponent(product.slug)}`);
                }}
              >
                <Send size={16} /> ENQUIRE ABOUT THIS CREATION
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .tfd-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 99994;
          background: rgba(14, 9, 8, 0.92);
          backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          overflow-y: auto;
        }
        .tfd-modal-sheet {
          background: linear-gradient(145deg, #261a17 0%, #17100e 100%);
          border: 1px solid rgba(217, 185, 91, 0.38);
          border-radius: 20px;
          max-width: 1160px;
          width: 100%;
          max-height: 92vh;
          overflow-y: auto;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.85);
          display: flex;
          flex-direction: column;
        }
        .tfd-modal-sticky-bar {
          position: sticky;
          top: 0;
          z-index: 10;
          background: rgba(23, 16, 14, 0.94);
          backdrop-filter: blur(12px);
          padding: 0.85rem 1.35rem;
          border-bottom: 1px solid rgba(217, 185, 91, 0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
        }
        .tfd-modal-close-btn {
          background: rgba(244, 235, 221, 0.12);
          border: 1px solid rgba(217, 185, 91, 0.45);
          color: var(--cream);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .tfd-modal-close-btn:hover {
          background: var(--butter);
          color: var(--espresso-deep);
        }
        .tfd-modal-grid {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
        }
        .tfd-modal-media-col {
          background: #110b0a;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
        }
        .tfd-modal-img-stage {
          width: 100%;
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 12px;
          border: 1px solid rgba(244, 235, 221, 0.12);
        }
        .tfd-modal-view-tabs {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .tfd-modal-nav-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-top: 1rem;
          padding-top: 0.85rem;
          border-top: 1px solid rgba(244, 235, 221, 0.1);
          gap: 0.5rem;
        }
        .tfd-modal-info-col {
          padding: 1.75rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        @media (max-width: 860px) {
          .tfd-modal-backdrop {
            padding: 0.6rem;
          }
          .tfd-modal-sheet {
            max-height: 95vh;
            border-radius: 16px;
          }
          .tfd-modal-grid {
            grid-template-columns: 1fr;
          }
          .tfd-modal-img-stage {
            height: 290px;
          }
          .tfd-modal-media-col {
            padding: 1rem;
          }
          .tfd-modal-info-col {
            padding: 1.25rem 1.15rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};
