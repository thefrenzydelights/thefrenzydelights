export interface BrandConfig {
  name: string;
  shortName: string;
  tagline: string;
  secondaryTaglines: string[];
  location: {
    neighbourhood: string;
    city: string;
    region: string;
    fullDisplay: string;
    pickupNote: string;
  };
  ordering: {
    leadTimeNotice: string;
    advanceDaysMin: number;
    advanceDaysRecommended: number;
    enquiryMethodSummary: string;
    customOrdersAvailable: boolean;
  };
  contact: {
    instagramHandle: string;
    instagramUrl: string;
    instagramDmUrl: string;
    /**
     * EDITABLE PLACEHOLDER: Replace with official WhatsApp number in international format
     * (e.g. "919876543210") when ready to enable direct WhatsApp deep-linking.
     * Leave empty "" to route WhatsApp button to a configurable copy+DM helper.
     */
    whatsappNumber: string;
    emailPlaceholder: string;
    hoursDisplay: string;
  };
  storyPlaceholders: {
    founderNamePlaceholder: string;
    establishedNotePlaceholder: string;
    atelierPhilosophy: string;
  };
  logos: {
    bakerSquare: string;
    cupcakeCircle: string;
    chefHatCircle: string;
    tieredCakeCircle: string;
  };
}

const BASE = import.meta.env.BASE_URL;

export const BRAND_CONFIG: BrandConfig = {
  name: 'THE FRENZY DELIGHTS',
  shortName: 'Frenzy Delights',
  tagline: 'Bliss in Every Bite',
  secondaryTaglines: [
    'A LITTLE FRENZY. A LOT OF DELIGHT.',
    'BAKED WITH LOVE. MADE TO CRAVE.',
    'YOUR NEXT SWEET OBSESSION.',
    'HANDCRAFTED IN THIRUMANGALAM.',
  ],
  location: {
    neighbourhood: 'Thirumangalam',
    city: 'Chennai / Madurai Region (Thirumangalam)',
    region: 'Tamil Nadu, India',
    fullDisplay: 'Thirumangalam — Home-Based Artisanal Bakery Atelier',
    pickupNote: 'Collection & local delivery coordinated directly upon order confirmation.',
  },
  ordering: {
    leadTimeNotice: 'Please enquire 3–4 days in advance for custom celebration & tiered cakes.',
    advanceDaysMin: 3,
    advanceDaysRecommended: 4,
    enquiryMethodSummary:
      'All creations are baked fresh to order. Select a signature creation or describe your custom theme, and send your enquiry directly via Instagram DM (@thefrenzydelights) or WhatsApp.',
    customOrdersAvailable: true,
  },
  contact: {
    instagramHandle: '@thefrenzydelights',
    instagramUrl: 'https://www.instagram.com/thefrenzydelights/',
    instagramDmUrl: 'https://ig.me/m/thefrenzydelights',
    // EDITABLE CONFIGURATION: Set official WhatsApp number (digits only, e.g. '919XXXXXXXXX')
    whatsappNumber: '',
    emailPlaceholder: 'orders@thefrenzydelights.com (Editable in src/data/brandConfig.ts)',
    hoursDisplay: 'By Custom Order — DM Open Daily (3–4 Days Advance Notice)',
  },
  storyPlaceholders: {
    founderNamePlaceholder: '[Editable: Head Baker / Founder Name — Configure in src/data/brandConfig.ts]',
    establishedNotePlaceholder: '[Editable: Founding Year & Kitchen Origin Story — Configure in src/data/brandConfig.ts]',
    atelierPhilosophy:
      'Born as a home-based artisanal kitchen in Thirumangalam, The Frenzy Delights crafts bespoke celebration cakes, decadent dark-chocolate brownies, and custom-themed centerpieces from scratch — one batch, one celebration, and one memory at a time.',
  },
  logos: {
    bakerSquare: `${BASE}assets/images/logos/logo-baker-square.webp`,
    cupcakeCircle: `${BASE}assets/images/logos/logo-cupcake-circle.webp`,
    chefHatCircle: `${BASE}assets/images/logos/logo-chefhat-circle.webp`,
    tieredCakeCircle: `${BASE}assets/images/logos/logo-tieredcake-circle.webp`,
  },
};
