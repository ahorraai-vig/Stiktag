import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Wifi, 
  Star, 
  Palette, 
  QrCode, 
  Radio, 
  CheckCircle2, 
  ExternalLink, 
  Smartphone, 
  Search, 
  Trash2, 
  Edit3, 
  Share2, 
  Sliders, 
  ArrowRight,
  ShieldCheck,
  FileText,
  Instagram,
  Clock,
  Sparkles,
  Link as LinkIcon,
  X,
  Layers,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { 
  Business, 
  BusinessNiche, 
  ContractStatus, 
  Micropage, 
  MicropageLink, 
  NfcQrTag, 
  RedirectMode 
} from '../types';

interface BusinessManagerProps {
  businesses: Record<string, Business>;
  tags: Record<string, NfcQrTag>;
  micropages: Record<string, Micropage>;
  onUpdateBusiness: (business: Business) => void;
  onCreateBusiness: (business: Business, initialMicropage?: Micropage) => void;
  onDeleteBusiness: (businessId: string) => void;
  onAssignTagToBusiness: (tagUid: string, businessId: string, redirectMode: RedirectMode, directUrl?: string) => void;
  onUnassignTag: (tagUid: string) => void;
  onUpdateMicropage: (micropage: Micropage) => void;
  onUpdateTagMode: (tagUid: string, mode: RedirectMode, directUrl?: string) => void;
  onNavigateToSimulator: (tagUid: string) => void;
  onNavigateToLab: () => void;
}

const NICHE_OPTIONS: { id: BusinessNiche; label: string; icon: string }[] = [
  { id: 'dental', label: 'Clínica Dental & Ortodoncia', icon: '🦷' },
  { id: 'pizzeria', label: 'Pizzería & Restaurante Italiano', icon: '🍕' },
  { id: 'fitness', label: 'Gimnasio & Crossfit Box', icon: '🏋️' },
  { id: 'taller', label: 'Taller Mecánico & Neumáticos', icon: '🔧' },
  { id: 'farmacia', label: 'Farmacia & Óptica 24h', icon: '💊' },
  { id: 'marisqueria', label: 'Marisquería & Arroces de Lonja', icon: '🦐' },
  { id: 'cafeteria', label: 'Cafetería de Especialidad & Brunch', icon: '☕' },
  { id: 'mascotas', label: 'Veterinaria & Peluquería Canina', icon: '🐾' },
  { id: 'barberia', label: 'Barbería Clásica & Estilistas', icon: '✂️' },
  { id: 'inmobiliaria', label: 'Inmobiliaria & Gestión de Fincas', icon: '🏠' },
  { id: 'hotel', label: 'Hotel Boutique & Casas Rurales', icon: '🏨' },
  { id: 'panaderia', label: 'Panadería Artesanal & Tartas', icon: '🥐' },
  { id: 'estetica', label: 'Salón de Belleza & Nail Spa', icon: '💅' },
  { id: 'tatuajes', label: 'Estudio de Tatuajes & Piercing', icon: '💀' },
  { id: 'floristeria', label: 'Floristería & Vivero Urbano', icon: '🌿' },
  { id: 'lavadero', label: 'Lavadero de Coches & Detailing', icon: '🚗' },
  { id: 'joyeria', label: 'Joyería & Alta Relojería', icon: '💎' },
  { id: 'optica', label: 'Óptica & Gabinete de Visión', icon: '👓' },
  { id: 'cerveceria', label: 'Cervecería Artesanal & Brewpub', icon: '🍺' },
  { id: 'heladeria', label: 'Heladería Artesanal & Gelateria', icon: '🍦' },
  { id: 'burger', label: 'Hamburguesería & Smash Burgers', icon: '🍔' },
  { id: 'universal', label: 'Comercio General & Despacho', icon: '⭐' },
];

const PRESET_COLORS = [
  '#059669', // Emerald AhorraAI
  '#0284c7', // Sky Blue
  '#ea580c', // Terracotta Orange
  '#dc2626', // Crimson Red
  '#7c3aed', // Royal Purple
  '#d97706', // Warm Amber
  '#0f172a', // Midnight Slate
  '#0d9488', // Deep Teal
];

export const BusinessManager: React.FC<BusinessManagerProps> = ({
  businesses,
  tags,
  micropages,
  onUpdateBusiness,
  onCreateBusiness,
  onDeleteBusiness,
  onAssignTagToBusiness,
  onUnassignTag,
  onUpdateMicropage,
  onUpdateTagMode,
  onNavigateToSimulator,
  onNavigateToLab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNicheFilter, setSelectedNicheFilter] = useState<string>('all');
  
  // Modals & Active editing
  const [isNewBusinessModalOpen, setIsNewBusinessModalOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [customizingBusinessId, setCustomizingBusinessId] = useState<string | null>(null);
  const [assigningTagBizId, setAssigningTagBizId] = useState<string | null>(null);

  // New business form state
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formNiche, setFormNiche] = useState<BusinessNiche>('dental');
  const [formCategory, setFormCategory] = useState('');
  const [formStreet, setFormStreet] = useState('');
  const [formPostalCode, setFormPostalCode] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formProvince, setFormProvince] = useState('');
  const [formContactPerson, setFormContactPerson] = useState('');
  const [formContactPhone, setFormContactPhone] = useState('');
  const [formContactEmail, setFormContactEmail] = useState('');
  const [formWebsite, setFormWebsite] = useState('');
  const [formInstagram, setFormInstagram] = useState('');
  const [formGoogleReviews, setFormGoogleReviews] = useState('');
  const [formWifiSsid, setFormWifiSsid] = useState('');
  const [formWifiPassword, setFormWifiPassword] = useState('');
  const [formBrandColor, setFormBrandColor] = useState('#059669');
  const [formContractStatus, setFormContractStatus] = useState<ContractStatus>('contracted');
  const [formNotes, setFormNotes] = useState('');

  // Unassigned neutral tags pool
  const neutralTags = Object.values(tags).filter((t) => t.status === 'unassigned');
  const allBusinessesList = Object.values(businesses);

  // Filter businesses
  const filteredBusinesses = allBusinessesList.filter((b) => {
    const matchesSearch = 
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.addressCity && b.addressCity.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.contactPerson && b.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesNiche = selectedNicheFilter === 'all' || b.niche === selectedNicheFilter;
    return matchesSearch && matchesNiche;
  });

  // Open creation modal
  const handleOpenCreateModal = () => {
    setFormName('');
    setFormSlug('');
    setFormNiche('dental');
    setFormCategory('Clínica Dental & Ortodoncia');
    setFormStreet('');
    setFormPostalCode('');
    setFormCity('');
    setFormProvince('');
    setFormContactPerson('');
    setFormContactPhone('');
    setFormContactEmail('');
    setFormWebsite('');
    setFormInstagram('');
    setFormGoogleReviews('');
    setFormWifiSsid('');
    setFormWifiPassword('');
    setFormBrandColor('#059669');
    setFormContractStatus('contracted');
    setFormNotes('');
    setIsNewBusinessModalOpen(true);
  };

  // Auto-generate slug when name changes
  const handleNameChange = (name: string) => {
    setFormName(name);
    const generatedSlug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormSlug(generatedSlug);
  };

  const handleSaveNewBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSlug.trim()) return;

    const newBizId = `biz-${Date.now()}`;
    const newBusiness: Business = {
      id: newBizId,
      name: formName.trim(),
      slug: formSlug.trim(),
      category: formCategory || NICHE_OPTIONS.find((n) => n.id === formNiche)?.label || 'Comercio',
      niche: formNiche,
      brandColor: formBrandColor,
      secondaryColor: '#f8fafc',
      backgroundColor: '#ffffff',
      addressStreet: formStreet.trim(),
      addressPostalCode: formPostalCode.trim(),
      addressCity: formCity.trim(),
      addressProvince: formProvince.trim(),
      contactPerson: formContactPerson.trim(),
      contactPhone: formContactPhone.trim(),
      contactEmail: formContactEmail.trim() || `contacto@${formSlug}.es`,
      websiteUrl: formWebsite.trim(),
      instagramHandle: formInstagram.trim(),
      googleReviewUrl: formGoogleReviews.trim() || `https://search.google.com/local/writereview?placeid=${formSlug}-place`,
      wifiSsid: formWifiSsid.trim() || `${formName.replace(/\s+/g, '_')}_WiFi`,
      wifiPassword: formWifiPassword.trim(),
      contractStatus: formContractStatus,
      notes: formNotes.trim(),
      createdAt: new Date().toISOString(),
    };

    // Create default personalized micropage for this business
    const defaultMicropage: Micropage = {
      id: `mp-${newBizId}`,
      businessId: newBizId,
      title: newBusiness.name,
      bio: `Bienvenido a ${newBusiness.name}. Conéctate a nuestra red, valora tu experiencia o consulta nuestros servicios.`,
      themeConfig: {
        backgroundStyle: 'solid',
        cardRadius: 'xl',
        accentColor: formBrandColor,
        textColor: '#0f172a',
        fontFamily: 'Outfit',
      },
      isPublished: true,
      createdAt: new Date().toISOString(),
      links: [
        {
          id: `lnk-${Date.now()}-1`,
          micropageId: `mp-${newBizId}`,
          title: '⭐ Dejar una Reseña 5★ en Google',
          subtitle: 'Tu opinión nos ayuda a seguir ofreciendo el mejor servicio',
          url: newBusiness.googleReviewUrl || 'https://search.google.com',
          iconType: 'google_reviews',
          isHighlighted: true,
          displayOrder: 1,
          isActive: true,
          clicks: 0,
        },
        {
          id: `lnk-${Date.now()}-2`,
          micropageId: `mp-${newBizId}`,
          title: '📶 Conectarse al WiFi de Clientes',
          subtitle: `Red: ${newBusiness.wifiSsid || 'WiFi Clientes'} (Acceso directo sin teclear clave)`,
          url: '#wifi',
          iconType: 'wifi',
          isHighlighted: false,
          displayOrder: 2,
          isActive: true,
          clicks: 0,
        },
        {
          id: `lnk-${Date.now()}-3`,
          micropageId: `mp-${newBizId}`,
          title: '💬 Hablar por WhatsApp',
          subtitle: 'Consultas directas, citas o dudas con nuestro equipo',
          url: `https://wa.me/${newBusiness.contactPhone?.replace(/[^0-9]/g, '') || '34600000000'}?text=Hola,%20contacto%20desde%20el%20soporte%20NFC%20en%20el%20local`,
          iconType: 'whatsapp',
          isHighlighted: false,
          displayOrder: 3,
          isActive: true,
          clicks: 0,
        },
      ],
    };

    onCreateBusiness(newBusiness, defaultMicropage);
    setIsNewBusinessModalOpen(false);
    // Open customizer immediately for delight
    setCustomizingBusinessId(newBizId);
  };

  // Get tags for a specific business
  const getTagsForBusiness = (businessId: string) => {
    return Object.values(tags).filter((t) => t.businessId === businessId);
  };

  const selectedCustomBiz = customizingBusinessId ? businesses[customizingBusinessId] : null;
  const selectedCustomMicropage = customizingBusinessId ? micropages[customizingBusinessId] : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* Top Header Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-bold tracking-wider uppercase mb-1">
                <Building2 className="w-4 h-4" />
                <span>Gestión de Clientes & Subdominios Dedicados</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Negocios & Asignación de Identidades Neutras
              </h1>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Registra negocios para la base de datos Supabase, asígnales identidades troqueladas neutras (QR + chip NFC dedicados) y personaliza el espacio único de cada cliente.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateToLab}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-300 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Radio className="w-4 h-4 text-emerald-600" />
                <span>Generar Tags Neutros en Lab ({neutralTags.length} libres)</span>
              </button>

              <button
                onClick={handleOpenCreateModal}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Negocio</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Negocios Registrados
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {allBusinessesList.length}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Listos para Supabase DB</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Identidades Neutras Libres
              </div>
              <div className="text-2xl font-extrabold text-emerald-600 font-mono">
                {neutralTags.length}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Con QR + NTAG213/215</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Tags Activos Asignados
              </div>
              <div className="text-2xl font-extrabold text-blue-600 font-mono">
                {Object.values(tags).filter((t) => t.status === 'active').length}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">En mesas, recepciones y cajas</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Espacios Subdominio
              </div>
              <div className="text-2xl font-extrabold text-purple-600 font-mono">
                {Object.keys(micropages).length}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">ahorraai.com/b/:slug</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, slug, ciudad..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-xs text-slate-500 shrink-0 font-medium">Filtrar nicho:</span>
            <select
              value={selectedNicheFilter}
              onChange={(e) => setSelectedNicheFilter(e.target.value)}
              className="bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">Todos los Nichos ({allBusinessesList.length})</option>
              {NICHE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.icon} {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Business Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((biz) => {
            const bizTags = getTagsForBusiness(biz.id);
            const bizMicropage = micropages[biz.id];
            const nicheInfo = NICHE_OPTIONS.find((n) => n.id === biz.niche);

            return (
              <div
                key={biz.id}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Card Header */}
                <div>
                  <div className="p-5 border-b border-slate-100 relative">
                    {/* Top bar with color pill and status */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0" 
                          style={{ backgroundColor: biz.brandColor }}
                          title={`Color de marca: ${biz.brandColor}`}
                        />
                        <span className="text-[11px] font-mono text-slate-500 font-semibold truncate max-w-[140px]">
                          ahorraai.com/b/{biz.slug}
                        </span>
                      </div>

                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        biz.contractStatus === 'active' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : biz.contractStatus === 'contracted'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {biz.contractStatus === 'active' ? 'En Producción' : biz.contractStatus === 'contracted' ? 'Contratado' : 'Prospecto'}
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 border border-slate-200 shadow-sm"
                        style={{ backgroundColor: `${biz.brandColor}15` }}
                      >
                        {nicheInfo?.icon || '🏢'}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold text-slate-900 truncate">
                          {biz.name}
                        </h3>
                        <p className="text-xs text-slate-500 truncate">
                          {biz.category}
                        </p>
                      </div>
                    </div>

                    {/* Address & Contact summary */}
                    <div className="mt-4 space-y-1.5 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
                      {(biz.addressStreet || biz.addressCity) && (
                        <div className="flex items-center gap-2 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">
                            {biz.addressStreet ? `${biz.addressStreet}, ` : ''}{biz.addressCity || 'España'} {biz.addressPostalCode ? `(${biz.addressPostalCode})` : ''}
                          </span>
                        </div>
                      )}

                      {biz.contactPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{biz.contactPhone}</span>
                          {biz.contactPerson && (
                            <span className="text-slate-400 font-mono text-[11px]">({biz.contactPerson})</span>
                          )}
                        </div>
                      )}

                      {biz.wifiSsid && (
                        <div className="flex items-center gap-2">
                          <Wifi className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-mono text-[11px] truncate">WiFi: {biz.wifiSsid}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Attached Physical Tags Section */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                        Soportes Troquelados Asignados ({bizTags.length})
                      </span>
                      <button
                        onClick={() => setAssigningTagBizId(biz.id)}
                        className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Vincular Tag</span>
                      </button>
                    </div>

                    {bizTags.length === 0 ? (
                      <div className="p-4 bg-amber-50/50 border border-amber-200/60 rounded-2xl text-center">
                        <AlertCircle className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                        <p className="text-xs font-semibold text-amber-900">Sin identidad troquelada vinculada</p>
                        <p className="text-[11px] text-amber-700 mt-0.5">
                          Asigna una etiqueta o peana neutra con chip NFC para que funcione el escaneo.
                        </p>
                        <button
                          onClick={() => setAssigningTagBizId(biz.id)}
                          className="mt-2.5 px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors"
                        >
                          Asignar Tag Neutro Ahora
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {bizTags.map((tag) => (
                          <div
                            key={tag.id}
                            className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs hover:border-emerald-500 transition-colors group"
                          >
                            <div className="min-w-0 pr-2">
                              <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-slate-800 truncate">
                                <QrCode className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="truncate">{tag.tagUid}</span>
                                <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded font-mono font-medium">
                                  {tag.chipModel || 'NTAG215'}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 truncate mt-0.5">
                                {tag.dieCutShape} • {tag.redirectMode === 'direct' ? 'Redirección Directa' : 'Micropágina Espacio'}
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => onNavigateToSimulator(tag.tagUid)}
                                title="Simular Tap NFC / QR de este soporte"
                                className="p-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg text-slate-600 transition-colors"
                              >
                                <Smartphone className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onUnassignTag(tag.tagUid)}
                                title="Desvincular soporte de este negocio"
                                className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-400 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-5 pt-0">
                  <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setCustomizingBusinessId(biz.id)}
                      className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Palette className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Personalizar Espacio</span>
                    </button>

                    <button
                      onClick={() => {
                        const firstTag = bizTags[0];
                        if (firstTag) {
                          onNavigateToSimulator(firstTag.tagUid);
                        } else {
                          setAssigningTagBizId(biz.id);
                        }
                      }}
                      className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                      <span>Ver Simulador</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredBusinesses.length === 0 && (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl p-8">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No se encontraron negocios</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Prueba con otro término de búsqueda o añade tu primer cliente contratado con el botón de abajo.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              + Añadir Primer Negocio
            </button>
          </div>
        )}
      </div>

      {/* MODAL 1: AÑADIR NUEVO NEGOCIO (CAMPOS DE BASE DE DATOS SUPABASE) */}
      {isNewBusinessModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Registrar Nuevo Negocio / Cliente</h3>
                  <p className="text-xs text-slate-500">Estructura preparada para la tabla <code>businesses</code> de Supabase</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewBusinessModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewBusiness} className="p-6 space-y-6">
              
              {/* Sección 1: Identificación y Nicho */}
              <div>
                <h4 className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>1. Identificación & Subdominio</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nombre Comercial del Negocio *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Ej: Pizzería Da Luigi, Clínica Dr. Morales"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Subdominio / Slug Único *
                    </label>
                    <div className="flex items-center">
                      <span className="px-3 py-2.5 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-xs text-slate-500 font-mono">
                        ahorraai.com/b/
                      </span>
                      <input
                        type="text"
                        required
                        value={formSlug}
                        onChange={(e) => setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        placeholder="daluigi"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-r-xl text-xs font-mono text-emerald-800 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tipo de Negocio / Nicho Troquelado *
                    </label>
                    <select
                      value={formNiche}
                      onChange={(e) => {
                        const n = e.target.value as BusinessNiche;
                        setFormNiche(n);
                        setFormCategory(NICHE_OPTIONS.find((item) => item.id === n)?.label || '');
                      }}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      {NICHE_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.icon} {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Color Primario de Marca
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formBrandColor}
                        onChange={(e) => setFormBrandColor(e.target.value)}
                        className="w-10 h-10 rounded-xl border border-slate-200 p-0.5 cursor-pointer shrink-0"
                      />
                      <div className="flex flex-wrap gap-1">
                        {PRESET_COLORS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setFormBrandColor(c)}
                            className={`w-6 h-6 rounded-lg border transition-transform ${formBrandColor === c ? 'scale-110 ring-2 ring-emerald-500' : ''}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección 2: Dirección y Contacto (Para Supabase) */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider mb-3">
                  2. Ubicación Física & Datos de Contacto
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Dirección (Calle y Número)
                    </label>
                    <input
                      type="text"
                      value={formStreet}
                      onChange={(e) => setFormStreet(e.target.value)}
                      placeholder="Ej: Gran Vía 45, Planta 2"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Código Postal
                    </label>
                    <input
                      type="text"
                      value={formPostalCode}
                      onChange={(e) => setFormPostalCode(e.target.value)}
                      placeholder="Ej: 28013"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Ciudad / Municipio
                    </label>
                    <input
                      type="text"
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      placeholder="Ej: Madrid"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Provincia
                    </label>
                    <input
                      type="text"
                      value={formProvince}
                      onChange={(e) => setFormProvince(e.target.value)}
                      placeholder="Ej: Madrid"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Persona de Contacto
                    </label>
                    <input
                      type="text"
                      value={formContactPerson}
                      onChange={(e) => setFormContactPerson(e.target.value)}
                      placeholder="Ej: Carlos Gómez (Dueño)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Teléfono / WhatsApp Directo
                    </label>
                    <input
                      type="text"
                      value={formContactPhone}
                      onChange={(e) => setFormContactPhone(e.target.value)}
                      placeholder="Ej: +34 612 345 678"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email de Contacto
                    </label>
                    <input
                      type="email"
                      value={formContactEmail}
                      onChange={(e) => setFormContactEmail(e.target.value)}
                      placeholder="Ej: info@negocio.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Instagram (@usuario)
                    </label>
                    <input
                      type="text"
                      value={formInstagram}
                      onChange={(e) => setFormInstagram(e.target.value)}
                      placeholder="Ej: @pizzeriadaluigi"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 3: Google Reviews & WiFi del Negocio */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider mb-3">
                  3. Credenciales de Servicios (Reseñas & WiFi)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                      <span>URL Directa de Reseñas de Google</span>
                      <span className="text-[11px] font-normal text-slate-400">Enlace con 5 estrellas listo</span>
                    </label>
                    <input
                      type="url"
                      value={formGoogleReviews}
                      onChange={(e) => setFormGoogleReviews(e.target.value)}
                      placeholder="https://search.google.com/local/writereview?placeid=..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nombre de Red WiFi (SSID)
                    </label>
                    <input
                      type="text"
                      value={formWifiSsid}
                      onChange={(e) => setFormWifiSsid(e.target.value)}
                      placeholder="Ej: Pizzeria_Clientes_5G"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Contraseña WiFi Clientes
                    </label>
                    <input
                      type="text"
                      value={formWifiPassword}
                      onChange={(e) => setFormWifiPassword(e.target.value)}
                      placeholder="Ej: ClaveSecreta2026"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewBusinessModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Guardar y Crear Espacio Personalizado</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ASIGNAR IDENTIDAD NEUTRA A NEGOCIO */}
      {assigningTagBizId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Asignar Soporte Neutro a {businesses[assigningTagBizId]?.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Selecciona una identidad neutra disponible creada en lote en el Laboratorio.
                </p>
              </div>
              <button
                onClick={() => setAssigningTagBizId(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {neutralTags.length === 0 ? (
              <div className="text-center py-8">
                <Radio className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">No hay tags neutros en el pool</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 mb-4">
                  Genera un nuevo lote de códigos QR con chip NFC en el Laboratorio Hardware para poder asignarlos.
                </p>
                <button
                  onClick={() => {
                    setAssigningTagBizId(null);
                    onNavigateToLab();
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
                >
                  Ir al Laboratorio a Generar Tags Neutros
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                  {neutralTags.map((tag) => (
                    <div
                      key={tag.id}
                      className="p-3.5 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-500 rounded-2xl flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900">
                            {tag.tagUid}
                          </span>
                          <span className="text-[10px] font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded font-bold text-emerald-800">
                            {tag.chipModel || 'NTAG215'}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            PIN: {tag.claimToken}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 font-medium">
                          {tag.dieCutShape}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onAssignTagToBusiness(tag.tagUid, assigningTagBizId, 'micropage');
                            setAssigningTagBizId(null);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                        >
                          Asignar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span>{neutralTags.length} identidades disponibles en stock</span>
                  <button
                    onClick={() => {
                      setAssigningTagBizId(null);
                      onNavigateToLab();
                    }}
                    className="font-bold text-emerald-700 hover:underline"
                  >
                    + Generar más en Lab
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: PERSONALIZADOR COMPLETO DEL ESPACIO / SUBDOMINIO CON PREVIEW EN VIVO */}
      {selectedCustomBiz && selectedCustomMicropage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold shadow-sm"
                  style={{ backgroundColor: selectedCustomBiz.brandColor }}
                >
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>Personalizar Espacio Dedicado: {selectedCustomBiz.name}</span>
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-semibold">
                    <span>ahorraai.com/b/{selectedCustomBiz.slug}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">Redirección única por cliente</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCustomizingBusinessId(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Left controls + Right Live Mockup */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
              
              {/* Left Column: Customizer Controls (7 cols) */}
              <div className="lg:col-span-7 p-6 space-y-6 overflow-y-auto">
                
                {/* 1. Selector de Modo de Redirección */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <div className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-600" />
                    <span>Modo de Respuesta al Escanear QR o Tocar NFC</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <label className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      getTagsForBusiness(selectedCustomBiz.id)[0]?.redirectMode === 'direct'
                        ? 'bg-white border-emerald-600 shadow-sm ring-1 ring-emerald-500'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="redirectMode"
                          checked={getTagsForBusiness(selectedCustomBiz.id)[0]?.redirectMode === 'direct'}
                          onChange={() => {
                            getTagsForBusiness(selectedCustomBiz.id).forEach((t) => {
                              onUpdateTagMode(t.tagUid, 'direct', selectedCustomBiz.googleReviewUrl);
                            });
                          }}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-xs font-bold text-slate-900">Redirección Directa</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 pl-5">
                        Salta de inmediato a Google Reviews sin pantalla intermedia.
                      </p>
                    </label>

                    <label className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      getTagsForBusiness(selectedCustomBiz.id)[0]?.redirectMode !== 'direct'
                        ? 'bg-white border-emerald-600 shadow-sm ring-1 ring-emerald-500'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="redirectMode"
                          checked={getTagsForBusiness(selectedCustomBiz.id)[0]?.redirectMode !== 'direct'}
                          onChange={() => {
                            getTagsForBusiness(selectedCustomBiz.id).forEach((t) => {
                              onUpdateTagMode(t.tagUid, 'micropage');
                            });
                          }}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-xs font-bold text-slate-900">Espacio / Micropágina</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 pl-5">
                        Abre la página personalizada con múltiples opciones (WiFi, Reseñas, Carta).
                      </p>
                    </label>
                  </div>
                </div>

                {/* 2. Colores y Estilo Visual */}
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-emerald-600" />
                    <span>Identidad Visual & Colores de Marca</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Color Primario de Botones y Acentos
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={selectedCustomBiz.brandColor}
                          onChange={(e) => {
                            const newColor = e.target.value;
                            onUpdateBusiness({
                              ...selectedCustomBiz,
                              brandColor: newColor,
                            });
                            onUpdateMicropage({
                              ...selectedCustomMicropage,
                              themeConfig: {
                                ...selectedCustomMicropage.themeConfig,
                                accentColor: newColor,
                              },
                            });
                          }}
                          className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5 shrink-0"
                        />
                        <input
                          type="text"
                          value={selectedCustomBiz.brandColor}
                          onChange={(e) => {
                            const newColor = e.target.value;
                            onUpdateBusiness({
                              ...selectedCustomBiz,
                              brandColor: newColor,
                            });
                            onUpdateMicropage({
                              ...selectedCustomMicropage,
                              themeConfig: {
                                ...selectedCustomMicropage.themeConfig,
                                accentColor: newColor,
                              },
                            });
                          }}
                          className="w-24 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Fondo de Pantalla
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateMicropage({
                              ...selectedCustomMicropage,
                              themeConfig: {
                                ...selectedCustomMicropage.themeConfig,
                                backgroundStyle: 'solid',
                                textColor: '#0f172a',
                              },
                            });
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                            selectedCustomMicropage.themeConfig.textColor === '#0f172a'
                              ? 'bg-white border-emerald-500 text-slate-900 shadow-sm'
                              : 'bg-slate-100 border-slate-200 text-slate-600'
                          }`}
                        >
                          Limpio Blanco
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateMicropage({
                              ...selectedCustomMicropage,
                              themeConfig: {
                                ...selectedCustomMicropage.themeConfig,
                                backgroundStyle: 'solid',
                                textColor: '#f8fafc',
                              },
                            });
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                            selectedCustomMicropage.themeConfig.textColor === '#f8fafc'
                              ? 'bg-slate-900 border-emerald-500 text-white shadow-sm'
                              : 'bg-slate-800 border-slate-700 text-slate-300'
                          }`}
                        >
                          Modo Oscuro
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Título y Eslogan del Espacio
                    </label>
                    <input
                      type="text"
                      value={selectedCustomMicropage.title}
                      onChange={(e) => {
                        onUpdateMicropage({
                          ...selectedCustomMicropage,
                          title: e.target.value,
                        });
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 mb-2 focus:bg-white"
                    />
                    <textarea
                      rows={2}
                      value={selectedCustomMicropage.bio}
                      onChange={(e) => {
                        onUpdateMicropage({
                          ...selectedCustomMicropage,
                          bio: e.target.value,
                        });
                      }}
                      placeholder="Breve bienvenida o eslogan"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white"
                    />
                  </div>
                </div>

                {/* 3. Módulos y Funciones Desplegables */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-600" />
                      <span>Opciones & Funciones Desplegables</span>
                    </h4>
                    <span className="text-[11px] text-slate-500">Activa o personaliza cada botón</span>
                  </div>

                  <div className="space-y-3">
                    {selectedCustomMicropage.links.map((link, idx) => (
                      <div
                        key={link.id}
                        className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {link.title}
                            </span>
                            {link.isHighlighted && (
                              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded text-[9px] font-bold">
                                Destacado
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {link.subtitle || link.url}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const updatedLinks = selectedCustomMicropage.links.map((l, i) =>
                                i === idx ? { ...l, isActive: !l.isActive } : l
                              );
                              onUpdateMicropage({
                                ...selectedCustomMicropage,
                                links: updatedLinks,
                              });
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                              link.isActive
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {link.isActive ? 'Activo' : 'Oculto'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Live Smartphone Preview (5 cols) */}
              <div className="lg:col-span-5 p-6 bg-slate-100 flex flex-col items-center justify-center">
                
                <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span>Previsualización en Vivo</span>
                </div>

                {/* Smartphone Device Frame */}
                <div className="w-[300px] h-[580px] bg-white rounded-[40px] shadow-2xl border-[8px] border-slate-900 overflow-hidden flex flex-col relative">
                  
                  {/* Dynamic Island / Notch */}
                  <div className="w-28 h-4 bg-slate-900 rounded-b-2xl mx-auto z-20" />

                  {/* Phone Screen Content */}
                  <div 
                    className="flex-1 overflow-y-auto p-4 flex flex-col text-center"
                    style={{ 
                      backgroundColor: selectedCustomMicropage.themeConfig.textColor === '#f8fafc' ? '#0f172a' : '#ffffff',
                      color: selectedCustomMicropage.themeConfig.textColor 
                    }}
                  >
                    
                    {/* Header Logo & Name */}
                    <div className="pt-2 pb-4">
                      <div 
                        className="w-16 h-16 rounded-2xl mx-auto mb-2 flex items-center justify-center text-white text-2xl font-bold shadow-md"
                        style={{ backgroundColor: selectedCustomBiz.brandColor }}
                      >
                        {selectedCustomBiz.name.charAt(0)}
                      </div>
                      
                      <h2 className="text-base font-extrabold tracking-tight">
                        {selectedCustomMicropage.title}
                      </h2>
                      
                      <p className="text-[11px] opacity-75 mt-1 leading-relaxed px-2">
                        {selectedCustomMicropage.bio}
                      </p>
                    </div>

                    {/* Interactive Mock Links */}
                    <div className="space-y-2.5 flex-1">
                      {selectedCustomMicropage.links
                        .filter((l) => l.isActive)
                        .map((link) => (
                          <div
                            key={link.id}
                            className="p-3 rounded-xl border text-left transition-transform active:scale-95 shadow-sm"
                            style={{
                              backgroundColor: link.isHighlighted 
                                ? selectedCustomBiz.brandColor 
                                : selectedCustomMicropage.themeConfig.textColor === '#f8fafc' ? '#1e293b' : '#f8fafc',
                              borderColor: link.isHighlighted ? selectedCustomBiz.brandColor : '#e2e8f0',
                              color: link.isHighlighted ? '#ffffff' : 'inherit'
                            }}
                          >
                            <div className="font-bold text-xs flex items-center justify-between">
                              <span>{link.title}</span>
                              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                            </div>
                            {link.subtitle && (
                              <p className="text-[10px] opacity-80 mt-0.5 line-clamp-1">
                                {link.subtitle}
                              </p>
                            )}
                          </div>
                        ))}
                    </div>

                    {/* Footer watermark */}
                    <div className="pt-4 pb-2 border-t border-slate-100/20 text-[10px] opacity-50 font-mono">
                      Tecnología NFC • AhorraAI.com
                    </div>

                  </div>

                </div>

                {/* Direct Simulator Link */}
                <div className="mt-4 text-center">
                  <button
                    onClick={() => {
                      const firstTag = getTagsForBusiness(selectedCustomBiz.id)[0];
                      if (firstTag) {
                        setCustomizingBusinessId(null);
                        onNavigateToSimulator(firstTag.tagUid);
                      } else {
                        setAssigningTagBizId(selectedCustomBiz.id);
                      }
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>Probar este Espacio en el Simulador</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
