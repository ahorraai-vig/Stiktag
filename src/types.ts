export type RedirectMode = 'direct' | 'micropage';

export type TagStatus = 'unassigned' | 'active' | 'suspended';

export type ProductFormatId = 
  | 'troquel_carteleria'    // Cartelería y peanas troqueladas de sobremesa
  | 'troquel_adhesivos'     // Pegatinas vinílicas troqueladas con forma del nicho
  | 'troquel_suelo'         // Adhesivos de suelo antideslizantes de alto tránsito
  | 'chapas_nfc'            // Chapas / badges con pin e ilustración + chip
  | 'imanes_troquelados'    // Imanes de nevera troquelados con chip NFC
  | 'llaveros_troquelados'  // Llaveros acrílicos o flexibles troquelados
  | 'colgadores_pomos'      // Colgadores de puerta troquelados para hoteles y villas
  | 'posavasos_troquelados' // Posavasos rígidos troquelados lavables con NFC
  | 'electrostatico_cristal'; // Adhesivos electrostáticos para lunas de coche y escaparates

export type BusinessNiche = 
  | 'dental'
  | 'marisqueria'
  | 'pizzeria'
  | 'cafeteria'
  | 'fitness'
  | 'taller'
  | 'farmacia'
  | 'mascotas'
  | 'barberia'
  | 'inmobiliaria'
  | 'hotel'
  | 'panaderia'
  | 'estetica'
  | 'tatuajes'
  | 'floristeria'
  | 'lavadero'
  | 'joyeria'
  | 'optica'
  | 'cerveceria'
  | 'heladeria'
  | 'burger'
  | 'universal';

export type ContractStatus = 'lead' | 'contracted' | 'delivered' | 'active';

export interface Business {
  id: string;
  name: string;
  slug: string; // Subdominio / subespacio ej: ahorraai.com/b/:slug
  category: string;
  niche: BusinessNiche;
  logoUrl?: string;
  brandColor: string;
  secondaryColor?: string;
  backgroundColor?: string;
  
  // Ubicación física y contacto (Estructura para Supabase)
  addressStreet?: string;
  addressPostalCode?: string;
  addressCity?: string;
  addressProvince?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail: string;
  websiteUrl?: string;
  instagramHandle?: string;

  // Integraciones y credenciales
  googlePlaceId?: string;
  googleReviewUrl?: string;
  wifiSsid?: string;
  wifiPassword?: string;

  // Estado comercial y notas
  contractStatus?: ContractStatus;
  notes?: string;
  createdAt: string;
}

export interface TagBatch {
  id: string;
  batchCode: string;
  productType: ProductFormatId;
  dieCutShape: string;
  totalUnits: number;
  notes: string;
  createdAt: string;
}

export interface NfcQrTag {
  id: string;
  tagUid: string; // The URL slug used in ahorraai.com/t/:tagUid
  serialNumber: string;
  batchId: string;
  productType: ProductFormatId;
  dieCutShape: string;
  status: TagStatus;
  businessId?: string;
  redirectMode: RedirectMode;
  directUrl?: string;
  nfcChipUid?: string;
  chipModel?: 'NTAG213' | 'NTAG215' | 'NTAG216';
  scanCount: number;
  lastScannedAt?: string;
  claimToken: string; // Secret PIN printed on rotuladora label to link in field
  notes?: string;
  createdAt: string;
}

export type LinkIconType = 
  | 'google_reviews'
  | 'menu_pdf'
  | 'whatsapp'
  | 'instagram'
  | 'wifi'
  | 'phone'
  | 'website'
  | 'catalog'
  | 'schedule'
  | 'custom';

export interface MicropageLink {
  id: string;
  micropageId: string;
  title: string;
  subtitle?: string;
  url: string;
  iconType: LinkIconType;
  isHighlighted?: boolean;
  displayOrder: number;
  isActive: boolean;
  clicks: number;
}

export interface MicropageTheme {
  backgroundStyle: 'solid' | 'gradient' | 'mesh' | 'minimal';
  cardRadius: 'none' | 'md' | 'xl' | 'full';
  accentColor: string;
  textColor: string;
  fontFamily: 'Outfit' | 'Plus Jakarta Sans' | 'System';
}

export interface Micropage {
  id: string;
  businessId: string;
  title: string;
  bio: string;
  bannerUrl?: string;
  themeConfig: MicropageTheme;
  isPublished: boolean;
  createdAt: string;
  links: MicropageLink[];
}

export interface ScanAnalyticEvent {
  id: string;
  tagId: string;
  tagUid: string;
  businessId?: string;
  scannedAt: string;
  scanMethod: 'nfc' | 'qr' | 'direct_web';
  deviceOs: 'ios' | 'android' | 'desktop' | 'other';
  referrer?: string;
  city?: string;
}

export interface HardwareProduct {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  niche: BusinessNiche;
  dieCutShape: string;
  stickerReservedArea: string; // e.g. "30 x 30 mm para etiqueta QR"
  price: number;
  unitPackOptions: { units: number; price: number; discountPercent: number }[];
  chipType: 'NTAG213' | 'NTAG215' | 'NTAG216';
  memoryBytes: number;
  material: string;
  dimensions: string;
  image: string;
  description: string;
  idealFor: string[];
  specs: { label: string; value: string }[];
  inStock: boolean;
  leadTime: string;
  badgeTag?: string;
}

export interface CartItem {
  product: HardwareProduct;
  selectedPackUnits: number;
  packPrice: number;
  quantity: number;
  customizationNotes?: string;
}
