import React, { useState, useEffect } from 'react';
import { 
  Nfc, 
  QrCode, 
  ExternalLink, 
  Star, 
  FileText, 
  Wifi, 
  MessageCircle, 
  Instagram, 
  Phone, 
  Globe, 
  CheckCircle, 
  Copy, 
  ShieldCheck, 
  ArrowRight,
  Smartphone,
  RefreshCw,
  Sparkles,
  Zap,
  Lock,
  Building2,
  Fish,
  Coffee,
  HeartPulse,
  Pizza,
  Dumbbell,
  Wrench,
  Cross
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Business, Micropage, MicropageLink, NfcQrTag, ScanAnalyticEvent } from '../types';

interface TagResolverViewProps {
  tagUid: string;
  tags: Record<string, NfcQrTag>;
  businesses: Record<string, Business>;
  micropages: Record<string, Micropage>;
  onRecordScan: (event: Omit<ScanAnalyticEvent, 'id' | 'scannedAt'>) => void;
  onClaimTag: (tagUid: string, businessId: string, redirectMode: 'direct' | 'micropage', directUrl?: string) => void;
  onNavigateToBusinesses: () => void;
  onNavigateToLab: () => void;
}

export const TagResolverView: React.FC<TagResolverViewProps> = ({
  tagUid,
  tags,
  businesses,
  micropages,
  onRecordScan,
  onClaimTag,
  onNavigateToBusinesses,
  onNavigateToLab,
}) => {
  const [selectedTagUid, setSelectedTagUid] = useState<string>(tagUid);
  const [scanMethod, setScanMethod] = useState<'nfc' | 'qr'>('nfc');
  const [simulatedDevice, setSimulatedDevice] = useState<'ios' | 'android'>('ios');
  const [directCountdown, setDirectCountdown] = useState<number>(3);
  const [showWifiModal, setShowWifiModal] = useState(false);
  const [copiedWifi, setCopiedWifi] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Claim wizard state
  const [claimPin, setClaimPin] = useState('');
  const [claimBusinessId, setClaimBusinessId] = useState('');
  const [claimMode, setClaimMode] = useState<'micropage' | 'direct'>('direct');
  const [claimDirectUrl, setClaimDirectUrl] = useState('https://search.google.com/local/writereview?placeid=mi-negocio');
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Sync selected tag when prop changes
  useEffect(() => {
    if (tagUid && tags[tagUid]) {
      setSelectedTagUid(tagUid);
    }
  }, [tagUid, tags]);

  const currentTag = tags[selectedTagUid] || tags['tag-dental-muela'] || Object.values(tags)[0];
  const currentBusiness = currentTag?.businessId ? businesses[currentTag.businessId] : null;
  const currentMicropage = currentTag?.businessId ? micropages[currentTag.businessId] : null;

  // Record scan whenever tag is loaded/switched
  useEffect(() => {
    if (currentTag && currentTag.status === 'active') {
      onRecordScan({
        tagId: currentTag.id,
        tagUid: currentTag.tagUid,
        businessId: currentTag.businessId,
        scanMethod: scanMethod,
        deviceOs: simulatedDevice,
        city: 'Madrid',
      });
    }
  }, [selectedTagUid, scanMethod, simulatedDevice]);

  // Countdown timer for direct redirect simulation
  useEffect(() => {
    if (currentTag?.status === 'active' && currentTag?.redirectMode === 'direct') {
      setDirectCountdown(3);
      const timer = setInterval(() => {
        setDirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [selectedTagUid, currentTag?.redirectMode]);

  const handleCopyWifi = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWifi(true);
    setTimeout(() => setCopiedWifi(false), 2000);
  };

  const handleTriggerReview = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899'],
    });
    setReviewSubmitted(true);
  };

  const handleExecuteClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimBusinessId) return;

    onClaimTag(
      currentTag.tagUid,
      claimBusinessId,
      claimMode,
      claimMode === 'direct' ? claimDirectUrl : undefined
    );
    setClaimSuccess(true);
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'google_reviews':
        return <Star className="w-5 h-5 text-amber-500 fill-amber-500" />;
      case 'menu_pdf':
        return <FileText className="w-5 h-5 text-emerald-600" />;
      case 'wifi':
        return <Wifi className="w-5 h-5 text-sky-600" />;
      case 'whatsapp':
        return <MessageCircle className="w-5 h-5 text-emerald-600" />;
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-600" />;
      case 'phone':
        return <Phone className="w-5 h-5 text-blue-600" />;
      case 'schedule':
        return <Dumbbell className="w-5 h-5 text-slate-800" />;
      default:
        return <Globe className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Control Bar: Tag Selector & Simulation Switchers */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-bold mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>MOTOR DE RESOLUCIÓN DINÁMICA /t/:tagUid</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Simulador del Soporte Troquelado (Tap / Escaneo con Móvil)
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                URL física impresa en la etiqueta: <code className="text-emerald-700 font-mono font-bold">https://ahorraai.com/t/{currentTag?.tagUid}</code>
              </p>
            </div>

            {/* Scan method toggle */}
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 self-start md:self-auto">
              <button
                onClick={() => setScanMethod('nfc')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                  scanMethod === 'nfc' ? 'bg-white text-emerald-700 shadow-sm font-semibold' : 'text-slate-600'
                }`}
                title="Simular aproximación física NFC"
              >
                <Nfc className="w-3.5 h-3.5" />
                NFC Tap
              </button>
              <button
                onClick={() => setScanMethod('qr')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                  scanMethod === 'qr' ? 'bg-white text-emerald-700 shadow-sm font-semibold' : 'text-slate-600'
                }`}
                title="Simular escaneo de código QR con cámara"
              >
                <QrCode className="w-3.5 h-3.5" />
                QR Scan
              </button>
            </div>
          </div>

          {/* Quick Tag Switcher Carousel */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Probar Silueta:</span>
            
            <button
              onClick={() => setSelectedTagUid('tag-pizza-slice')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedTagUid === 'tag-pizza-slice'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🍕 Pizza Italiana (Take Away)
            </button>

            <button
              onClick={() => setSelectedTagUid('tag-dental-muela')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedTagUid === 'tag-dental-muela'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🦷 Muela Dental (5★ Directo)
            </button>

            <button
              onClick={() => setSelectedTagUid('tag-gym-kettlebell')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedTagUid === 'tag-gym-kettlebell'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🏋️ Pesa Rusa (WOD & Gym)
            </button>

            <button
              onClick={() => setSelectedTagUid('tag-taller-llave')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedTagUid === 'tag-taller-llave'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🔧 Llave Mecánica (ITV & Taller)
            </button>

            <button
              onClick={() => setSelectedTagUid('tag-farmacia-cruz')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedTagUid === 'tag-farmacia-cruz'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              ➕ Cruz Farmacia (Guardias 24h)
            </button>

            <button
              onClick={() => setSelectedTagUid('tag-marisco-centollo')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedTagUid === 'tag-marisco-centollo'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🦀 Centollo Marisquería
            </button>

            <button
              onClick={() => setSelectedTagUid('tag-inmo-casa')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedTagUid === 'tag-inmo-casa'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🏠 Casita Inmobiliaria (Tour 360)
            </button>

            <button
              onClick={() => setSelectedTagUid('tag-hotel-suite')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedTagUid === 'tag-hotel-suite'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🏨 Colgador Hotel (Suite 204)
            </button>

            <button
              onClick={() => setSelectedTagUid('tag-pan-croissant')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedTagUid === 'tag-pan-croissant'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🥐 Croissant Panadería (Tartas)
            </button>

            <button
              onClick={() => setSelectedTagUid('tag-tattoo-skull')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedTagUid === 'tag-tattoo-skull'
                  ? 'bg-zinc-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              💀 Calavera Tattoo (Cuidados)
            </button>

            <button
              onClick={() => setSelectedTagUid('tag-dental-magnets')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedTagUid === 'tag-dental-magnets'
                  ? 'bg-sky-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🪥 Imán Cepillo Dental (Nevera)
            </button>

            <button
              onClick={() => setSelectedTagUid('tag-joyeria-diamante')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedTagUid === 'tag-joyeria-diamante'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              💎 Diamante Joyería (Certificado)
            </button>

            <button
              onClick={() => setSelectedTagUid('tag-optica-gafas')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedTagUid === 'tag-optica-gafas'
                  ? 'bg-sky-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              👓 Gafas Carey Óptica (Probador 3D)
            </button>

            <button
              onClick={() => setSelectedTagUid('tag-beer-jarra')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedTagUid === 'tag-beer-jarra'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🍺 Jarra Cervecería (Tiradores IBUs)
            </button>

            <button
              onClick={() => setSelectedTagUid('tag-helado-cucurucho')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedTagUid === 'tag-helado-cucurucho'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🍦 Cucurucho Helado (Alérgenos)
            </button>

            <button
              onClick={() => setSelectedTagUid('tag-burger-house')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedTagUid === 'tag-burger-house'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🍔 Smash Burger (Carta PDF & Pedido)
            </button>

            <button
              onClick={() => setSelectedTagUid('tag-pet-grooming')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedTagUid === 'tag-pet-grooming'
                  ? 'bg-cyan-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🦴 Hueso Mascotas Spa (Citas)
            </button>

            <button
              onClick={() => setSelectedTagUid('tag-barber-pole')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedTagUid === 'tag-barber-pole'
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              💈 Barber Pole (Cortes & Barba)
            </button>

            <button
              onClick={() => setSelectedTagUid('tag-google-5star')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedTagUid === 'tag-google-5star'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              ⭐ 5★ Google (Reseña Directa)
            </button>

            <button
              onClick={() => setSelectedTagUid('tag-bakery-tray')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedTagUid === 'tag-bakery-tray'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🥖 Bandeja Espiga (Masa Madre)
            </button>

            <button
              onClick={() => setSelectedTagUid('tag-hotel-bell')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedTagUid === 'tag-hotel-bell'
                  ? 'bg-yellow-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🛎️ Campana Bellhop (Recepción Hotel)
            </button>

            <button
              onClick={() => setSelectedTagUid('tag-unassigned-forma')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedTagUid === 'tag-unassigned-forma'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🏷️ Sin Asignar (Activar)
            </button>
          </div>
        </div>

        {/* Main Content: Phone Preview + Hardware Metadata */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Device Mockup */}
          <div className="lg:col-span-7 flex justify-center">
            
            {/* iPhone 16 Pro Style Frame */}
            <div className="w-full max-w-[380px] bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 relative">
              
              {/* Phone Speaker & Dynamic Island */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-between px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>

              {/* Screen Area */}
              <div className="w-full bg-white rounded-[34px] overflow-hidden min-h-[640px] flex flex-col border border-slate-200 relative text-slate-900">
                
                {/* Phone Status Bar */}
                <div className="pt-3 px-6 pb-2 flex items-center justify-between text-[11px] font-mono text-slate-600 z-20 bg-slate-50 border-b border-slate-100">
                  <span>12:45</span>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span>5G</span>
                    <Wifi className="w-3 h-3" />
                    <span className="font-bold">100%</span>
                  </div>
                </div>

                {/* Simulated URL Bar (shows ahorraai.com/t/:tagUid) */}
                <div className="mx-4 my-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-between text-[11px] text-slate-600 font-mono">
                  <div className="flex items-center gap-1.5 truncate">
                    <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="text-slate-500">ahorraai.com/t/</span>
                    <span className="text-emerald-700 font-bold truncate">{currentTag.tagUid}</span>
                  </div>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded text-slate-700 font-bold shadow-xs">
                    {scanMethod.toUpperCase()}
                  </span>
                </div>

                {/* CASE A: UNASSIGNED TAG (Needs Activation) */}
                {currentTag.status === 'unassigned' && (
                  <div className="p-6 flex-1 flex flex-col justify-center text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
                      <Zap className="w-8 h-8" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mb-1">
                      Soporte Troquelado sin vincular
                    </h2>
                    <p className="text-xs text-slate-500 mb-4">
                      Silueta: <strong>{currentTag.dieCutShape}</strong> · Serie: <span className="font-mono text-slate-700 font-semibold">{currentTag.serialNumber}</span>
                    </p>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left mb-4 shadow-sm">
                      <p className="text-xs text-slate-800 mb-3 font-semibold">
                        ¡Activa tu peana o adhesivo en 30 segundos!
                      </p>
                      
                      <form onSubmit={handleExecuteClaim} className="space-y-3">
                        <div>
                          <label className="text-[11px] text-slate-600 block mb-1">
                            PIN de Activación de la etiqueta adhesiva:
                          </label>
                          <input
                            type="text"
                            defaultValue={currentTag.claimToken}
                            onChange={(e) => setClaimPin(e.target.value)}
                            placeholder="PIN impreso"
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono text-emerald-700 font-bold focus:outline-none focus:border-emerald-600"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-600 block mb-1">
                            Vincular a tu Negocio:
                          </label>
                          <select
                            value={claimBusinessId}
                            onChange={(e) => setClaimBusinessId(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                            required
                          >
                            <option value="">Selecciona negocio...</option>
                            {Object.values(businesses).map((b) => (
                              <option key={b.id} value={b.id}>
                                {b.name} ({b.category})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-600 block mb-1">
                            Modo de redirección:
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setClaimMode('direct')}
                              className={`px-2 py-1.5 text-[11px] font-semibold rounded-lg border transition-colors ${
                                claimMode === 'direct'
                                  ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                                  : 'bg-white border-slate-200 text-slate-600'
                              }`}
                            >
                              Directo Google 5★
                            </button>
                            <button
                              type="button"
                              onClick={() => setClaimMode('micropage')}
                              className={`px-2 py-1.5 text-[11px] font-semibold rounded-lg border transition-colors ${
                                claimMode === 'micropage'
                                  ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                                  : 'bg-white border-slate-200 text-slate-600'
                              }`}
                            >
                              Micro-sitio Marca
                            </button>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Vincular y Activar Ahora
                        </button>
                      </form>
                    </div>

                    <p className="text-[10px] text-slate-500">
                      Identidad neutra protegida por tokens criptográficos AhorraAI
                    </p>
                  </div>
                )}

                {/* CASE B: ACTIVE DIRECT REDIRECT MODE */}
                {currentTag.status === 'active' && currentTag.redirectMode === 'direct' && (
                  <div className="p-6 flex-1 flex flex-col justify-center text-center">
                    <div 
                      className="w-18 h-18 mx-auto mb-4 rounded-3xl flex items-center justify-center text-white shadow-md"
                      style={{ backgroundColor: currentBusiness?.brandColor || '#0284c7' }}
                    >
                      <Star className="w-10 h-10 fill-current" />
                    </div>

                    <div className="inline-block mx-auto px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-2">
                      Redirección Directa Activa
                    </div>

                    <h2 className="text-xl font-extrabold text-slate-900 mb-1">
                      {currentBusiness?.name || 'Negocio Vinculado'}
                    </h2>
                    <p className="text-xs text-slate-600 mb-6">
                      Abriendo ficha oficial de Reseñas de Google para valorar con 5★...
                    </p>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center mb-6 shadow-sm">
                      <div className="text-4xl font-mono font-extrabold text-slate-900 mb-1">
                        {directCountdown}s
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Saltando a la app oficial de Google Maps
                      </p>
                      
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div 
                          className="bg-emerald-600 h-full transition-all duration-1000 ease-linear"
                          style={{ width: `${((3 - directCountdown) / 3) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <a
                      href={currentTag.directUrl || currentBusiness?.googleReviewUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/20"
                    >
                      <span>Abrir Reseñas Inmediatamente</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <p className="text-[10px] text-slate-500 mt-4">
                      Este modo no muestra menús: lleva al cliente directo a valorar el servicio en 1 solo tap.
                    </p>
                  </div>
                )}

                {/* CASE C: ACTIVE MICROPAGE MODE (Branded Smart Linktree) */}
                {currentTag.status === 'active' && currentTag.redirectMode === 'micropage' && currentMicropage && (
                  <div className="flex-1 flex flex-col overflow-y-auto px-4 py-4">
                    
                    {/* Business Brand Header */}
                    <div className="text-center mb-5">
                      {/* Avatar / Logo with brand color halo */}
                      <div 
                        className="w-18 h-18 mx-auto rounded-2xl p-1 mb-2 shadow-md"
                        style={{ backgroundColor: `${currentBusiness?.brandColor || '#dc2626'}15` }}
                      >
                        <div 
                          className="w-full h-full rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-inner"
                          style={{ backgroundColor: currentBusiness?.brandColor || '#dc2626' }}
                        >
                          {currentBusiness?.name.charAt(0) || 'M'}
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-1.5">
                        <h2 className="text-base font-bold text-slate-900 tracking-tight">
                          {currentBusiness?.name}
                        </h2>
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      </div>

                      <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                        {currentBusiness?.category}
                      </div>

                      <p className="text-xs text-slate-600 mt-2 px-2 leading-relaxed">
                        {currentMicropage.bio}
                      </p>
                    </div>

                    {/* Action Links List */}
                    <div className="space-y-2.5 flex-1">
                      {currentMicropage.links.map((link) => {
                        const isWifi = link.iconType === 'wifi';
                        const isReview = link.iconType === 'google_reviews';

                        return (
                          <div key={link.id}>
                            {isWifi ? (
                              <button
                                onClick={() => setShowWifiModal(true)}
                                className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 shadow-xs ${
                                  link.isHighlighted
                                    ? 'bg-emerald-50 border-emerald-300 text-slate-900'
                                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 border border-slate-200 shadow-xs">
                                    {renderIcon(link.iconType)}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs font-bold text-slate-900 truncate">
                                      {link.title}
                                    </div>
                                    {link.subtitle && (
                                      <div className="text-[10px] text-slate-500 truncate">
                                        {link.subtitle}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                              </button>
                            ) : isReview ? (
                              <button
                                onClick={handleTriggerReview}
                                className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 shadow-xs ${
                                  link.isHighlighted
                                    ? 'bg-amber-50 border-amber-300'
                                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 border border-amber-200">
                                    {renderIcon(link.iconType)}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1.5">
                                      <span>{link.title}</span>
                                      <span className="text-[10px] bg-amber-200 text-amber-900 px-1 rounded font-mono font-bold">5.0★</span>
                                    </div>
                                    {link.subtitle && (
                                      <div className="text-[10px] text-slate-500 truncate">
                                        {link.subtitle}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <ExternalLink className="w-4 h-4 text-amber-600 shrink-0" />
                              </button>
                            ) : (
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 block shadow-xs ${
                                  link.isHighlighted
                                    ? 'bg-emerald-50 border-emerald-300'
                                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 border border-slate-200 shadow-xs">
                                    {renderIcon(link.iconType)}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs font-bold text-slate-900 truncate">
                                      {link.title}
                                    </div>
                                    {link.subtitle && (
                                      <div className="text-[10px] text-slate-500 truncate">
                                        {link.subtitle}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Review submitted notification */}
                    {reviewSubmitted && (
                      <div className="mt-3 p-2 bg-emerald-50 border border-emerald-300 rounded-xl text-center text-xs text-emerald-800 flex items-center justify-center gap-1.5 font-semibold">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        ¡Simulación: Gracias por tu reseña 5 Estrellas!
                      </div>
                    )}

                    {/* Footer brand stamp */}
                    <div className="pt-4 pb-2 text-center text-[10px] text-slate-400">
                      <span>Tecnología física por </span>
                      <span className="text-slate-700 font-bold">ahorraai.com</span>
                    </div>

                  </div>
                )}

              </div>
            </div>

          </div>

          {/* Right Column: Hardware Information & Architecture Explanation */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Tag Specs Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <span className="text-xs font-mono text-slate-500 font-bold">METADATOS DEL SOPORTE</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  currentTag.status === 'active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  {currentTag.status === 'active' ? 'Activo en producción' : 'Pendiente de asignar'}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Silueta Troquelada:</span>
                  <span className="font-bold text-slate-900">{currentTag.dieCutShape}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">UID en URL:</span>
                  <span className="font-mono text-emerald-700 font-bold">{currentTag.tagUid}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Nº Serie Fábrica:</span>
                  <span className="font-mono text-slate-700">{currentTag.serialNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Negocio asignado:</span>
                  <span className="text-slate-900 font-bold">
                    {currentBusiness ? currentBusiness.name : '— Ninguno (Neutro en lote) —'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Modo de redirección:</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold">
                    {currentTag.redirectMode === 'direct' ? 'DIRECTO (Google Maps)' : 'MICROPÁGINA (Linktree)'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Escaneos totales:</span>
                  <span className="font-mono text-emerald-700 font-extrabold tabular-nums text-sm">
                    {currentTag.scanCount} lecturas
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col gap-2">
                <button
                  onClick={onNavigateToBusinesses}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  Ir a Gestión de Negocios & Asignar Tags
                </button>
                <button
                  onClick={onNavigateToLab}
                  className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-slate-200"
                >
                  <Nfc className="w-4 h-4 text-sky-600" />
                  Testear chip físico con Web NFC / Cámara
                </button>
              </div>
            </div>

            {/* Why This Model is Revolutionary */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Por qué las formas de nicho escalan sin límites
              </h3>
              
              <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <p>
                  <strong>1. Producto universal por sector:</strong> Fabricas 500 peanas de pizza, 500 de muela o 500 llaves mecánicas. Te sirven para cualquier cliente del sector sin personalizar el soporte físico de fábrica.
                </p>
                <p>
                  <strong>2. Etiqueta adhesiva rápida:</strong> Imprimes en bobina pegatinas con QR y pegas detrás el chip NFC. Se aplican en el recuadro reservado en 2 segundos.
                </p>
                <p>
                  <strong>3. Cero costes de reimpresión:</strong> Si el negocio cambia de carta o de enlace de Google, se modifica en la nube al instante.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* WiFi Modal Dialog */}
      {showWifiModal && currentBusiness && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-4 border border-sky-100">
              <Wifi className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Conexión WiFi para Clientes
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {currentBusiness.name}
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-3 mb-6">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">Nombre de red (SSID):</span>
                <span className="text-sm font-mono text-slate-900 font-bold">
                  {currentBusiness.wifiSsid || 'BellaVista_WiFi_Guest'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">Contraseña:</span>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <span className="text-sm font-mono text-emerald-700 font-extrabold">
                    {currentBusiness.wifiPassword || 'PizzaNapoletana2026'}
                  </span>
                  <button
                    onClick={() => handleCopyWifi(currentBusiness.wifiPassword || 'PizzaNapoletana2026')}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs flex items-center gap-1 transition-colors font-medium shadow-xs"
                  >
                    {copiedWifi ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedWifi ? 'Copiada' : 'Copiar'}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowWifiModal(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
