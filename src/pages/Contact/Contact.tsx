import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Instagram,
  MessageCircle,
  Copy,
  Check,
  Calendar,
  MapPin,
  Sparkles,
  Info,
} from 'lucide-react';
import { BRAND_CONFIG } from '../../data/brandConfig';
import { BAKERY_PRODUCTS } from '../../data/products';
import { CursorFallingTitle } from '../../components/CursorFallingTitle';
import { soundEngine } from '../../utils/soundEngine';

export const Contact: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSlug = searchParams.get('product') || BAKERY_PRODUCTS[0].slug;

  const [selectedSlug, setSelectedSlug] = useState<string>(initialSlug);
  const [customerName, setCustomerName] = useState('');
  const [occasion, setOccasion] = useState('Birthday Celebration');
  const [preferredDate, setPreferredDate] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const paramSlug = searchParams.get('product');
    if (paramSlug) {
      setSelectedSlug(paramSlug);
    }
  }, [searchParams]);

  const selectedProduct = useMemo(() => {
    return BAKERY_PRODUCTS.find((p) => p.slug === selectedSlug) || null;
  }, [selectedSlug]);

  const minDateString = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + BRAND_CONFIG.ordering.advanceDaysMin);
    return d.toISOString().split('T')[0];
  }, []);

  const formattedEnquiryText = useMemo(() => {
    const creationTitle = selectedProduct
      ? `${selectedProduct.name} (#${selectedProduct.number})`
      : 'Bespoke Custom Theme Cake / Dessert';
    return [
      `Hello The Frenzy Delights (@thefrenzydelights)! ✨`,
      `I would like to enquire about a custom order:`,
      `• Creation: ${creationTitle}`,
      `• Name: ${customerName.trim() || '[My Name]'}`,
      `• Occasion: ${occasion}`,
      `• Preferred Collection/Delivery Date: ${preferredDate || '[3–4 Days Advance Date]'}`,
      `• Customizations / Message on Cake: ${customNotes.trim() || '[Please share availability & options]'}`,
    ].join('\n');
  }, [selectedProduct, customerName, occasion, preferredDate, customNotes]);

  const handleCopyEnquiry = async () => {
    soundEngine.playSoftChime();
    try {
      await navigator.clipboard.writeText(formattedEnquiryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(true);
    }
  };

  const handleInstagramEnquiry = async () => {
    await handleCopyEnquiry();
    window.open(BRAND_CONFIG.contact.instagramUrl, '_blank', 'noopener,noreferrer');
  };

  const handleWhatsAppEnquiry = async () => {
    if (BRAND_CONFIG.contact.whatsappNumber.trim()) {
      const cleanPhone = BRAND_CONFIG.contact.whatsappNumber.replace(/\D/g, '');
      const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(formattedEnquiryText)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      await handleCopyEnquiry();
      window.open(BRAND_CONFIG.contact.instagramUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: '#150e0c' }}>
      <CursorFallingTitle
        text="ENQUIRE"
        subtitle="PAGE 05 • BESPOKE CAKE & DESSERT ENQUIRY ATELIER"
        lampFlicker={false}
      />

      <section
        style={{
          maxWidth: '1280px',
          margin: '0 auto 5rem',
          padding: '0 clamp(0.9rem, 4vw, 1.5rem)',
        }}
      >
        <div className="tfd-contact-grid">
          {/* Left Column: Interactive Order Enquiry Builder */}
          <div className="tfd-contact-form-card">
            <span className="section-kicker">
              <Sparkles size={15} /> CUSTOM ORDER ENQUIRY BUILDER
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.65rem, 3vw, 2.4rem)',
                color: 'var(--cream)',
                marginBottom: '0.45rem',
              }}
            >
              Compose Your Celebration Request
            </h2>
            <p
              style={{
                fontSize: '0.92rem',
                color: 'rgba(244, 235, 221, 0.78)',
                lineHeight: 1.6,
                marginBottom: '1.4rem',
              }}
            >
              {BRAND_CONFIG.ordering.enquiryMethodSummary}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {/* Product Selection */}
              <div>
                <label htmlFor="tfd-product-select" className="tfd-form-label">
                  01. SELECT A SIGNATURE CREATION OR CUSTOM THEME
                </label>
                <select
                  id="tfd-product-select"
                  value={selectedSlug}
                  onChange={(e) => setSelectedSlug(e.target.value)}
                  className="tfd-form-input"
                >
                  {BAKERY_PRODUCTS.map((prod) => (
                    <option key={prod.id} value={prod.slug}>
                      #{prod.number} — {prod.name} ({prod.category})
                    </option>
                  ))}
                  <option value="custom-bespoke-creation">
                    ✦ Fully Custom Theme Cake / Brownie Box (Describe below)
                  </option>
                </select>
              </div>

              {/* Customer Name & Occasion */}
              <div className="tfd-form-two-col">
                <div>
                  <label htmlFor="tfd-name" className="tfd-form-label">
                    02. YOUR NAME
                  </label>
                  <input
                    id="tfd-name"
                    type="text"
                    autoComplete="name"
                    placeholder="e.g. Priya / Karthik"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="tfd-form-input"
                  />
                </div>

                <div>
                  <label htmlFor="tfd-occasion" className="tfd-form-label">
                    03. CELEBRATION OCCASION
                  </label>
                  <select
                    id="tfd-occasion"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="tfd-form-input"
                  >
                    <option value="Birthday Celebration">Birthday Celebration</option>
                    <option value="First Birthday Milestone ('One')">
                      First Birthday Milestone ("One")
                    </option>
                    <option value="Engagement / Ring Ceremony">Engagement / Ring Ceremony</option>
                    <option value="Wedding Anniversary">Wedding Anniversary</option>
                    <option value="Family / Husband / Dad Celebration">
                      Family / Husband / Dad Celebration
                    </option>
                    <option value="Custom Gifting / Brownie Slab">
                      Custom Gifting / Brownie Slab
                    </option>
                  </select>
                </div>
              </div>

              {/* Preferred Collection / Delivery Date */}
              <div>
                <label htmlFor="tfd-date" className="tfd-form-label">
                  04. PREFERRED COLLECTION OR DELIVERY DATE (3–4 DAYS ADVANCE NOTICE)
                </label>
                <input
                  id="tfd-date"
                  type="date"
                  min={minDateString}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="tfd-form-input"
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              {/* Custom Message / Topper / Flavour Notes */}
              <div>
                <label htmlFor="tfd-notes" className="tfd-form-label">
                  05. INSCRIPTION NAME, THEME DETAILS &amp; FLAVOUR PREFERENCES
                </label>
                <textarea
                  id="tfd-notes"
                  rows={4}
                  placeholder="Share the name on the cake topper, preferred weight/tiers, chocolate or buttercream preference, or any special theme notes..."
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="tfd-form-input"
                  style={{ minHeight: '110px', resize: 'vertical' }}
                />
              </div>

              {/* Transparent Discovery Platform Notice */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.65rem',
                  alignItems: 'flex-start',
                  background: 'rgba(217, 185, 91, 0.08)',
                  border: '1px solid rgba(217, 185, 91, 0.3)',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  color: 'rgba(244, 235, 221, 0.85)',
                }}
              >
                <Info size={17} style={{ color: 'var(--butter)', flexShrink: 0, marginTop: 2 }} />
                <span>
                  <strong>Direct-to-Baker Enquiry:</strong> Tapping below copies your formatted
                  order summary and opens our official Instagram DM (
                  <strong>{BRAND_CONFIG.contact.instagramHandle}</strong>) or WhatsApp so we can
                  confirm availability, customization, and pricing personally.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="tfd-contact-cta-row">
                <button
                  type="button"
                  className="btn-frenzy-primary"
                  onClick={handleInstagramEnquiry}
                  style={{ flex: '1 1 260px' }}
                >
                  <Instagram size={17} /> COPY &amp; SEND VIA INSTAGRAM DM ↗
                </button>

                <button
                  type="button"
                  className="btn-frenzy-outline"
                  onClick={handleCopyEnquiry}
                  style={{ flex: '1 1 180px' }}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'ENQUIRY COPIED!' : 'COPY ENQUIRY TEXT'}
                </button>
              </div>

              {BRAND_CONFIG.contact.whatsappNumber ? (
                <button
                  type="button"
                  onClick={handleWhatsAppEnquiry}
                  className="btn-frenzy-outline"
                  style={{ width: '100%', borderColor: '#4ade80', color: '#4ade80' }}
                >
                  <MessageCircle size={17} /> SEND ENQUIRY ON WHATSAPP ↗
                </button>
              ) : null}
            </div>
          </div>

          {/* Right Column: Live Selected Product Card Preview + Formatted Message Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
            {selectedProduct && (
              <div className="tfd-selected-preview-card">
                <img
                  src={selectedProduct.images.card480}
                  srcSet={selectedProduct.images.cardSrcSet}
                  sizes="(max-width: 480px) 85vw, 140px"
                  alt={selectedProduct.name}
                  className="tfd-selected-preview-img"
                />
                <div>
                  <span
                    style={{
                      fontFamily: 'var(--font-condensed)',
                      letterSpacing: '0.14em',
                      fontSize: '0.8rem',
                      color: '#7a5244',
                    }}
                  >
                    SELECTED REFERENCE CREATION #{selectedProduct.number}
                  </span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.32rem',
                      lineHeight: 1.15,
                      marginTop: '0.2rem',
                    }}
                  >
                    {selectedProduct.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-hand)',
                      fontSize: '1.2rem',
                      color: 'var(--chocolate)',
                      marginTop: '0.35rem',
                    }}
                  >
                    “{selectedProduct.bakerNote}”
                  </p>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: '#5c4038',
                      marginTop: '0.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <Calendar size={13} /> {selectedProduct.leadTime}
                  </div>
                </div>
              </div>
            )}

            {/* Live Formatted Enquiry Preview Card */}
            <div
              style={{
                background: '#110b09',
                border: '1px solid rgba(217, 185, 91, 0.3)',
                borderRadius: '16px',
                padding: '1.25rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.4rem',
                  marginBottom: '0.75rem',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-condensed)',
                    letterSpacing: '0.16em',
                    color: 'var(--butter)',
                    fontSize: '0.9rem',
                  }}
                >
                  LIVE ENQUIRY MESSAGE PREVIEW
                </span>
                {copied && (
                  <span style={{ color: '#4ade80', fontSize: '0.82rem' }}>
                    ✓ Copied — paste in DM!
                  </span>
                )}
              </div>
              <pre
                style={{
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'break-word',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.88rem',
                  lineHeight: 1.62,
                  color: 'rgba(244, 235, 221, 0.88)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '0.95rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(244, 235, 221, 0.08)',
                }}
              >
                {formattedEnquiryText}
              </pre>
            </div>

            {/* Direct Atelier Contact Info Card */}
            <div
              style={{
                background: 'rgba(244, 235, 221, 0.04)',
                border: '1px solid rgba(244, 235, 221, 0.14)',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                fontSize: '0.92rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Instagram size={18} style={{ color: 'var(--butter)', flexShrink: 0 }} />
                <span>
                  Official Instagram:{' '}
                  <a
                    href={BRAND_CONFIG.contact.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--butter)', textDecoration: 'underline' }}
                  >
                    {BRAND_CONFIG.contact.instagramHandle}
                  </a>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <MapPin size={18} style={{ color: 'var(--butter)', flexShrink: 0 }} />
                <span>{BRAND_CONFIG.location.fullDisplay}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Calendar size={18} style={{ color: 'var(--butter)', flexShrink: 0 }} />
                <span>{BRAND_CONFIG.contact.hoursDisplay}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .tfd-contact-form-card {
          background: linear-gradient(145deg, #251915 0%, #170f0d 100%);
          border: 1px solid rgba(217, 185, 91, 0.35);
          border-radius: 22px;
          padding: clamp(1.25rem, 4vw, 2.2rem);
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.65);
        }
        .tfd-form-label {
          display: block;
          font-family: var(--font-condensed);
          letter-spacing: 0.14em;
          color: var(--butter);
          font-size: 0.9rem;
          margin-bottom: 0.4rem;
        }
        .tfd-form-input {
          width: 100%;
          min-height: 48px;
          padding: 0.8rem 0.95rem;
          border-radius: 10px;
          background: #120b09;
          border: 1px solid rgba(217, 185, 91, 0.32);
          color: var(--cream);
          /* 16px prevents iOS Safari auto-zoom on focus */
          font-size: 1rem;
        }
        .tfd-form-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .tfd-contact-cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 0.25rem;
        }
        .tfd-selected-preview-card {
          background: var(--paper-polaroid);
          color: var(--espresso-deep);
          padding: 1rem;
          border-radius: 14px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.55);
          display: grid;
          grid-template-columns: 135px 1fr;
          gap: 1.1rem;
          align-items: center;
          border: 2px solid var(--butter);
        }
        .tfd-selected-preview-img {
          width: 135px;
          height: 168px;
          object-fit: cover;
          border-radius: 8px;
        }
        @media (max-width: 600px) {
          .tfd-form-two-col {
            grid-template-columns: 1fr;
          }
          .tfd-selected-preview-card {
            grid-template-columns: 1fr;
          }
          .tfd-selected-preview-img {
            width: 100%;
            height: 220px;
          }
        }
      `}</style>
    </main>
  );
};
