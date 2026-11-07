import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Send,
  Eye,
  Calendar,
  CheckCircle2,
  MoveHorizontal,
} from 'lucide-react';
import { BAKERY_PRODUCTS, BakeryProduct } from '../../data/products';
import { CursorFallingTitle } from '../../components/CursorFallingTitle';
import { ProductModal } from '../../components/ProductModal';
import { soundEngine } from '../../utils/soundEngine';

export const Menu: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<BakeryProduct | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const webglContainerRef = useRef<HTMLDivElement | null>(null);
  const snapStripRef = useRef<HTMLDivElement | null>(null);
  const activeIdxRef = useRef<number>(0);
  const navigate = useNavigate();

  activeIdxRef.current = activeIndex;
  const currentProduct = BAKERY_PRODUCTS[activeIndex];

  // Scroll active card into view in the horizontal snap carousel when activeIndex changes
  useEffect(() => {
    const strip = snapStripRef.current;
    if (!strip) return;
    const cardEl = strip.children[activeIndex] as HTMLElement | undefined;
    if (cardEl) {
      const targetLeft =
        cardEl.offsetLeft - strip.clientWidth / 2 + cardEl.clientWidth / 2;
      strip.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
    }
  }, [activeIndex]);

  // Three.js WebGL Interactive Hanging Bakery Cloth Banner with Mobile GPU & Visibility Optimization
  useEffect(() => {
    const container = webglContainerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth <= 768;
    const width = container.clientWidth || 320;
    const height = container.clientHeight || (isMobile ? 360 : 500);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglSupported(false);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.35);

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xfff4e0, 1.38);
    scene.add(ambient);

    const spotLight = new THREE.PointLight(0xffcf70, 2.1, 15);
    spotLight.position.set(2.2, 2.8, 3.5);
    scene.add(spotLight);

    // Top Bakery Brass Rod
    const rodGeo = new THREE.CylinderGeometry(0.022, 0.022, 4.4, 12);
    rodGeo.rotateZ(Math.PI / 2);
    const rodMat = new THREE.MeshStandardMaterial({
      color: 0xd9b95b,
      metalness: 0.75,
      roughness: 0.25,
    });
    const rodMesh = new THREE.Mesh(rodGeo, rodMat);
    rodMesh.position.set(0, 1.92, 0);
    scene.add(rodMesh);

    // Two 3D Brass Clips
    const clipGeo = new THREE.BoxGeometry(0.11, 0.28, 0.12);
    const clipMat = new THREE.MeshStandardMaterial({
      color: 0xb8862d,
      metalness: 0.6,
      roughness: 0.35,
    });
    const leftClip = new THREE.Mesh(clipGeo, clipMat);
    leftClip.position.set(-1.12, 1.85, 0.06);
    const rightClip = new THREE.Mesh(clipGeo, clipMat);
    rightClip.position.set(1.12, 1.85, 0.06);
    scene.add(leftClip, rightClip);

    // Subdivided Cloth Geometry (optimized polygon count on mobile)
    const clothW = 2.65;
    const clothH = 3.32;
    const segW = isMobile ? 16 : 26;
    const segH = isMobile ? 22 : 34;
    const clothGeo = new THREE.PlaneGeometry(clothW, clothH, segW, segH);
    const basePositions = clothGeo.attributes.position.array.slice() as Float32Array;

    // Load responsive textures (480w on mobile, full card on desktop)
    const loader = new THREE.TextureLoader();
    const textures = BAKERY_PRODUCTS.map((p) => {
      const tex = loader.load(isMobile ? p.images.card480 : p.images.card);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    });

    const clothMat = new THREE.MeshStandardMaterial({
      map: textures[activeIdxRef.current],
      side: THREE.DoubleSide,
      roughness: 0.55,
      metalness: 0.05,
    });

    const clothMesh = new THREE.Mesh(clothGeo, clothMat);
    clothMesh.position.set(0, 0.12, 0);
    scene.add(clothMesh);

    // Floating Golden Sugar Particles (35 on mobile, 70 on desktop)
    const particleCount = isMobile ? 35 : 70;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 6.2;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 5.2;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 2.4 - 0.3;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xf2cf66,
      size: 0.055,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    const mouse = { x: 0, y: 0, active: false };
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouse.active = true;
    };
    const handlePointerLeave = () => {
      mouse.active = false;
    };

    container.addEventListener('mousemove', handlePointerMove, { passive: true });
    container.addEventListener('mouseleave', handlePointerLeave, { passive: true });

    let isVisible = true;
    let rafId = 0;
    let lastLoadedIndex = activeIdxRef.current;
    const clock = new THREE.Clock();

    const animate = () => {
      if (!isVisible) return;
      const t = clock.getElapsedTime();

      if (lastLoadedIndex !== activeIdxRef.current) {
        lastLoadedIndex = activeIdxRef.current;
        clothMat.map = textures[lastLoadedIndex];
        clothMat.needsUpdate = true;
      }

      const posAttr = clothGeo.attributes.position;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < posAttr.count; i++) {
        const bx = basePositions[i * 3];
        const by = basePositions[i * 3 + 1];
        const pinFactor = Math.max(0, (clothH / 2 - by) / clothH);

        let waveZ =
          Math.sin(t * 2.0 + bx * 1.8 + by * 1.4) * 0.11 * pinFactor +
          Math.cos(t * 1.35 - by * 2.1) * 0.06 * pinFactor;

        if (mouse.active) {
          const mxWorld = mouse.x * 1.6;
          const myWorld = mouse.y * 1.8;
          const dist = Math.hypot(bx - mxWorld, by - myWorld);
          if (dist < 0.95) {
            waveZ += (1 - dist / 0.95) * 0.26 * pinFactor;
          }
        }

        arr[i * 3] = bx + Math.sin(t * 1.5 + by) * 0.022 * pinFactor;
        arr[i * 3 + 1] = by;
        arr[i * 3 + 2] = waveZ;
      }
      posAttr.needsUpdate = true;
      clothGeo.computeVertexNormals();

      particles.rotation.y = t * 0.08;
      particles.position.y = Math.sin(t * 0.7) * 0.1;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    // Pause WebGL rendering when scrolled off-screen to save mobile battery & GPU
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          const wasVisible = isVisible;
          isVisible = entry.isIntersecting;
          if (isVisible && !wasVisible) {
            clock.getDelta();
            rafId = requestAnimationFrame(animate);
          } else if (!isVisible && rafId) {
            cancelAnimationFrame(rafId);
          }
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    rafId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      const nw = container.clientWidth || 320;
      const nh = container.clientHeight || 360;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mouseleave', handlePointerLeave);
      clothGeo.dispose();
      clothMat.dispose();
      pGeo.dispose();
      pMat.dispose();
      rodGeo.dispose();
      rodMat.dispose();
      clipGeo.dispose();
      clipMat.dispose();
      textures.forEach((tex) => tex.dispose());
      renderer.dispose();
    };
  }, []);

  const handlePrev = () => {
    soundEngine.playCardFlip();
    setActiveIndex((prev) => (prev - 1 + BAKERY_PRODUCTS.length) % BAKERY_PRODUCTS.length);
  };

  const handleNext = () => {
    soundEngine.playCardFlip();
    setActiveIndex((prev) => (prev + 1) % BAKERY_PRODUCTS.length);
  };

  return (
    <main style={{ minHeight: '100vh', background: '#140d0b' }}>
      <CursorFallingTitle
        text="DELIGHTS"
        subtitle="PAGE 03 • INTERACTIVE 3D MENU & SIGNATURE CREATIONS"
        lampFlicker={false}
      />

      {/* =====================================================================
          INTERACTIVE 3D CLOTH BANNER + EDITORIAL PRODUCT CAROUSEL
          ===================================================================== */}
      <section className="tfd-menu-outer">
        {/* Top Numbered Pill Selector (01 to 06) */}
        <div className="tfd-menu-pill-bar" role="tablist" aria-label="Signature Delights Selector">
          {BAKERY_PRODUCTS.map((prod, idx) => {
            const isCurrent = idx === activeIndex;
            return (
              <button
                key={prod.id}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                onClick={() => {
                  soundEngine.playCardFlip();
                  setActiveIndex(idx);
                }}
                className={`tfd-menu-pill ${isCurrent ? 'active' : ''}`}
              >
                {prod.number} • {prod.shortTitle.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* Main Split Interactive Stage */}
        <div
          className="tfd-menu-stage"
          style={{ touchAction: 'pan-y' }}
          onMouseDown={(e) => setDragStartX(e.clientX)}
          onMouseUp={(e) => {
            if (dragStartX !== null) {
              const delta = e.clientX - dragStartX;
              if (delta < -60) handleNext();
              if (delta > 60) handlePrev();
              setDragStartX(null);
            }
          }}
          onTouchStart={(e) => setDragStartX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (dragStartX !== null && e.changedTouches[0]) {
              const delta = e.changedTouches[0].clientX - dragStartX;
              if (delta < -50) handleNext();
              if (delta > 50) handlePrev();
              setDragStartX(null);
            }
          }}
        >
          {/* Left: Three.js WebGL Hanging Cloth Canvas (or CSS Fallback) */}
          <div style={{ position: 'relative' }}>
            {webglSupported ? (
              <div
                ref={webglContainerRef}
                className="tfd-webgl-stage"
                title="Swipe left/right to switch creations or move pointer to ripple the hanging 3D banner"
              />
            ) : (
              <div className="tfd-webgl-stage" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={currentProduct.images.card480}
                  srcSet={currentProduct.images.cardSrcSet}
                  sizes="(max-width: 768px) 88vw, 480px"
                  alt={currentProduct.name}
                  style={{ maxHeight: '100%', borderRadius: '12px', objectFit: 'contain' }}
                />
              </div>
            )}

            <div className="tfd-webgl-caption-bar">
              <span>
                <MoveHorizontal size={14} style={{ display: 'inline', marginRight: 5 }} />
                SWIPE LEFT/RIGHT OR TAP PILLS TO BROWSE
              </span>
              <button
                type="button"
                onClick={() => setSelectedProduct(currentProduct)}
                className="tfd-webgl-highres-btn"
              >
                <Eye size={13} style={{ display: 'inline', marginRight: 4 }} />
                HIGH-RES PHOTO VIEW
              </button>
            </div>
          </div>

          {/* Right: Synchronized Editorial Menu Sheet */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.05rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span className="section-kicker" style={{ marginBottom: 0 }}>
                <Sparkles size={14} /> SIGNATURE CREATION {currentProduct.number} / 06
              </span>
              <span
                style={{
                  background: 'rgba(217, 185, 91, 0.15)',
                  border: '1px solid var(--butter)',
                  color: 'var(--butter)',
                  padding: '0.28rem 0.85rem',
                  borderRadius: '999px',
                  fontFamily: 'var(--font-condensed)',
                  fontSize: '0.84rem',
                  letterSpacing: '0.14em',
                }}
              >
                {currentProduct.category.toUpperCase()}
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.65rem, 3.2vw, 2.8rem)',
                lineHeight: 1.12,
                color: 'var(--cream)',
              }}
            >
              {currentProduct.name}
            </h2>

            <p className="handwritten-note" style={{ fontSize: 'clamp(1.25rem, 2.2vw, 1.45rem)' }}>
              “{currentProduct.bakerNote}”
            </p>

            <p style={{ fontSize: '0.96rem', lineHeight: 1.66, color: 'rgba(244, 235, 221, 0.86)' }}>
              {currentProduct.editorialDescription}
            </p>

            {/* Structure & Occasion Specs */}
            <div className="tfd-menu-specs-box">
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-condensed)',
                    letterSpacing: '0.14em',
                    color: 'var(--butter)',
                    fontSize: '0.82rem',
                  }}
                >
                  ARCHITECTURE
                </div>
                <div style={{ fontSize: '0.88rem', marginTop: '0.2rem' }}>
                  {currentProduct.structure}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-condensed)',
                    letterSpacing: '0.14em',
                    color: 'var(--butter)',
                    fontSize: '0.82rem',
                  }}
                >
                  IDEAL OCCASION
                </div>
                <div style={{ fontSize: '0.88rem', marginTop: '0.2rem' }}>
                  {currentProduct.occasion}
                </div>
              </div>
            </div>

            {/* Customizable Elements */}
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-condensed)',
                  letterSpacing: '0.16em',
                  color: 'var(--peach)',
                  fontSize: '0.9rem',
                  marginBottom: '0.45rem',
                }}
              >
                BESPOKE CUSTOMIZATION OPTIONS:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {currentProduct.customizableElements.map((opt, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.9rem',
                      color: 'rgba(244, 235, 221, 0.85)',
                    }}
                  >
                    <CheckCircle2 size={15} style={{ color: 'var(--butter)', flexShrink: 0 }} />
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.88rem',
                color: 'var(--butter)',
              }}
            >
              <Calendar size={15} />
              <span>{currentProduct.leadTime} • Freshly baked to order in Thirumangalam</span>
            </div>

            {/* Action Buttons & Prev/Next Carousel Controls */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                marginTop: '0.35rem',
                paddingTop: '0.95rem',
                borderTop: '1px solid rgba(244, 235, 221, 0.12)',
              }}
            >
              <button
                type="button"
                className="btn-frenzy-primary"
                style={{ flex: '1 1 240px' }}
                onClick={() => navigate(`/contact?product=${currentProduct.slug}`)}
              >
                <Send size={15} /> ORDER ENQUIRY FOR THIS CREATION
              </button>
              <button
                type="button"
                className="btn-frenzy-outline"
                style={{ flex: '1 1 180px' }}
                onClick={() => setSelectedProduct(currentProduct)}
              >
                <Eye size={16} /> FULL STUDIO PHOTO
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', marginTop: '0.3rem' }}>
              <button
                type="button"
                onClick={handlePrev}
                className="btn-frenzy-outline"
                style={{ flex: 1, padding: '0.55rem 1rem', fontSize: '0.92rem' }}
              >
                <ChevronLeft size={16} /> PREVIOUS
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="btn-frenzy-outline"
                style={{ flex: 1, padding: '0.55rem 1rem', fontSize: '0.92rem' }}
              >
                NEXT <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Native-Feeling Horizontal Touch Scroll-Snap Carousel Below */}
        <div style={{ marginTop: '3rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            <span className="section-kicker" style={{ marginBottom: 0 }}>
              COMPLETE SIGNATURE LINEUP • SWIPE OR CLICK ANY CREATION
            </span>
          </div>

          <div ref={snapStripRef} className="tfd-menu-snap-carousel">
            {BAKERY_PRODUCTS.map((prod, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <div
                  key={prod.id}
                  onClick={() => {
                    soundEngine.playCardFlip();
                    setActiveIndex(idx);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setActiveIndex(idx);
                  }}
                  className={`tfd-menu-snap-card ${isSelected ? 'selected' : ''}`}
                >
                  <div
                    style={{
                      aspectRatio: '4 / 5',
                      borderRadius: '9px',
                      overflow: 'hidden',
                      marginBottom: '0.6rem',
                      background: '#120b09',
                    }}
                  >
                    <img
                      src={prod.images.card480}
                      srcSet={prod.images.cardSrcSet}
                      sizes="(max-width: 640px) 62vw, 220px"
                      alt={prod.shortTitle}
                      loading="lazy"
                      decoding="async"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-condensed)',
                      letterSpacing: '0.1em',
                      color: isSelected ? 'var(--butter)' : 'var(--cream)',
                      fontSize: '0.98rem',
                    }}
                  >
                    {prod.number} / {prod.shortTitle}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'rgba(244,235,221,0.68)', marginTop: 2 }}>
                    {prod.category}
                  </div>
                </div>
              );
            })}
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
        .tfd-menu-outer {
          max-width: 1360px;
          margin: 0 auto 4.5rem;
          padding: 0 clamp(0.85rem, 3vw, 1.5rem);
        }
        .tfd-menu-pill-bar {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }
        .tfd-menu-pill {
          padding: 0.52rem 1.1rem;
          min-height: 44px;
          border-radius: 999px;
          border: 1px solid rgba(217, 185, 91, 0.4);
          background: rgba(24, 17, 15, 0.8);
          color: var(--cream);
          font-family: var(--font-condensed);
          font-size: 0.94rem;
          letter-spacing: 0.13em;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .tfd-menu-pill.active {
          background: var(--butter);
          color: var(--espresso-deep);
          font-weight: 700;
        }
        .tfd-webgl-stage {
          width: 100%;
          height: clamp(320px, 65vw, 500px);
          border-radius: 16px;
          background: radial-gradient(circle at 50% 25%, rgba(217, 185, 91, 0.16) 0%, #0e0908 78%);
          border: 1px solid rgba(244, 235, 221, 0.12);
          cursor: grab;
          overflow: hidden;
        }
        .tfd-webgl-caption-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.75rem;
          padding: 0 0.25rem;
          font-size: 0.8rem;
          color: var(--butter);
          font-family: var(--font-condensed);
          letter-spacing: 0.13em;
        }
        .tfd-webgl-highres-btn {
          background: transparent;
          border: none;
          color: var(--cream);
          font-family: var(--font-condensed);
          letter-spacing: 0.13em;
          min-height: 40px;
          cursor: pointer;
          text-decoration: underline;
        }
        .tfd-menu-specs-box {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem;
          background: rgba(18, 12, 10, 0.65);
          padding: 0.95rem;
          border-radius: 12px;
          border: 1px solid rgba(244, 235, 221, 0.1);
        }
        .tfd-menu-snap-carousel {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1rem;
        }
        .tfd-menu-snap-card {
          background: rgba(24, 17, 15, 0.75);
          border: 1px solid rgba(244, 235, 221, 0.14);
          border-radius: 14px;
          padding: 0.65rem;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .tfd-menu-snap-card.selected {
          background: rgba(217, 185, 91, 0.16);
          border: 2px solid var(--butter);
        }
        @media (max-width: 1120px) {
          .tfd-menu-snap-carousel {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 0.75rem;
            gap: 0.85rem;
          }
          .tfd-menu-snap-card {
            flex: 0 0 clamp(185px, 56vw, 240px);
            scroll-snap-align: center;
          }
        }
        @media (max-width: 640px) {
          .tfd-menu-pill-bar {
            flex-wrap: nowrap;
            justify-content: flex-start;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 0.45rem;
            margin-bottom: 1.35rem;
          }
          .tfd-menu-pill {
            flex-shrink: 0;
          }
          .tfd-menu-specs-box {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
};
