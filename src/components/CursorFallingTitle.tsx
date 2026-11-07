import React, { useEffect, useRef } from 'react';

interface CursorFallingTitleProps {
  text: string;
  subtitle?: string;
  lampFlicker?: boolean;
  lightTheme?: boolean;
}

/**
 * Reinterprets the reference website's signature header (`work_3.html` & `about_3.html`):
 * - Optional flickering warm bakery tube lamp SVG (`wkFluorescente`)
 * - Giant condensed letters that drop from above with staggered bounce
 * - On pointer devices with hover, each letter flees organically from the mouse cursor
 * - Words are grouped so single words never break mid-word on narrow mobile viewports (320px-430px)
 */
export const CursorFallingTitle: React.FC<CursorFallingTitleProps> = ({
  text,
  subtitle,
  lampFlicker = true,
  lightTheme = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    // Only run continuous cursor-flee physics on devices with fine pointer (desktop/laptop)
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
      return;
    }

    const spans = lettersRef.current.filter(Boolean) as HTMLSpanElement[];
    if (!spans.length) return;

    const state = spans.map(() => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      rot: 0,
      vrot: 0,
    }));

    let mouseX = -9999;
    let mouseY = -9999;
    let rafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const tick = () => {
      spans.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - mouseX;
        const dy = cy - mouseY;
        const dist = Math.hypot(dx, dy);
        const radius = 150;

        if (dist < radius && dist > 1) {
          const force = (1 - dist / radius) * 3.2;
          state[i].vx += (dx / dist) * force;
          state[i].vy += (dy / dist) * force;
          state[i].vrot += (dx / dist) * force * 0.45;
        }

        state[i].vx += -state[i].x * 0.08;
        state[i].vy += -state[i].y * 0.08;
        state[i].vrot += -state[i].rot * 0.08;

        state[i].vx *= 0.84;
        state[i].vy *= 0.84;
        state[i].vrot *= 0.84;

        state[i].x += state[i].vx;
        state[i].y += state[i].vy;
        state[i].rot += state[i].vrot;

        el.style.transform = `translate3d(${state[i].x.toFixed(1)}px, ${state[i].y.toFixed(1)}px, 0) rotate(${state[i].rot.toFixed(1)}deg)`;
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [text]);

  const words = text.split(' ');
  let globalCharIdx = 0;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        padding: 'clamp(5.2rem, 10vw, 6.8rem) 1rem clamp(1.5rem, 4vw, 2.5rem)',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      {lampFlicker && (
        <div
          style={{
            maxWidth: 'min(480px, 92vw)',
            margin: '0 auto 1rem',
            position: 'relative',
          }}
        >
          <svg
            viewBox="0 0 500 54"
            style={{
              width: '100%',
              height: 'auto',
              filter: 'drop-shadow(0 12px 28px rgba(217, 185, 91, 0.65))',
              animation: 'tfdLampFlicker 6s infinite',
            }}
            aria-hidden="true"
          >
            <line x1="90" y1="0" x2="90" y2="24" stroke="#8c7148" strokeWidth="3" />
            <line x1="410" y1="0" x2="410" y2="24" stroke="#8c7148" strokeWidth="3" />
            <rect x="65" y="22" width="370" height="14" rx="7" fill="#3a261e" stroke="#d9b95b" strokeWidth="1.5" />
            <rect x="80" y="34" width="340" height="10" rx="5" fill="#fff6d6" />
          </svg>
          <div
            style={{
              position: 'absolute',
              top: '32px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(540px, 96vw)',
              height: '180px',
              background:
                'radial-gradient(ellipse at top, rgba(242, 207, 102, 0.32) 0%, rgba(217, 185, 91, 0.08) 55%, transparent 80%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      )}

      {subtitle && <div className="section-kicker">{subtitle}</div>}

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.55rem, 11vw, 9.2rem)',
          lineHeight: 0.94,
          letterSpacing: '0.03em',
          color: lightTheme ? 'var(--espresso-deep)' : 'var(--vanilla)',
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          columnGap: '0.28em',
          rowGap: '0.08em',
          userSelect: 'none',
          maxWidth: '100%',
        }}
      >
        {words.map((word, wIdx) => (
          <span
            key={wIdx}
            style={{
              display: 'inline-flex',
              whiteSpace: 'nowrap',
            }}
          >
            {word.split('').map((ch) => {
              const idx = globalCharIdx++;
              return (
                <span
                  key={idx}
                  ref={(el) => {
                    lettersRef.current[idx] = el;
                  }}
                  data-letter-index={idx}
                  style={{
                    display: 'inline-block',
                    animation: `tfdDropLetter 0.72s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 0.04}s both`,
                    cursor: 'default',
                    textShadow: lightTheme
                      ? '0 8px 20px rgba(74, 44, 36, 0.18)'
                      : '0 10px 30px rgba(0, 0, 0, 0.55)',
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </span>
        ))}
      </h1>

      <style>{`
        @keyframes tfdDropLetter {
          0% {
            opacity: 0;
            transform: translateY(-90px) rotate(-12deg) scale(0.82);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotate(0deg) scale(1);
          }
        }
        @keyframes tfdLampFlicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
          20%, 24%, 55% { opacity: 0.55; }
        }
      `}</style>
    </div>
  );
};
