export type ProductCategory =
  | 'All'
  | 'Celebration Cakes'
  | 'Engagement & Tiered'
  | 'First Birthday'
  | 'Chocolate & Brownies';

export interface BakeryProduct {
  id: string;
  number: string;
  slug: string;
  name: string;
  shortTitle: string;
  scrapbookCaption: string;
  category: Exclude<ProductCategory, 'All'>;
  secondaryCategories: string[];
  occasion: string;
  structure: string;
  visualHighlights: string[];
  editorialDescription: string;
  bakerNote: string;
  leadTime: string;
  customizableElements: string[];
  featured: boolean;
  accentColor: string;
  boardRotation: number;
  pinType: 'pin-red' | 'pin-gold' | 'washi-warm' | 'washi-Kraft';
  images: {
    hero: string;
    hero640: string;
    heroSrcSet: string;
    card: string;
    card480: string;
    cardSrcSet: string;
    gallery: string;
    detail: string;
    instagram: string;
    insta400: string;
    instaSrcSet: string;
    cutout: string;
    cutout300: string;
    cutoutSrcSet: string;
  };
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'All',
  'Celebration Cakes',
  'Engagement & Tiered',
  'First Birthday',
  'Chocolate & Brownies',
];

const BASE = import.meta.env.BASE_URL;

function buildImages(slug: string) {
  return {
    hero: `${BASE}assets/images/hero/${slug}-hero.webp`,
    hero640: `${BASE}assets/images/hero/${slug}-hero-640w.webp`,
    heroSrcSet: `${BASE}assets/images/hero/${slug}-hero-640w.webp 640w, ${BASE}assets/images/hero/${slug}-hero-1024w.webp 1024w, ${BASE}assets/images/hero/${slug}-hero.webp 1600w`,
    card: `${BASE}assets/images/products/${slug}-card.webp`,
    card480: `${BASE}assets/images/products/${slug}-card-480w.webp`,
    cardSrcSet: `${BASE}assets/images/products/${slug}-card-480w.webp 480w, ${BASE}assets/images/products/${slug}-card-720w.webp 720w, ${BASE}assets/images/products/${slug}-card.webp 960w`,
    gallery: `${BASE}assets/images/gallery/${slug}-gallery.webp`,
    detail: `${BASE}assets/images/details/${slug}-detail.webp`,
    instagram: `${BASE}assets/images/instagram/${slug}-insta.webp`,
    insta400: `${BASE}assets/images/instagram/${slug}-insta-400w.webp`,
    instaSrcSet: `${BASE}assets/images/instagram/${slug}-insta-400w.webp 400w, ${BASE}assets/images/instagram/${slug}-insta.webp 1000w`,
    cutout: `${BASE}assets/images/cutouts/${slug}-cutout.webp`,
    cutout300: `${BASE}assets/images/cutouts/${slug}-cutout-300w.webp`,
    cutoutSrcSet: `${BASE}assets/images/cutouts/${slug}-cutout-300w.webp 300w, ${BASE}assets/images/cutouts/${slug}-cutout.webp 600w`,
  };
}

export const BAKERY_PRODUCTS: BakeryProduct[] = [
  {
    id: 'prod-01',
    number: '01',
    slug: 'glittering-butterfly-cake',
    name: 'Glittering Butterfly Two-Tier Birthday Cake',
    shortTitle: 'Glittering Butterfly Tier',
    scrapbookCaption: 'No. 01 — Tangerine & Vanilla Fluted Butterfly Tier',
    category: 'Celebration Cakes',
    secondaryCategories: ['Engagement & Tiered'],
    occasion: 'Milestone Birthday Celebrations',
    structure: 'Two-Tier Whipped Cream & Buttercream Celebration Cake',
    visualHighlights: [
      'Vertical fluted white cream piping with fine golden dust',
      'Hand-placed gradient tangerine & gold wings butterflies',
      'Dual-tone orange & vanilla rosette crown with silver/gold sugar dragees',
      'White chocolate bar accents & glittery gold "Happy Birthday" script topper',
      'Finished with a shimmering gold-ribbon base collar',
    ],
    editorialDescription:
      'A radiant two-tier centerpiece dressed in vertically fluted vanilla cream and warm tangerine frosting. Crowned with delicate gradient butterflies in flight, white chocolate squares, metallic sugar pearls, and a sparkling gold "Happy Birthday" topper.',
    bakerNote: 'Every butterfly wing is angled by hand right before collection so the cake feels alive.',
    leadTime: 'Enquire 3–4 days in advance',
    customizableElements: [
      'Butterfly colour palette & tier accents',
      'Custom name or age acrylic topper',
      'Sponge & filling profile (requested via DM)',
    ],
    featured: true,
    accentColor: '#D97B29',
    boardRotation: -2.2,
    pinType: 'pin-red',
    images: buildImages('glittering-butterfly-cake'),
  },
  {
    id: 'prod-02',
    number: '02',
    slug: 'just-engaged-tier-cake',
    name: 'Elegant "Just Engaged" Illuminated Acrylic Tier Cake',
    shortTitle: 'Just Engaged Tier Display',
    scrapbookCaption: 'No. 02 — "SJ" Engagement Tier with Lit Acrylic Chamber',
    category: 'Engagement & Tiered',
    secondaryCategories: ['Celebration Cakes'],
    occasion: 'Engagements, Roka & Ring Ceremonies',
    structure: 'Two-Tier Smooth Cream Cake with Fairy-Lit Acrylic Middle Display',
    visualHighlights: [
      'Clear acrylic middle tier illuminated with warm fairy lights & illustrated ring-exchange artwork',
      'Gold metallic palm spear, fresh-look ivory roses, and satin gold spheres',
      'Custom "SJ" metallic monogram on the base tier & interlocking diamond-ring motifs',
      'Glittering gold "Just Engaged" topper with double heart rings',
    ],
    editorialDescription:
      'Designed for unforgettable ring ceremonies, this architectural two-tier creation suspends the upper tier over a warm fairy-lit acrylic showcase featuring illustrated hands and an engagement ring. Accented with ivory roses, metallic spheres, a sculpted gold palm fan, and bespoke couple initials.',
    bakerNote: 'The illuminated middle chamber turns the cake cutting into the warm focal point of the evening.',
    leadTime: 'Enquire 4–5 days in advance',
    customizableElements: [
      'Couple monogram initials (e.g. "SJ")',
      'Acrylic chamber illustration or floral fill',
      'Tier sizing & flavour pairing',
    ],
    featured: true,
    accentColor: '#D9B95B',
    boardRotation: 1.8,
    pinType: 'washi-warm',
    images: buildImages('just-engaged-tier-cake'),
  },
  {
    id: 'prod-03',
    number: '03',
    slug: 'golden-heart-chocolate-cake',
    name: 'Golden Heart Dark Chocolate Cake — "Husband & Dad"',
    shortTitle: 'Golden Heart Chocolate',
    scrapbookCaption: 'No. 03 — Heart Truffle Rosettes ("Husband / Dad")',
    category: 'Chocolate & Brownies',
    secondaryCategories: ['Celebration Cakes'],
    occasion: 'Family Birthdays, Husband & Father Celebrations',
    structure: 'Heart-Shaped Rich Dark Chocolate & Ganache Piped Cake',
    visualHighlights: [
      'Intricate two-tone dark & milk chocolate braided rosette piping across the entire heart surface',
      'Bordered with creamy white chocolate drops and metallic gold sugar beads',
      'Crossword-style fondant lettering spelling "HUSBAND" & "DAD" flanked by golden hearts',
      'Geometric diamond-frame gold "Happy Birthday" topper',
    ],
    editorialDescription:
      'An indulgent heart-shaped chocolate creation piped edge-to-edge with rich two-tone chocolate ganache waves. Bordered with white chocolate drops, scattered with golden dragees, and personalized with crossword-style fondant lettering celebrating both Husband and Dad.',
    bakerNote: 'Crossword fondant lettering lets families celebrate two cherished roles on a single decadent canvas.',
    leadTime: 'Enquire 3–4 days in advance',
    customizableElements: [
      'Custom fondant crossword words or names',
      'Dark truffle, milk chocolate, or fudge frosting',
      'Heart or round board presentation',
    ],
    featured: true,
    accentColor: '#6E3B2B',
    boardRotation: -1.5,
    pinType: 'pin-gold',
    images: buildImages('golden-heart-chocolate-cake'),
  },
  {
    id: 'prod-04',
    number: '04',
    slug: 'anniversary-fudge-brownie',
    name: 'Artisanal Crinkle-Top Anniversary Chocolate Brownie Slab',
    shortTitle: 'Anniversary Fudge Brownie',
    scrapbookCaption: 'No. 04 — Crinkle-Top Dark Fudge Brownie Slab',
    category: 'Chocolate & Brownies',
    secondaryCategories: ['Celebration Cakes'],
    occasion: 'Anniversaries, Intimate Gifting & Chocolate Lovers',
    structure: 'Whole Round Fudgy Crinkle-Top Chocolate Brownie Cake',
    visualHighlights: [
      'Signature glossy, flaky papery crinkle crust with deep dark-cocoa fissures',
      'Dense, molten-fudge interior baked in a whole celebration round',
      'Crowned with a warm laser-engraved wooden "Happy Anniversary" keepsake medallion',
    ],
    editorialDescription:
      'For those who crave pure, unadulterated cocoa intensity over traditional sponge: a whole round artisanal chocolate brownie slab with a crackled meringue-like chocolate crust and a dense, fudgy center, finished with a natural engraved wooden "Happy Anniversary" plaque.',
    bakerNote: 'Baked until the top forms that unmistakable crackled sheen while the center stays deeply fudgy.',
    leadTime: 'Enquire 2–3 days in advance',
    customizableElements: [
      'Custom occasion topper (Anniversary, Birthday, Congratulations)',
      'Whole round slab or pre-sliced gift box presentation',
    ],
    featured: true,
    accentColor: '#4A2C24',
    boardRotation: 2.4,
    pinType: 'washi-Kraft',
    images: buildImages('anniversary-fudge-brownie'),
  },
  {
    id: 'prod-05',
    number: '05',
    slug: 'mithul-golden-first-birthday-cake',
    name: 'Mithul’s Golden Teddy & Rainbow First Birthday Cake',
    shortTitle: 'Mithul’s Golden "One" Cake',
    scrapbookCaption: 'No. 05 — Teddy, Boho Rainbow & Gold Leaf "One" Tier',
    category: 'First Birthday',
    secondaryCategories: ['Celebration Cakes'],
    occasion: 'First Birthday Milestones ("One")',
    structure: 'Tall Barrel Smooth Buttercream Theme Cake',
    visualHighlights: [
      'Handcrafted 3D fondant teddy bear centerpiece with warm stitched details',
      'Pastel boho rainbow arch, dreamy cloud cutout, and pleated gold palm fan',
      'Edible gold leaf flakes along the base rim, royal gold crown emblem & star cutouts',
      'Mirror-gold acrylic "One", "Mithul", and "Happy Birthday" script toppers',
    ],
    editorialDescription:
      'A whimsical tall barrel cake created for Mithul’s first birthday milestone. Dressed in silky ivory frosting and adorned with a sculpted teddy bear, boho pastel rainbow, edible gold leaf trim, pearl & metallic spheres, a royal crown motif, and mirror-gold calligraphy.',
    bakerNote: 'First birthdays deserve a storybook centerpiece — every star, cloud, and gold flake is placed with tweezers.',
    leadTime: 'Enquire 3–4 days in advance',
    customizableElements: [
      'Child’s name in mirror-gold acrylic',
      'Character motif (Teddy, Crown, Rainbow, Safari)',
      'Colour palette & height',
    ],
    featured: true,
    accentColor: '#C99E42',
    boardRotation: -1.9,
    pinType: 'pin-red',
    images: buildImages('mithul-golden-first-birthday-cake'),
  },
  {
    id: 'prod-06',
    number: '06',
    slug: 'viyaanram-aqua-birthday-cake',
    name: 'Viyaanram’s Aqua & Pearl Two-Tier First Birthday Cake',
    shortTitle: 'Viyaanram’s Aqua Tier',
    scrapbookCaption: 'No. 06 — Aqua & White Meringue Kiss Two-Tier ("One")',
    category: 'First Birthday',
    secondaryCategories: ['Engagement & Tiered', 'Celebration Cakes'],
    occasion: 'First Birthday & Kids’ Tiered Celebrations',
    structure: 'Two-Tier Aqua Blue & Crisp White Cream Cake',
    visualHighlights: [
      'Two-tier silhouette combining a crisp white upper tier with a vibrant aqua-blue combed lower tier',
      'Clusters of swirled blue-and-white meringue kisses, lustrous sugar pearls, and puffed fondant stars',
      'Painted brushstroke acrylic disc topper with gold "Happy Birthday" lettering',
      'Custom mirror-gold script "Viyaanram" and oversized "One" emblem',
    ],
    editorialDescription:
      'Crafted for Viyaanram’s first birthday, this joyful two-tier design pairs a snow-white top tier with an ocean-aqua base tier. Cascading clusters of piped meringue kisses, iridescent edible pearls, starry cutouts, and a painted watercolor acrylic disc topper complete the celebration.',
    bakerNote: 'The contrast of ocean aqua, pearl white, and mirror gold brings instant joy to the dessert table.',
    leadTime: 'Enquire 4 days in advance',
    customizableElements: [
      'Custom name & age in mirror-gold script',
      'Two-tone frosting colour combinations',
      'Single-tier or two-tier sizing',
    ],
    featured: true,
    accentColor: '#1CA8C9',
    boardRotation: 2.1,
    pinType: 'pin-gold',
    images: buildImages('viyaanram-aqua-birthday-cake'),
  },
];

export interface ScrapbookPinItem {
  id: string;
  product: BakeryProduct;
  aspectClass: 'ratio-4-5' | 'ratio-1-1' | 'ratio-16-9' | 'ratio-4-3';
  imageSrc: string;
  imageSrcSet?: string;
  caption: string;
  handwrittenNote?: string;
  rotation: number;
  attachment: 'pin-red' | 'pin-gold' | 'washi-left' | 'washi-top';
  columnIndex: number;
}

export const SCRAPBOOK_ITEMS: ScrapbookPinItem[] = [
  {
    id: 'sb-1',
    product: BAKERY_PRODUCTS[0],
    aspectClass: 'ratio-4-5',
    imageSrc: BAKERY_PRODUCTS[0].images.card,
    imageSrcSet: BAKERY_PRODUCTS[0].images.cardSrcSet,
    caption: '01 / Glittering Butterfly Two-Tier',
    handwrittenNote: 'Hand-placed gradient butterflies + gold dust!',
    rotation: -2.3,
    attachment: 'pin-red',
    columnIndex: 0,
  },
  {
    id: 'sb-2',
    product: BAKERY_PRODUCTS[1],
    aspectClass: 'ratio-4-5',
    imageSrc: BAKERY_PRODUCTS[1].images.card,
    imageSrcSet: BAKERY_PRODUCTS[1].images.cardSrcSet,
    caption: '02 / "Just Engaged" Illuminated Tier',
    handwrittenNote: 'Fairy-lit acrylic ring chamber ("SJ")',
    rotation: 1.9,
    attachment: 'washi-top',
    columnIndex: 1,
  },
  {
    id: 'sb-3',
    product: BAKERY_PRODUCTS[2],
    aspectClass: 'ratio-1-1',
    imageSrc: BAKERY_PRODUCTS[2].images.instagram,
    imageSrcSet: BAKERY_PRODUCTS[2].images.instaSrcSet,
    caption: '03 / Golden Heart Dark Chocolate',
    handwrittenNote: 'Crossword fondant: HUSBAND × DAD',
    rotation: -1.6,
    attachment: 'pin-gold',
    columnIndex: 2,
  },
  {
    id: 'sb-4',
    product: BAKERY_PRODUCTS[3],
    aspectClass: 'ratio-4-3',
    imageSrc: BAKERY_PRODUCTS[3].images.gallery,
    caption: '04 / Crinkle-Top Anniversary Brownie',
    handwrittenNote: 'Pure fudgy crinkle crust — zero sponge!',
    rotation: 2.4,
    attachment: 'washi-left',
    columnIndex: 3,
  },
  {
    id: 'sb-5',
    product: BAKERY_PRODUCTS[4],
    aspectClass: 'ratio-4-5',
    imageSrc: BAKERY_PRODUCTS[4].images.card,
    imageSrcSet: BAKERY_PRODUCTS[4].images.cardSrcSet,
    caption: '05 / Mithul’s Golden 1st Birthday',
    handwrittenNote: 'Sculpted fondant teddy + edible gold leaf',
    rotation: 1.7,
    attachment: 'pin-red',
    columnIndex: 0,
  },
  {
    id: 'sb-6',
    product: BAKERY_PRODUCTS[5],
    aspectClass: 'ratio-4-5',
    imageSrc: BAKERY_PRODUCTS[5].images.card,
    imageSrcSet: BAKERY_PRODUCTS[5].images.cardSrcSet,
    caption: '06 / Viyaanram’s Aqua "One" Tier',
    handwrittenNote: 'Piped meringue kisses & ocean-aqua comb',
    rotation: -2.1,
    attachment: 'pin-gold',
    columnIndex: 1,
  },
  {
    id: 'sb-7',
    product: BAKERY_PRODUCTS[0],
    aspectClass: 'ratio-16-9',
    imageSrc: BAKERY_PRODUCTS[0].images.hero,
    imageSrcSet: BAKERY_PRODUCTS[0].images.heroSrcSet,
    caption: '07 / Studio Study — Fluted Cream & Gold Pearls',
    rotation: 1.4,
    attachment: 'washi-top',
    columnIndex: 2,
  },
  {
    id: 'sb-8',
    product: BAKERY_PRODUCTS[1],
    aspectClass: 'ratio-16-9',
    imageSrc: BAKERY_PRODUCTS[1].images.hero,
    imageSrcSet: BAKERY_PRODUCTS[1].images.heroSrcSet,
    caption: '08 / Atelier Detail — Geometric Gold Stand & Roses',
    rotation: -1.8,
    attachment: 'pin-red',
    columnIndex: 3,
  },
];
