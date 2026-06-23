import { fromMajor } from "@/lib/money";
import type {
  ActiveProgram,
  Booking,
  Business,
  Category,
  Collection,
  Consent,
  Consumer,
  ConsumerMembership,
  ConsumerPackage,
  ConsumerStay,
  ConsumerSubscription,
  Device,
  GiftCard,
  Loyalty,
  MembershipPlan,
  Notification,
  Order,
  PackagePlan,
  PassportShare,
  PaymentMethod,
  Product,
  Program,
  Review,
  Service,
  Staff,
  Stay,
  StoreCredit,
  TimelineEvent,
  WellnessRecord,
} from "./types";

/** Prototype anchor — "today". Everything relative is dated around this. */
export const TODAY_ISO = "2026-06-19";

/* ============================== Consumer ============================== */

export const CONSUMER: Consumer = {
  id: "me",
  name: "Maya Almeida",
  firstName: "Maya",
  email: "maya.almeida@example.com",
  phone: "+351 912 345 678",
  city: "Lisbon",
  memberSinceIso: "2024-03-10",
  avatarGradient: "clay",
  loyaltyTier: "Bloom",
};

/* ============================== Businesses ============================== */

const HOURS_STD = [
  { day: "Mon", open: "09:00", close: "20:00" },
  { day: "Tue", open: "09:00", close: "20:00" },
  { day: "Wed", open: "09:00", close: "20:00" },
  { day: "Thu", open: "09:00", close: "21:00" },
  { day: "Fri", open: "09:00", close: "21:00" },
  { day: "Sat", open: "10:00", close: "18:00" },
  { day: "Sun", open: "10:00", close: "16:00", closed: false },
];

export const BUSINESSES: Business[] = [
  {
    id: "still-waters",
    name: "Still Waters Spa",
    vertical: "spa",
    tagline: "Urban sanctuary for deep rest",
    about:
      "A quiet spa in the heart of Príncipe Real, Still Waters pairs classical massage with hydrotherapy and a candlelit relaxation lounge. Therapists are trained in deep tissue, lymphatic and prenatal work.",
    city: "Lisbon",
    neighborhood: "Príncipe Real",
    address: "Rua da Escola Politécnica 42, Lisbon",
    currency: "EUR",
    rating: 4.9,
    reviewCount: 1284,
    priceLevel: 3,
    distanceKm: 0.8,
    mapX: 0.42,
    mapY: 0.38,
    gradient: "eucalyptus",
    gallery: ["eucalyptus", "mist", "sage", "ocean"],
    amenities: ["Steam room", "Relaxation lounge", "Herbal tea", "Showers", "Free Wi-Fi"],
    verified: true,
    openNow: true,
    hours: HOURS_STD,
    serviceIds: ["svc-deep-tissue", "svc-aroma", "svc-hot-stone", "svc-lymphatic"],
    productIds: ["prod-massage-oil", "prod-bath-salts"],
    programIds: [],
    staffIds: ["stf-sofia", "stf-rui"],
  },
  {
    id: "prana",
    name: "Prana Yoga & Meditation",
    vertical: "yoga",
    tagline: "Breathe. Move. Arrive.",
    about:
      "A light-filled studio offering vinyasa, yin, and guided meditation. Small classes, expert teachers, and a calm community of regulars. Mats and props provided.",
    city: "Lisbon",
    neighborhood: "Estrela",
    address: "Calçada da Estrela 110, Lisbon",
    currency: "EUR",
    rating: 4.8,
    reviewCount: 942,
    priceLevel: 2,
    distanceKm: 1.6,
    mapX: 0.32,
    mapY: 0.56,
    gradient: "sage",
    gallery: ["sage", "forest", "mist"],
    amenities: ["Mats provided", "Changing rooms", "Tea bar", "Beginner friendly"],
    verified: true,
    openNow: true,
    hours: HOURS_STD,
    serviceIds: ["svc-vinyasa", "svc-yin", "svc-meditation"],
    productIds: ["prod-yoga-mat"],
    programIds: ["prog-mindful-8"],
    staffIds: ["stf-ines", "stf-tomas"],
  },
  {
    id: "lumiere",
    name: "Lumière Skin Studio",
    vertical: "skin",
    tagline: "Considered, science-led skincare",
    about:
      "Results-driven facials, peels and LED therapy led by qualified aestheticians. Every treatment begins with a skin analysis and a personalised plan.",
    city: "Lisbon",
    neighborhood: "Chiado",
    address: "Rua Garrett 18, Lisbon",
    currency: "EUR",
    rating: 4.9,
    reviewCount: 671,
    priceLevel: 3,
    distanceKm: 2.1,
    mapX: 0.5,
    mapY: 0.46,
    gradient: "clay",
    gallery: ["clay", "blush", "sand"],
    amenities: ["Skin analysis", "LED therapy", "Vegan products", "Consultation"],
    verified: true,
    openNow: false,
    hours: HOURS_STD,
    serviceIds: ["svc-signature-facial", "svc-peel", "svc-led"],
    productIds: ["prod-serum", "prod-spf"],
    programIds: ["prog-glow-6"],
    staffIds: ["stf-clara"],
  },
  {
    id: "the-grove",
    name: "The Grove Hair & Beauty",
    vertical: "salon",
    tagline: "Craft cuts and colour",
    about:
      "A warm neighbourhood salon for precision cutting, balayage and treatments. Senior stylists, organic colour lines, and an unhurried chair-side experience.",
    city: "Lisbon",
    neighborhood: "Campo de Ourique",
    address: "Rua Ferreira Borges 76, Lisbon",
    currency: "EUR",
    rating: 4.7,
    reviewCount: 528,
    priceLevel: 2,
    distanceKm: 2.8,
    mapX: 0.24,
    mapY: 0.62,
    gradient: "blush",
    gallery: ["blush", "rose", "sand"],
    amenities: ["Organic colour", "Bridal", "Wheelchair access"],
    verified: true,
    openNow: true,
    hours: HOURS_STD,
    serviceIds: ["svc-cut", "svc-balayage"],
    productIds: [],
    programIds: [],
    staffIds: ["stf-marco"],
  },
  {
    id: "forma",
    name: "Forma Movement Studio",
    vertical: "fitness",
    tagline: "Strength, mobility, longevity",
    about:
      "Reformer pilates, functional strength and mobility classes in small groups, plus 1:1 personal training. Coaches focus on technique and long-term progress.",
    city: "Lisbon",
    neighborhood: "Avenidas Novas",
    address: "Av. da República 30, Lisbon",
    currency: "EUR",
    rating: 4.8,
    reviewCount: 1102,
    priceLevel: 2,
    distanceKm: 3.4,
    mapX: 0.58,
    mapY: 0.28,
    gradient: "ocean",
    gallery: ["ocean", "mist", "dusk"],
    amenities: ["Reformers", "Showers", "Lockers", "Personal training"],
    verified: true,
    openNow: true,
    hours: HOURS_STD,
    serviceIds: ["svc-reformer", "svc-strength", "svc-pt"],
    productIds: [],
    programIds: ["prog-strength-8"],
    staffIds: ["stf-diogo"],
  },
  {
    id: "equilibrio",
    name: "Equilíbrio Physiotherapy",
    vertical: "physio",
    tagline: "Move well, recover fully",
    about:
      "Evidence-based physiotherapy for injury, posture and chronic pain. Assessment-led care, manual therapy and tailored rehab programmes.",
    city: "Lisbon",
    neighborhood: "Saldanha",
    address: "Av. Miguel Bombarda 12, Lisbon",
    currency: "EUR",
    rating: 4.9,
    reviewCount: 412,
    priceLevel: 3,
    distanceKm: 4.0,
    mapX: 0.66,
    mapY: 0.34,
    gradient: "mist",
    gallery: ["mist", "ocean"],
    amenities: ["Assessment", "Manual therapy", "Rehab plans", "Insurance receipts"],
    verified: true,
    openNow: true,
    hours: HOURS_STD,
    serviceIds: ["svc-physio-assess", "svc-physio-followup"],
    productIds: [],
    programIds: [],
    staffIds: ["stf-helena"],
  },
  {
    id: "quiet-mind",
    name: "Quiet Mind Therapy",
    vertical: "therapy",
    tagline: "Space to feel better",
    about:
      "Confidential counselling and CBT with accredited therapists, in person or online. A calm, judgement-free space to work through stress, anxiety and life transitions.",
    city: "Lisbon",
    neighborhood: "Lapa",
    address: "Rua do Sacramento 8, Lisbon",
    currency: "EUR",
    rating: 4.9,
    reviewCount: 233,
    priceLevel: 2,
    distanceKm: 1.9,
    mapX: 0.38,
    mapY: 0.5,
    gradient: "lavender",
    gallery: ["lavender", "dusk", "mist"],
    amenities: ["Online sessions", "Accredited", "Evening slots"],
    verified: true,
    openNow: true,
    hours: HOURS_STD,
    serviceIds: ["svc-counselling"],
    productIds: [],
    programIds: [],
    staffIds: ["stf-ana"],
  },
  {
    id: "ayur-living",
    name: "Ayur Living",
    vertical: "ayurveda",
    tagline: "Ancient practice, modern care",
    about:
      "A traditional Ayurveda centre offering consultation with a Vaidya, Abhyanga and Shirodhara therapies, and structured multi-week reset programmes rooted in your dosha.",
    city: "Lisbon",
    neighborhood: "Alfama",
    address: "Rua dos Remédios 54, Lisbon",
    currency: "EUR",
    rating: 4.8,
    reviewCount: 318,
    priceLevel: 2,
    distanceKm: 3.1,
    mapX: 0.62,
    mapY: 0.52,
    gradient: "forest",
    gallery: ["forest", "sage", "amber"],
    amenities: ["Dosha consultation", "Herbal pharmacy", "Steam therapy"],
    verified: true,
    openNow: true,
    hours: HOURS_STD,
    serviceIds: ["svc-ayur-consult", "svc-abhyanga", "svc-shirodhara"],
    productIds: ["prod-herbal-tea"],
    programIds: ["prog-reset-21"],
    staffIds: ["stf-vaidya"],
  },
  {
    id: "amrit-retreat",
    name: "Amrit Wellness Retreat",
    vertical: "retreat",
    tagline: "A week to come home to yourself",
    about:
      "A residential wellness retreat on the Goan coast. Daily yoga and meditation, Ayurvedic cuisine, spa therapies and guided nature walks across lush gardens and quiet beaches.",
    city: "Goa",
    neighborhood: "Mandrem",
    address: "Mandrem Beach Road, Goa, India",
    currency: "INR",
    rating: 4.9,
    reviewCount: 486,
    priceLevel: 3,
    distanceKm: 0,
    mapX: 0.8,
    mapY: 0.72,
    gradient: "amber",
    gallery: ["amber", "forest", "sand", "ocean"],
    amenities: ["Full board", "Daily yoga", "Spa", "Beachfront", "Airport transfer"],
    verified: true,
    openNow: true,
    hours: HOURS_STD,
    serviceIds: [],
    productIds: [],
    programIds: [],
    staffIds: [],
    isResidential: true,
  },
  {
    id: "serenity-dubai",
    name: "Serenity Hammam & Spa",
    vertical: "spa",
    tagline: "Traditional hammam, modern luxury",
    about:
      "An award-winning hammam and spa in Downtown Dubai offering traditional Moroccan rituals, couples' suites and rooftop relaxation.",
    city: "Dubai",
    neighborhood: "Downtown",
    address: "Sheikh Mohammed bin Rashid Blvd, Dubai",
    currency: "AED",
    rating: 4.8,
    reviewCount: 1893,
    priceLevel: 3,
    distanceKm: 0,
    mapX: 0.86,
    mapY: 0.4,
    gradient: "dusk",
    gallery: ["dusk", "clay", "amber"],
    amenities: ["Hammam", "Couples suites", "Rooftop lounge", "Valet"],
    verified: true,
    openNow: true,
    hours: HOURS_STD,
    serviceIds: ["svc-hammam"],
    productIds: [],
    programIds: [],
    staffIds: [],
  },
];

/* ============================== Staff ============================== */

export const STAFF: Staff[] = [
  { id: "stf-sofia", businessId: "still-waters", name: "Sofia Marques", role: "Senior Massage Therapist", bio: "12 years specialising in deep tissue and sports recovery. Sofia tailors pressure to your body's needs.", rating: 4.9, reviewCount: 412, specialties: ["Deep tissue", "Sports", "Prenatal"], yearsExperience: 12, avatarGradient: "eucalyptus" },
  { id: "stf-rui", businessId: "still-waters", name: "Rui Tavares", role: "Massage Therapist", bio: "Calm, intuitive bodywork with a focus on relaxation and lymphatic drainage.", rating: 4.8, reviewCount: 286, specialties: ["Aromatherapy", "Lymphatic", "Hot stone"], yearsExperience: 7, avatarGradient: "ocean" },
  { id: "stf-ines", businessId: "prana", name: "Inês Costa", role: "Lead Yoga Teacher", bio: "RYT-500. Inês blends strong vinyasa with breath and a sense of play.", rating: 4.9, reviewCount: 388, specialties: ["Vinyasa", "Breathwork"], yearsExperience: 9, avatarGradient: "sage" },
  { id: "stf-tomas", businessId: "prana", name: "Tomás Lima", role: "Meditation Guide", bio: "Trained in mindfulness-based stress reduction. Gentle, grounding sessions.", rating: 4.8, reviewCount: 174, specialties: ["Meditation", "Yin"], yearsExperience: 6, avatarGradient: "lavender" },
  { id: "stf-clara", businessId: "lumiere", name: "Clara Nunes", role: "Lead Aesthetician", bio: "Skin-health obsessive. Clara builds realistic plans and never over-treats.", rating: 4.9, reviewCount: 301, specialties: ["Acne", "Anti-ageing", "Peels"], yearsExperience: 11, avatarGradient: "clay" },
  { id: "stf-marco", businessId: "the-grove", name: "Marco Silva", role: "Senior Stylist & Colourist", bio: "Balayage specialist with an eye for lived-in colour.", rating: 4.8, reviewCount: 257, specialties: ["Balayage", "Cutting"], yearsExperience: 14, avatarGradient: "blush" },
  { id: "stf-diogo", businessId: "forma", name: "Diogo Ferreira", role: "Head Coach", bio: "Strength & conditioning coach focused on technique and longevity.", rating: 4.9, reviewCount: 420, specialties: ["Strength", "Mobility"], yearsExperience: 10, avatarGradient: "ocean" },
  { id: "stf-helena", businessId: "equilibrio", name: "Helena Dias", role: "Physiotherapist", bio: "MSc Physiotherapy. Helena gets to the root cause and explains every step.", rating: 4.9, reviewCount: 203, specialties: ["Sports injury", "Posture", "Chronic pain"], yearsExperience: 13, avatarGradient: "mist" },
  { id: "stf-ana", businessId: "quiet-mind", name: "Dr. Ana Reis", role: "Clinical Psychologist", bio: "Accredited CBT therapist. Warm, practical and confidential.", rating: 5.0, reviewCount: 142, specialties: ["CBT", "Anxiety", "Stress"], yearsExperience: 15, avatarGradient: "lavender" },
  { id: "stf-vaidya", businessId: "ayur-living", name: "Dr. Priya Menon", role: "Ayurvedic Physician (Vaidya)", bio: "BAMS-qualified Vaidya. Priya designs reset programmes around your dosha.", rating: 4.9, reviewCount: 211, specialties: ["Dosha", "Panchakarma", "Nutrition"], yearsExperience: 18, avatarGradient: "forest" },
];

/* ============================== Services ============================== */

const eur = (n: number) => fromMajor(n, "EUR");
const inr = (n: number) => fromMajor(n, "INR");
const aed = (n: number) => fromMajor(n, "AED");

export const SERVICES: Service[] = [
  { id: "svc-deep-tissue", businessId: "still-waters", name: "Deep Tissue Massage", category: "Massage", description: "Firm, focused bodywork to release chronic tension in the back, neck and shoulders. Pressure tailored to you.", durationMin: 60, price: eur(85), variations: [ { name: "60 minutes", durationMin: 60, price: eur(85) }, { name: "90 minutes", durationMin: 90, price: eur(120) } ], includedItems: ["Consultation", "Warm towels", "Herbal tea after"], rating: 4.9, reviewCount: 642, gradient: "eucalyptus", popular: true },
  { id: "svc-aroma", businessId: "still-waters", name: "Aromatherapy Massage", category: "Massage", description: "A gentle, full-body massage with essential oil blends chosen for your mood — calming, uplifting or grounding.", durationMin: 60, price: eur(78), variations: [ { name: "60 minutes", durationMin: 60, price: eur(78) }, { name: "90 minutes", durationMin: 90, price: eur(110) } ], includedItems: ["Oil consultation", "Warm towels"], rating: 4.8, reviewCount: 318, gradient: "sage" },
  { id: "svc-hot-stone", businessId: "still-waters", name: "Hot Stone Therapy", category: "Massage", description: "Smooth basalt stones and warm oil melt deep muscle tension. Deeply restorative.", durationMin: 75, price: eur(98), variations: [ { name: "75 minutes", durationMin: 75, price: eur(98) } ], includedItems: ["Heated stones", "Aromatherapy", "Tea"], rating: 4.9, reviewCount: 209, gradient: "amber" },
  { id: "svc-lymphatic", businessId: "still-waters", name: "Lymphatic Drainage", category: "Massage", description: "Light, rhythmic massage to reduce puffiness and support circulation and recovery.", durationMin: 60, price: eur(80), variations: [ { name: "60 minutes", durationMin: 60, price: eur(80) } ], includedItems: ["Consultation", "Hydration"], rating: 4.7, reviewCount: 121, gradient: "mist" },
  { id: "svc-vinyasa", businessId: "prana", name: "Vinyasa Flow", category: "Class", description: "A dynamic, breath-led flow building heat and focus. All levels welcome; modifications offered throughout.", durationMin: 60, price: eur(18), variations: [ { name: "Drop-in", durationMin: 60, price: eur(18) } ], includedItems: ["Mat & props", "Tea after"], rating: 4.9, reviewCount: 512, gradient: "sage", popular: true },
  { id: "svc-yin", businessId: "prana", name: "Yin & Restore", category: "Class", description: "Slow, deep stretches held with support to release the connective tissue and quiet the nervous system.", durationMin: 75, price: eur(20), variations: [ { name: "Drop-in", durationMin: 75, price: eur(20) } ], includedItems: ["Mat & props", "Bolsters"], rating: 4.8, reviewCount: 244, gradient: "lavender" },
  { id: "svc-meditation", businessId: "prana", name: "Guided Meditation", category: "Class", description: "A 45-minute guided sit to steady the mind and breath. No experience needed.", durationMin: 45, price: eur(14), variations: [ { name: "Drop-in", durationMin: 45, price: eur(14) } ], includedItems: ["Cushions", "Blankets"], rating: 4.9, reviewCount: 167, gradient: "mist" },
  { id: "svc-signature-facial", businessId: "lumiere", name: "Signature Facial", category: "Facial", description: "A bespoke facial built around a live skin analysis — cleanse, exfoliate, mask, massage and finish.", durationMin: 60, price: eur(95), variations: [ { name: "60 minutes", durationMin: 60, price: eur(95) }, { name: "Express 30 minutes", durationMin: 30, price: eur(55) } ], includedItems: ["Skin analysis", "Personalised plan"], rating: 4.9, reviewCount: 389, gradient: "clay", popular: true },
  { id: "svc-peel", businessId: "lumiere", name: "Resurfacing Peel", category: "Treatment", description: "A medical-grade peel to smooth texture and brighten tone, with aftercare guidance.", durationMin: 45, price: eur(110), variations: [ { name: "45 minutes", durationMin: 45, price: eur(110) } ], includedItems: ["Consultation", "Aftercare kit"], rating: 4.8, reviewCount: 142, gradient: "blush" },
  { id: "svc-led", businessId: "lumiere", name: "LED Light Therapy", category: "Treatment", description: "Calming LED session to support collagen and reduce redness. A perfect add-on or stand-alone reset.", durationMin: 30, price: eur(45), variations: [ { name: "30 minutes", durationMin: 30, price: eur(45) } ], includedItems: ["Eye protection"], rating: 4.7, reviewCount: 98, gradient: "rose" },
  { id: "svc-cut", businessId: "the-grove", name: "Cut & Finish", category: "Hair", description: "Consultation, precision cut and a polished blow-dry finish with a senior stylist.", durationMin: 60, price: eur(48), variations: [ { name: "Senior stylist", durationMin: 60, price: eur(48) }, { name: "Director", durationMin: 60, price: eur(68) } ], includedItems: ["Consultation", "Wash", "Blow-dry"], rating: 4.7, reviewCount: 187, gradient: "blush" },
  { id: "svc-balayage", businessId: "the-grove", name: "Balayage & Gloss", category: "Colour", description: "Hand-painted, lived-in colour with a glossing treatment for shine. Includes toner.", durationMin: 150, price: eur(160), variations: [ { name: "Full", durationMin: 150, price: eur(160) }, { name: "Partial", durationMin: 120, price: eur(120) } ], includedItems: ["Consultation", "Gloss", "Blow-dry"], rating: 4.8, reviewCount: 142, gradient: "sand" },
  { id: "svc-reformer", businessId: "forma", name: "Reformer Pilates", category: "Class", description: "A small-group reformer class building core strength, control and mobility. Beginners and improvers.", durationMin: 50, price: eur(24), variations: [ { name: "Drop-in", durationMin: 50, price: eur(24) } ], includedItems: ["Reformer", "Grip socks available"], rating: 4.8, reviewCount: 398, gradient: "ocean", popular: true },
  { id: "svc-strength", businessId: "forma", name: "Functional Strength", category: "Class", description: "Coached small-group strength training with progressive loading and technique focus.", durationMin: 55, price: eur(22), variations: [ { name: "Drop-in", durationMin: 55, price: eur(22) } ], includedItems: ["All equipment"], rating: 4.8, reviewCount: 276, gradient: "dusk" },
  { id: "svc-pt", businessId: "forma", name: "1:1 Personal Training", category: "Training", description: "A private session built entirely around your goals, with a tailored plan to follow.", durationMin: 60, price: eur(60), variations: [ { name: "60 minutes", durationMin: 60, price: eur(60) }, { name: "Pack intro", durationMin: 45, price: eur(40) } ], includedItems: ["Assessment", "Take-home plan"], rating: 4.9, reviewCount: 132, gradient: "mist" },
  { id: "svc-physio-assess", businessId: "equilibrio", name: "Physio Assessment", category: "Assessment", description: "A thorough first assessment to diagnose and build your recovery plan.", durationMin: 60, price: eur(75), variations: [ { name: "Initial", durationMin: 60, price: eur(75) } ], includedItems: ["Assessment", "Plan", "Receipt for insurance"], rating: 4.9, reviewCount: 156, gradient: "mist" },
  { id: "svc-physio-followup", businessId: "equilibrio", name: "Physio Follow-up", category: "Treatment", description: "Hands-on treatment and progression of your rehab programme.", durationMin: 45, price: eur(60), variations: [ { name: "45 minutes", durationMin: 45, price: eur(60) } ], includedItems: ["Manual therapy", "Updated plan"], rating: 4.9, reviewCount: 142, gradient: "ocean" },
  { id: "svc-counselling", businessId: "quiet-mind", name: "Counselling Session", category: "Therapy", description: "A confidential 50-minute session, in person or online, with an accredited therapist.", durationMin: 50, price: eur(70), variations: [ { name: "In person", durationMin: 50, price: eur(70) }, { name: "Online", durationMin: 50, price: eur(65) } ], includedItems: ["Confidential", "Follow-up notes on request"], rating: 5.0, reviewCount: 88, gradient: "lavender" },
  { id: "svc-ayur-consult", businessId: "ayur-living", name: "Ayurvedic Consultation", category: "Consultation", description: "A dosha assessment with our Vaidya and a personalised wellness plan covering diet, routine and therapies.", durationMin: 60, price: eur(65), variations: [ { name: "Initial", durationMin: 60, price: eur(65) } ], includedItems: ["Dosha assessment", "Written plan"], rating: 4.9, reviewCount: 121, gradient: "forest", popular: true },
  { id: "svc-abhyanga", businessId: "ayur-living", name: "Abhyanga Massage", category: "Therapy", description: "A warm herbal-oil full-body massage in the Ayurvedic tradition to balance and nourish.", durationMin: 60, price: eur(72), variations: [ { name: "60 minutes", durationMin: 60, price: eur(72) } ], includedItems: ["Herbal oils", "Steam"], rating: 4.8, reviewCount: 96, gradient: "amber" },
  { id: "svc-shirodhara", businessId: "ayur-living", name: "Shirodhara", category: "Therapy", description: "A continuous, gentle stream of warm oil over the forehead — profoundly calming for the mind.", durationMin: 45, price: eur(80), variations: [ { name: "45 minutes", durationMin: 45, price: eur(80) } ], includedItems: ["Herbal oils", "Rest period"], rating: 4.9, reviewCount: 74, gradient: "sage" },
  { id: "svc-hammam", businessId: "serenity-dubai", name: "Traditional Hammam Ritual", category: "Ritual", description: "A 90-minute Moroccan hammam ritual — steam, black-soap cleanse, exfoliation and rhassoul clay.", durationMin: 90, price: aed(420), variations: [ { name: "Classic", durationMin: 90, price: aed(420) }, { name: "Royal", durationMin: 120, price: aed(620) } ], includedItems: ["Steam", "Exfoliation", "Clay wrap", "Mint tea"], rating: 4.8, reviewCount: 540, gradient: "dusk", popular: true },
];

/* ============================== Products ============================== */

export const PRODUCTS: Product[] = [
  { id: "prod-massage-oil", businessId: "still-waters", name: "Calm Body Oil", brand: "Still Waters", category: "Body", description: "A warming blend of sweet almond, lavender and frankincense to use at home between visits.", price: eur(32), rating: 4.8, reviewCount: 134, gradient: "sage", variants: ["100ml", "200ml"], inStock: true },
  { id: "prod-bath-salts", businessId: "still-waters", name: "Restore Bath Salts", brand: "Still Waters", category: "Body", description: "Magnesium-rich Epsom salts with eucalyptus to ease tired muscles.", price: eur(18), compareAtPrice: eur(24), rating: 4.7, reviewCount: 86, gradient: "eucalyptus", variants: ["500g"], inStock: true },
  { id: "prod-yoga-mat", businessId: "prana", name: "Grip Cork Yoga Mat", brand: "Prana", category: "Equipment", description: "A natural cork and rubber mat with excellent grip, even in heated practice.", price: eur(68), rating: 4.9, reviewCount: 211, gradient: "forest", variants: ["Standard", "Long"], inStock: true },
  { id: "prod-serum", businessId: "lumiere", name: "Vitamin C Serum", brand: "Lumière", category: "Skincare", description: "A stable 15% vitamin C serum to brighten and protect. Aesthetician-formulated.", price: eur(54), rating: 4.9, reviewCount: 302, gradient: "clay", variants: ["30ml"], inStock: true },
  { id: "prod-spf", businessId: "lumiere", name: "Daily Mineral SPF 50", brand: "Lumière", category: "Skincare", description: "A weightless mineral sunscreen that sits beautifully under makeup. No white cast.", price: eur(38), rating: 4.8, reviewCount: 176, gradient: "sand", variants: ["50ml"], inStock: true },
  { id: "prod-herbal-tea", businessId: "ayur-living", name: "Tridosha Herbal Tea", brand: "Ayur Living", category: "Wellness", description: "A balancing caffeine-free blend of tulsi, ginger and fennel for daily calm.", price: eur(16), rating: 4.7, reviewCount: 64, gradient: "amber", variants: ["20 bags", "Loose 100g"], inStock: true },
  { id: "prod-candle", businessId: "still-waters", name: "Quiet Hours Candle", brand: "Still Waters", category: "Home", description: "A hand-poured soy candle — cedar, sage and a whisper of citrus. 45-hour burn.", price: eur(28), rating: 4.9, reviewCount: 121, gradient: "stone", variants: ["220g"], inStock: true },
  { id: "prod-roller", businessId: "forma", name: "Recovery Foam Roller", brand: "Forma", category: "Equipment", description: "A medium-density roller for mobility work and post-session recovery at home.", price: eur(34), rating: 4.6, reviewCount: 58, gradient: "ocean", variants: ["Standard"], inStock: false },
];

/* ============================== Programs ============================== */

export const PROGRAMS: Program[] = [
  {
    id: "prog-reset-21",
    businessId: "ayur-living",
    name: "21-Day Ayurvedic Reset",
    category: "Detox & Reset",
    summary: "A guided three-week reset to rebuild energy, digestion and sleep.",
    description:
      "Built around your dosha, this programme combines an initial consultation, a sequence of Abhyanga and Shirodhara therapies, weekly check-ins and a daily routine to follow at home. Designed to leave you lighter, clearer and more rested.",
    durationLabel: "21 days",
    sessionsTotal: 9,
    price: eur(540),
    gradient: "forest",
    components: [
      { title: "Dosha consultation", type: "consultation", durationMin: 60 },
      { title: "Abhyanga massage ×4", type: "service", durationMin: 60 },
      { title: "Shirodhara ×2", type: "service", durationMin: 45 },
      { title: "Weekly check-in ×2", type: "assessment", durationMin: 30 },
      { title: "Herbal tea & routine plan", type: "product" },
    ],
  },
  {
    id: "prog-strength-8",
    businessId: "forma",
    name: "8-Week Strength Foundations",
    category: "Fitness",
    summary: "Build real strength and confidence from the ground up.",
    description:
      "A progressive eight-week programme of coached small-group strength sessions twice weekly, with an assessment at the start and end and a simple home-mobility routine. Perfect if you're returning to training or starting fresh.",
    durationLabel: "8 weeks",
    sessionsTotal: 18,
    price: eur(360),
    gradient: "ocean",
    components: [
      { title: "Movement assessment", type: "assessment", durationMin: 45 },
      { title: "Strength sessions ×16", type: "class", durationMin: 55 },
      { title: "Final re-assessment", type: "assessment", durationMin: 45 },
    ],
  },
  {
    id: "prog-mindful-8",
    businessId: "prana",
    name: "8-Week Mindfulness Course",
    category: "Mind",
    summary: "Learn to steady the mind with a structured MBSR-style course.",
    description:
      "A weekly group course teaching practical mindfulness and breathwork you can carry into daily life, with guided recordings between sessions.",
    durationLabel: "8 weeks",
    sessionsTotal: 8,
    price: eur(220),
    gradient: "lavender",
    components: [
      { title: "Weekly group session ×8", type: "class", durationMin: 90 },
      { title: "Guided home practice", type: "product" },
    ],
  },
  {
    id: "prog-glow-6",
    businessId: "lumiere",
    name: "6-Week Glow Programme",
    category: "Skin",
    summary: "A structured course of facials and peels for visibly clearer skin.",
    description:
      "A six-week skin programme combining a signature facial, two resurfacing peels and LED therapy, with a personalised home routine and progress photos.",
    durationLabel: "6 weeks",
    sessionsTotal: 6,
    price: eur(420),
    gradient: "clay",
    components: [
      { title: "Skin consultation", type: "consultation", durationMin: 30 },
      { title: "Signature facial ×2", type: "service", durationMin: 60 },
      { title: "Resurfacing peel ×2", type: "service", durationMin: 45 },
      { title: "LED therapy ×1", type: "service", durationMin: 30 },
    ],
  },
];

/* ============================== Membership / Package plans ============================== */

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  { id: "plan-prana-unlimited", businessId: "prana", name: "Unlimited Yoga", price: eur(89), period: "month", benefits: ["Unlimited classes", "Free mat hire", "10% off workshops", "Guest pass monthly"], discountPercent: 10, gradient: "sage", highlight: true },
  { id: "plan-prana-10", businessId: "prana", name: "10 Classes / month", price: eur(64), period: "month", benefits: ["10 classes monthly", "Free mat hire", "Rollover up to 3"], gradient: "mist" },
  { id: "plan-sw-club", businessId: "still-waters", name: "Spa Club", price: eur(120), period: "month", benefits: ["One massage monthly", "15% off treatments", "Priority booking", "Free steam access"], discountPercent: 15, gradient: "eucalyptus", highlight: true },
  { id: "plan-forma-flex", businessId: "forma", name: "Movement Flex", price: eur(99), period: "month", benefits: ["12 classes monthly", "1 PT session", "Free workshops"], gradient: "ocean" },
];

export const PACKAGE_PLANS: PackagePlan[] = [
  { id: "pkg-sw-10", businessId: "still-waters", name: "10 Massages", sessionsTotal: 10, price: eur(720), validityLabel: "Valid 12 months", scope: "Any 60-min massage", gradient: "eucalyptus" },
  { id: "pkg-lum-6", businessId: "lumiere", name: "6 Facials", sessionsTotal: 6, price: eur(480), validityLabel: "Valid 9 months", scope: "Signature facial", gradient: "clay" },
  { id: "pkg-forma-10", businessId: "forma", name: "10 Reformer Classes", sessionsTotal: 10, price: eur(210), validityLabel: "Valid 6 months", scope: "Reformer Pilates", gradient: "ocean" },
];

/* ============================== Reviews ============================== */

export const REVIEWS: Review[] = [
  { id: "rev-1", businessId: "still-waters", serviceId: "svc-deep-tissue", staffId: "stf-sofia", author: "Helena R.", rating: 5, dateIso: "2026-06-08T10:00:00", body: "Sofia is exceptional — she found exactly where I hold tension and I left feeling completely renewed. The space is so calm.", helpful: 24, verified: true },
  { id: "rev-2", businessId: "still-waters", serviceId: "svc-aroma", author: "Pedro M.", rating: 5, dateIso: "2026-05-30T14:00:00", body: "Booked the aromatherapy massage to unwind after a hard week. Faultless from the tea on arrival to the after-care.", helpful: 12, verified: true },
  { id: "rev-3", businessId: "still-waters", serviceId: "svc-deep-tissue", author: "Aisha K.", rating: 4, dateIso: "2026-05-18T09:00:00", body: "Really good massage and lovely therapists. Took off a star only because it ran a few minutes late.", helpful: 5, verified: true },
  { id: "rev-4", businessId: "prana", serviceId: "svc-vinyasa", staffId: "stf-ines", author: "Tomás G.", rating: 5, dateIso: "2026-06-10T07:30:00", body: "Inês's flow is the highlight of my week. Challenging but never intimidating, and the studio light in the morning is gorgeous.", helpful: 31, verified: true },
  { id: "rev-5", businessId: "prana", serviceId: "svc-meditation", author: "Marta S.", rating: 5, dateIso: "2026-06-02T18:00:00", body: "The guided meditation genuinely helped my sleep. A pocket of stillness in a busy city.", helpful: 9, verified: true },
  { id: "rev-6", businessId: "lumiere", serviceId: "svc-signature-facial", staffId: "stf-clara", author: "Carolina V.", rating: 5, dateIso: "2026-06-12T16:00:00", body: "Clara actually listens and never pushes products. My skin has never looked better. Worth every cent.", helpful: 41, verified: true },
  { id: "rev-7", businessId: "lumiere", serviceId: "svc-peel", author: "Inês P.", rating: 4, dateIso: "2026-05-22T11:00:00", body: "Great results from the peel. A little redness for a day as expected — aftercare advice was spot on.", helpful: 7, verified: true },
  { id: "rev-8", businessId: "forma", serviceId: "svc-reformer", staffId: "stf-diogo", author: "Rui A.", rating: 5, dateIso: "2026-06-09T12:00:00", body: "Small classes mean real attention. My posture and core strength have transformed in two months.", helpful: 18, verified: true },
  { id: "rev-9", businessId: "ayur-living", serviceId: "svc-ayur-consult", staffId: "stf-vaidya", author: "Sofia L.", rating: 5, dateIso: "2026-05-28T15:00:00", body: "Dr. Menon's consultation was the most thorough wellness conversation I've ever had. The reset programme changed my routine.", helpful: 22, verified: true },
  { id: "rev-10", businessId: "the-grove", serviceId: "svc-balayage", staffId: "stf-marco", author: "Beatriz C.", rating: 5, dateIso: "2026-06-04T13:00:00", body: "Marco understood exactly the lived-in colour I wanted. Best balayage I've had in Lisbon.", helpful: 14, verified: true },
  { id: "rev-11", businessId: "equilibrio", serviceId: "svc-physio-assess", staffId: "stf-helena", author: "João F.", rating: 5, dateIso: "2026-05-15T10:00:00", body: "Helena diagnosed a long-standing issue two other clinics missed. Clear plan, real progress.", helpful: 19, verified: true },
  { id: "rev-12", businessId: "quiet-mind", serviceId: "svc-counselling", staffId: "stf-ana", author: "Anonymous", rating: 5, dateIso: "2026-06-01T17:00:00", body: "A warm, safe space. Dr. Reis gave me practical tools I use every day. Grateful I reached out.", helpful: 11, verified: true },
];

/* ============================== Bookings ============================== */

export const BOOKINGS: Booking[] = [
  { id: "bk-1", businessId: "still-waters", businessName: "Still Waters Spa", serviceId: "svc-deep-tissue", serviceName: "Deep Tissue Massage", staffId: "stf-sofia", staffName: "Sofia Marques", startIso: "2026-06-19T18:00:00", endIso: "2026-06-19T19:00:00", status: "confirmed", total: eur(85), paidWith: { kind: "card", label: "Visa ·· 4242" }, locationName: "Príncipe Real", address: "Rua da Escola Politécnica 42, Lisbon", notes: "Focus on lower back, please.", cancellationWindowHours: 24, gradient: "eucalyptus" },
  { id: "bk-2", businessId: "prana", businessName: "Prana Yoga & Meditation", serviceId: "svc-vinyasa", serviceName: "Vinyasa Flow", staffId: "stf-ines", staffName: "Inês Costa", startIso: "2026-06-20T09:30:00", endIso: "2026-06-20T10:30:00", status: "upcoming", total: eur(0), paidWith: { kind: "membership", membershipId: "mem-prana", label: "Unlimited Yoga" }, locationName: "Estrela", address: "Calçada da Estrela 110, Lisbon", cancellationWindowHours: 6, gradient: "sage" },
  { id: "bk-3", businessId: "ayur-living", businessName: "Ayur Living", serviceId: "svc-abhyanga", serviceName: "Abhyanga Massage", staffId: "stf-vaidya", staffName: "Dr. Priya Menon", startIso: "2026-06-24T16:00:00", endIso: "2026-06-24T17:00:00", status: "upcoming", total: eur(0), paidWith: { kind: "free", label: "Part of your 21-Day Reset" }, locationName: "Alfama", address: "Rua dos Remédios 54, Lisbon", notes: "Session 5 of your programme.", cancellationWindowHours: 24, gradient: "amber" },
  { id: "bk-4", businessId: "lumiere", businessName: "Lumière Skin Studio", serviceId: "svc-signature-facial", serviceName: "Signature Facial", staffId: "stf-clara", staffName: "Clara Nunes", startIso: "2026-06-12T15:00:00", endIso: "2026-06-12T16:00:00", status: "completed", total: eur(95), paidWith: { kind: "card", label: "Visa ·· 4242" }, locationName: "Chiado", address: "Rua Garrett 18, Lisbon", cancellationWindowHours: 24, gradient: "clay" },
  { id: "bk-5", businessId: "still-waters", businessName: "Still Waters Spa", serviceId: "svc-deep-tissue", serviceName: "Deep Tissue Massage", staffId: "stf-sofia", staffName: "Sofia Marques", startIso: "2026-06-05T18:30:00", endIso: "2026-06-05T19:30:00", status: "completed", total: eur(0), paidWith: { kind: "package", packageId: "pk-sw", label: "10 Massages package" }, locationName: "Príncipe Real", address: "Rua da Escola Politécnica 42, Lisbon", cancellationWindowHours: 24, gradient: "eucalyptus" },
  { id: "bk-6", businessId: "forma", businessName: "Forma Movement Studio", serviceId: "svc-reformer", serviceName: "Reformer Pilates", staffId: "stf-diogo", staffName: "Diogo Ferreira", startIso: "2026-06-16T08:00:00", endIso: "2026-06-16T08:50:00", status: "completed", total: eur(0), paidWith: { kind: "membership", membershipId: "mem-forma", label: "Movement Flex" }, locationName: "Avenidas Novas", address: "Av. da República 30, Lisbon", cancellationWindowHours: 6, gradient: "ocean" },
  { id: "bk-7", businessId: "equilibrio", businessName: "Equilíbrio Physiotherapy", serviceId: "svc-physio-assess", serviceName: "Physio Assessment", staffId: "stf-helena", staffName: "Helena Dias", startIso: "2026-05-20T11:00:00", endIso: "2026-05-20T12:00:00", status: "completed", total: eur(75), paidWith: { kind: "card", label: "Visa ·· 4242" }, locationName: "Saldanha", address: "Av. Miguel Bombarda 12, Lisbon", cancellationWindowHours: 24, gradient: "mist" },
  { id: "bk-8", businessId: "the-grove", businessName: "The Grove Hair & Beauty", serviceId: "svc-cut", serviceName: "Cut & Finish", staffId: "stf-marco", staffName: "Marco Silva", startIso: "2026-04-30T17:00:00", endIso: "2026-04-30T18:00:00", status: "completed", total: eur(48), paidWith: { kind: "card", label: "Visa ·· 4242" }, locationName: "Campo de Ourique", address: "Rua Ferreira Borges 76, Lisbon", cancellationWindowHours: 24, gradient: "blush" },
];

/* ============================== Active programs (enrolled) ============================== */

export const ACTIVE_PROGRAMS: ActiveProgram[] = [
  {
    id: "ap-1",
    programId: "prog-reset-21",
    businessId: "ayur-living",
    enrolledIso: "2026-06-08",
    sessionsCompleted: 4,
    sessionsTotal: 9,
    nextSessionIso: "2026-06-24T16:00:00",
    status: "active",
    milestones: [
      { id: "ms-1", title: "Consultation complete", description: "Dosha assessed — Pitta-Vata. Plan created.", dateIso: "2026-06-08", achieved: true },
      { id: "ms-2", title: "Week 1 reset", description: "First Abhyanga and routine established.", dateIso: "2026-06-13", achieved: true },
      { id: "ms-3", title: "Halfway check-in", description: "Sleep and digestion review with Dr. Menon.", dateIso: "2026-06-22", achieved: false },
      { id: "ms-4", title: "Programme complete", description: "Final review and ongoing plan.", dateIso: "2026-06-29", achieved: false },
    ],
  },
  {
    id: "ap-2",
    programId: "prog-strength-8",
    businessId: "forma",
    enrolledIso: "2026-05-26",
    sessionsCompleted: 7,
    sessionsTotal: 18,
    nextSessionIso: "2026-06-21T08:00:00",
    status: "active",
    milestones: [
      { id: "ms-5", title: "Baseline assessment", description: "Movement screen and starting numbers logged.", dateIso: "2026-05-26", achieved: true },
      { id: "ms-6", title: "First 5 sessions", description: "Technique foundations established.", dateIso: "2026-06-12", achieved: true },
      { id: "ms-7", title: "Mid-point check", description: "Load progression review.", dateIso: "2026-06-26", achieved: false },
      { id: "ms-8", title: "Final re-assessment", description: "Measure your progress.", dateIso: "2026-07-21", achieved: false },
    ],
  },
];

/* ============================== Wallet holdings ============================== */

export const CONSUMER_MEMBERSHIPS: ConsumerMembership[] = [
  { id: "mem-prana", planId: "plan-prana-unlimited", businessId: "prana", name: "Unlimited Yoga", status: "active", startIso: "2025-09-01", renewsIso: "2026-07-01", price: eur(89), period: "month", benefits: ["Unlimited classes", "Free mat hire", "10% off workshops", "Monthly guest pass"], gradient: "sage" },
  { id: "mem-sw", planId: "plan-sw-club", businessId: "still-waters", name: "Spa Club", status: "expiring", startIso: "2025-12-01", renewsIso: "2026-06-30", price: eur(120), period: "month", benefits: ["One massage monthly", "15% off treatments", "Priority booking", "Free steam"], gradient: "eucalyptus" },
];

export const CONSUMER_PACKAGES: ConsumerPackage[] = [
  { id: "pk-sw", businessId: "still-waters", name: "10 Massages", sessionsTotal: 10, sessionsUsed: 6, purchasedIso: "2026-01-15", expiryIso: "2027-01-15", status: "active", gradient: "eucalyptus", scope: "Any 60-min massage", redemptions: [ { dateIso: "2026-06-05", serviceName: "Deep Tissue Massage" }, { dateIso: "2026-05-12", serviceName: "Aromatherapy Massage" }, { dateIso: "2026-04-20", serviceName: "Deep Tissue Massage" } ] },
  { id: "pk-lum", businessId: "lumiere", name: "6 Facials", sessionsTotal: 6, sessionsUsed: 5, purchasedIso: "2025-11-10", expiryIso: "2026-07-10", status: "expiring", gradient: "clay", scope: "Signature facial", redemptions: [ { dateIso: "2026-06-12", serviceName: "Signature Facial" }, { dateIso: "2026-05-01", serviceName: "Signature Facial" } ] },
];

export const CONSUMER_SUBSCRIPTIONS: ConsumerSubscription[] = [
  { id: "sub-forma", businessId: "forma", name: "Movement Flex", price: eur(99), period: "month", status: "active", startIso: "2026-02-01", renewsIso: "2026-07-01", benefits: ["12 classes monthly", "1 PT session", "Free workshops"], gradient: "ocean" },
];

export const GIFT_CARDS: GiftCard[] = [
  { id: "gc-1", code: "ZENSA-7QF4-2K9P", balance: eur(60), originalValue: eur(100), fromName: "Beatriz", message: "Happy birthday — treat yourself! 🌿", expiryIso: "2027-03-01", gradient: "blush" },
];

export const STORE_CREDITS: StoreCredit[] = [
  { id: "cr-1", businessId: "still-waters", businessName: "Still Waters Spa", balance: eur(15), reason: "Goodwill credit — late start on 5 Jun", earnedIso: "2026-06-05" },
];

export const LOYALTY: Loyalty = {
  points: 2480,
  tier: "Bloom",
  nextTier: "Radiance",
  pointsToNextTier: 520,
  activity: [
    { dateIso: "2026-06-16", label: "Reformer Pilates — Forma", points: 24 },
    { dateIso: "2026-06-12", label: "Signature Facial — Lumière", points: 95 },
    { dateIso: "2026-06-05", label: "Deep Tissue Massage — Still Waters", points: 60 },
    { dateIso: "2026-05-28", label: "Redeemed: €10 off", points: -200 },
    { dateIso: "2026-05-20", label: "Physio Assessment — Equilíbrio", points: 75 },
  ],
};

/* ============================== Stays / Retreats ============================== */

export const STAYS: Stay[] = [
  {
    id: "stay-amrit",
    businessId: "amrit-retreat",
    name: "7-Night Restorative Retreat",
    location: "Mandrem, Goa",
    summary: "Daily yoga, Ayurvedic cuisine and spa therapies on a quiet stretch of Goan coast.",
    description:
      "Arrive depleted, leave restored. This seven-night programme blends twice-daily yoga and meditation, a personalised Ayurvedic consultation, three spa therapies, full-board sattvic cuisine and unhurried time by the sea. Suitable for all levels.",
    nights: 7,
    fromPrice: inr(96000),
    gradient: "amber",
    gallery: ["amber", "forest", "ocean", "sand"],
    rating: 4.9,
    reviewCount: 486,
    highlights: ["Twice-daily yoga", "Ayurvedic consultation", "3 spa therapies", "Full board", "Beachfront"],
    inclusions: ["Accommodation (7 nights)", "All meals", "Daily classes", "3 treatments", "Airport transfer", "Nature walks"],
    roomTypes: [
      { name: "Garden Room", description: "A serene room opening onto the gardens.", pricePerNight: inr(13700), capacity: 2 },
      { name: "Sea-View Suite", description: "A spacious suite with a private balcony and sea view.", pricePerNight: inr(19500), capacity: 2 },
    ],
    sampleItinerary: [
      { day: 1, label: "Arrival", items: [ { time: "14:00", title: "Check-in & welcome tea", type: "free" }, { time: "16:00", title: "Ayurvedic consultation", type: "consultation" }, { time: "19:00", title: "Welcome dinner", type: "meal" } ] },
      { day: 2, label: "Settle in", items: [ { time: "07:00", title: "Morning yoga", type: "class" }, { time: "08:30", title: "Breakfast", type: "meal" }, { time: "11:00", title: "Abhyanga massage", type: "service" }, { time: "17:30", title: "Meditation & sunset", type: "class" } ] },
      { day: 3, label: "Deepen", items: [ { time: "07:00", title: "Morning yoga", type: "class" }, { time: "10:00", title: "Beach nature walk", type: "free" }, { time: "16:00", title: "Shirodhara therapy", type: "service" } ] },
    ],
  },
  {
    id: "stay-alps",
    businessId: "amrit-retreat",
    name: "3-Night Mountain Reset",
    location: "Serra da Estrela, Portugal",
    summary: "A short alpine reset — hiking, breathwork and thermal baths.",
    description:
      "A restorative long weekend in the mountains with guided hikes, breathwork, thermal bathing and nourishing local food. A gentle way to disconnect.",
    nights: 3,
    fromPrice: eur(690),
    gradient: "forest",
    gallery: ["forest", "mist", "sage"],
    rating: 4.7,
    reviewCount: 132,
    highlights: ["Guided hikes", "Breathwork", "Thermal baths", "Half board"],
    inclusions: ["Accommodation (3 nights)", "Breakfast & dinner", "Daily activities", "Thermal access"],
    roomTypes: [
      { name: "Lodge Room", description: "A cosy room with mountain views.", pricePerNight: eur(230), capacity: 2 },
    ],
    sampleItinerary: [
      { day: 1, label: "Arrival", items: [ { time: "15:00", title: "Check-in", type: "free" }, { time: "18:00", title: "Welcome breathwork", type: "class" } ] },
      { day: 2, label: "Explore", items: [ { time: "08:00", title: "Guided hike", type: "free" }, { time: "16:00", title: "Thermal baths", type: "free" } ] },
    ],
  },
];

export const CONSUMER_STAYS: ConsumerStay[] = [
  { id: "cs-1", stayId: "stay-amrit", checkInIso: "2026-07-15", checkOutIso: "2026-07-22", roomType: "Sea-View Suite", guests: 1, status: "confirmed", total: inr(136500) },
];

/* ============================== Journey ============================== */

export const TIMELINE: TimelineEvent[] = [
  { id: "tl-1", dateIso: "2026-06-16T08:00:00", type: "visit", title: "Reformer Pilates", businessName: "Forma Movement Studio", businessId: "forma", detail: "Session 7 of Strength Foundations", gradient: "ocean" },
  { id: "tl-2", dateIso: "2026-06-13T11:00:00", type: "milestone", title: "Week 1 of your Ayurvedic Reset complete", businessName: "Ayur Living", businessId: "ayur-living", detail: "Routine established, first Abhyanga done", gradient: "forest" },
  { id: "tl-3", dateIso: "2026-06-12T15:00:00", type: "visit", title: "Signature Facial", businessName: "Lumière Skin Studio", businessId: "lumiere", detail: "with Clara Nunes", gradient: "clay" },
  { id: "tl-4", dateIso: "2026-06-08T16:00:00", type: "program", title: "Enrolled in 21-Day Ayurvedic Reset", businessName: "Ayur Living", businessId: "ayur-living", gradient: "forest" },
  { id: "tl-5", dateIso: "2026-06-05T18:30:00", type: "visit", title: "Deep Tissue Massage", businessName: "Still Waters Spa", businessId: "still-waters", detail: "Redeemed from your 10 Massages package", gradient: "eucalyptus" },
  { id: "tl-6", dateIso: "2026-05-28T15:00:00", type: "assessment", title: "Dosha assessment: Pitta-Vata", businessName: "Ayur Living", businessId: "ayur-living", detail: "Personalised plan created", gradient: "amber" },
  { id: "tl-7", dateIso: "2026-05-26T09:00:00", type: "program", title: "Started 8-Week Strength Foundations", businessName: "Forma Movement Studio", businessId: "forma", gradient: "ocean" },
  { id: "tl-8", dateIso: "2026-05-20T11:00:00", type: "visit", title: "Physio Assessment", businessName: "Equilíbrio Physiotherapy", businessId: "equilibrio", detail: "Lower-back recovery plan started", gradient: "mist" },
  { id: "tl-9", dateIso: "2026-05-12T18:00:00", type: "review", title: "You reviewed Still Waters Spa", businessName: "Still Waters Spa", businessId: "still-waters", detail: "★★★★★ \"Faultless from start to finish\"", gradient: "eucalyptus" },
  { id: "tl-10", dateIso: "2026-04-30T17:00:00", type: "visit", title: "Cut & Finish", businessName: "The Grove Hair & Beauty", businessId: "the-grove", detail: "with Marco Silva", gradient: "blush" },
  { id: "tl-11", dateIso: "2026-03-10T10:00:00", type: "milestone", title: "Joined Zensa", detail: "Your wellness journey begins", gradient: "clay" },
];

export const WELLNESS_RECORDS: WellnessRecord[] = [
  { id: "wr-1", type: "allergy", title: "Allergy", value: "Sensitivity to lavender essential oil", source: "Self-reported", dateIso: "2024-03-12", sharedWith: ["still-waters", "ayur-living"], ownedByConsumer: true },
  { id: "wr-2", type: "assessment", title: "Ayurvedic constitution", value: "Pitta-Vata (dosha assessment)", source: "Ayur Living", dateIso: "2026-05-28", sharedWith: ["ayur-living"], ownedByConsumer: false },
  { id: "wr-3", type: "note", title: "Lower-back recovery", value: "Avoid deep pressure on the right lumbar region while in rehab", source: "Equilíbrio Physiotherapy", dateIso: "2026-05-20", sharedWith: ["equilibrio", "still-waters"], ownedByConsumer: false },
  { id: "wr-4", type: "preference", title: "Massage preference", value: "Firm pressure, minimal conversation, focus on shoulders", source: "Self-reported", dateIso: "2025-08-01", sharedWith: ["still-waters"], ownedByConsumer: true },
  { id: "wr-5", type: "measurement", title: "Resting baseline", value: "Strength assessment logged at Forma", source: "Forma Movement Studio", dateIso: "2026-05-26", sharedWith: ["forma"], ownedByConsumer: false },
  { id: "wr-6", type: "preference", title: "Skin type", value: "Combination, sensitive; using vitamin C + SPF routine", source: "Lumière Skin Studio", dateIso: "2026-06-12", sharedWith: ["lumiere"], ownedByConsumer: false },
];

export const PASSPORT_SHARES: PassportShare[] = [
  { id: "ps-1", businessId: "still-waters", businessName: "Still Waters Spa", scope: ["Allergies", "Massage preferences", "Lower-back note"], grantedIso: "2024-03-12", status: "active" },
  { id: "ps-2", businessId: "ayur-living", businessName: "Ayur Living", scope: ["Allergies", "Dosha assessment"], grantedIso: "2026-05-28", status: "active" },
  { id: "ps-3", businessId: "equilibrio", businessName: "Equilíbrio Physiotherapy", scope: ["Lower-back recovery note"], grantedIso: "2026-05-20", status: "active" },
  { id: "ps-4", businessId: "the-grove", businessName: "The Grove Hair & Beauty", scope: ["Contact details"], grantedIso: "2026-04-30", status: "revoked" },
];

/* ============================== Notifications ============================== */

export const NOTIFICATIONS: Notification[] = [
  { id: "nt-1", type: "reminder", title: "Massage today at 6:00 PM", body: "Your Deep Tissue Massage with Sofia at Still Waters Spa is today. Tap for directions.", dateIso: "2026-06-19T09:00:00", read: false },
  { id: "nt-2", type: "program", title: "Halfway check-in coming up", body: "Your 21-Day Ayurvedic Reset check-in with Dr. Menon is on 22 Jun.", dateIso: "2026-06-18T10:00:00", read: false },
  { id: "nt-3", type: "membership", title: "Spa Club renews in 11 days", body: "Your Still Waters Spa Club renews on 30 Jun for €120.", dateIso: "2026-06-17T08:00:00", read: false },
  { id: "nt-4", type: "loyalty", title: "You're 520 points from Radiance", body: "Two more visits could unlock your next tier and its perks.", dateIso: "2026-06-15T12:00:00", read: true },
  { id: "nt-5", type: "review", title: "How was your facial?", body: "Share a few words about your visit to Lumière Skin Studio.", dateIso: "2026-06-12T18:00:00", read: true },
  { id: "nt-6", type: "offer", title: "Your package is expiring", body: "You have 1 facial left on your Lumière package — valid until 10 Jul.", dateIso: "2026-06-10T09:00:00", read: true },
];

/* ============================== Profile & system ============================== */

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "pm-1", brand: "Visa", last4: "4242", expiry: "08/27", isDefault: true },
  { id: "pm-2", brand: "Mastercard", last4: "5588", expiry: "11/26", isDefault: false },
];

export const CONSENTS: Consent[] = [
  { id: "cn-1", type: "passport", label: "Wellness Passport", description: "Allow businesses you choose to access parts of your wellness record. You control every share.", granted: true, required: false },
  { id: "cn-2", type: "marketing", label: "Offers & marketing", description: "Receive occasional offers and news from Zensa and providers you follow.", granted: false },
  { id: "cn-3", type: "personalization", label: "Personalised recommendations", description: "Use your activity to suggest providers and services you might like.", granted: true },
  { id: "cn-4", type: "analytics", label: "Usage analytics", description: "Help improve Zensa with anonymous usage data.", granted: true },
];

export const DEVICES: Device[] = [
  { id: "dv-1", name: "iPhone 16 Pro", location: "Lisbon, PT", lastActiveIso: "2026-06-19T08:30:00", current: true },
  { id: "dv-2", name: "MacBook Air", location: "Lisbon, PT", lastActiveIso: "2026-06-17T20:10:00", current: false },
];

export const ORDERS: Order[] = [
  { id: "ord-1", dateIso: "2026-06-12T16:10:00", businessName: "Lumière Skin Studio", status: "ready", lines: [ { productName: "Vitamin C Serum", variant: "30ml", qty: 1, price: eur(54) }, { productName: "Daily Mineral SPF 50", variant: "50ml", qty: 1, price: eur(38) } ], total: eur(92), fulfilment: "pickup" },
  { id: "ord-2", dateIso: "2026-05-02T11:00:00", businessName: "Still Waters Spa", status: "completed", lines: [ { productName: "Calm Body Oil", variant: "100ml", qty: 1, price: eur(32) } ], total: eur(32), fulfilment: "pickup" },
];

/* ============================== Discovery taxonomy ============================== */

export const CATEGORIES: Category[] = [
  { id: "cat-spa", label: "Spa & Massage", vertical: "spa", gradient: "eucalyptus" },
  { id: "cat-yoga", label: "Yoga", vertical: "yoga", gradient: "sage" },
  { id: "cat-skin", label: "Skin & Facials", vertical: "skin", gradient: "clay" },
  { id: "cat-salon", label: "Hair & Beauty", vertical: "salon", gradient: "blush" },
  { id: "cat-fitness", label: "Fitness", vertical: "fitness", gradient: "ocean" },
  { id: "cat-ayurveda", label: "Ayurveda", vertical: "ayurveda", gradient: "forest" },
  { id: "cat-physio", label: "Physio", vertical: "physio", gradient: "mist" },
  { id: "cat-therapy", label: "Therapy", vertical: "therapy", gradient: "lavender" },
];

export const COLLECTIONS: Collection[] = [
  { id: "col-stress", title: "Melt away stress", subtitle: "Massage, breathwork and calm", gradient: "eucalyptus", businessIds: ["still-waters", "prana", "quiet-mind"] },
  { id: "col-glow", title: "Get that glow", subtitle: "Facials and skin experts near you", gradient: "clay", businessIds: ["lumiere", "the-grove"] },
  { id: "col-strong", title: "Build strength", subtitle: "Movement studios and coaches", gradient: "ocean", businessIds: ["forma", "prana"] },
  { id: "col-escape", title: "Weekend escapes", subtitle: "Retreats to come back to yourself", gradient: "amber", businessIds: ["amrit-retreat"] },
];
