import React, { useState } from 'react';
import { 
  Nfc, 
  QrCode, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  Layers, 
  Check, 
  Zap, 
  Star, 
  Smartphone,
  Eye,
  ShoppingBag,
  Scissors,
  Coffee,
  Fish,
  HeartPulse,
  PawPrint,
  Shapes,
  Magnet,
  Footprints,
  Pizza,
  Dumbbell,
  Wrench,
  Cross,
  Home,
  Hotel,
  Car,
  Flower2,
  Brush,
  Key,
  BadgeCheck,
  Tag,
  Gem,
  Glasses,
  Beer,
  Bone,
  IceCream,
  Flame
} from 'lucide-react';
import { HardwareProduct, BusinessNiche } from '../types';

interface StorefrontProps {
  products: HardwareProduct[];
  onSelectProduct: (product: HardwareProduct) => void;
  onAddToCart: (product: HardwareProduct, packUnits: number, packPrice: number) => void;
  onSimulateTag: (tagUid: string) => void;
  onNavigateToSupabase: () => void;
  onNavigateToBusinesses: () => void;
}

export const Storefront: React.FC<StorefrontProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onSimulateTag,
  onNavigateToSupabase,
  onNavigateToBusinesses,
}) => {
  const [selectedNiche, setSelectedNiche] = useState<string>('all');
  const [heroNiche, setHeroNiche] = useState<string>('pizza');

  const heroShowcaseMap: Record<string, {
    title: string;
    subtitle: string;
    category: string;
    shape: string;
    image: string;
    price: string;
    tagUid: string;
    niche: string;
  }> = {
    pizza: {
      title: 'Peana & Imán "Porción de Pizza Triangular"',
      subtitle: 'Para mesas de trattoria o imán gigante de nevera para clientes VIP. Incluye espacio delimitado para pegatina QR + chip NFC de pedidos y carta.',
      category: 'Pizzerías & Comida Italiana',
      shape: 'FORMA: PORCIÓN DE PIZZA ITALIANA',
      image: '/src/assets/images/diecut_pizza_slice_magnet_1793488412373.jpg',
      price: '€22.90',
      tagUid: 'tag-pizza-slice',
      niche: 'pizzeria',
    },
    dental: {
      title: 'Pack Imanes "Cepillo & Tubo de Pasta" + Peana Muela',
      subtitle: 'El paciente se lo lleva a su nevera para pedir citas y urgencias 24h por WhatsApp con 1 tap, o peana de muela en mostrador.',
      category: 'Clínicas Dentales & Ortodoncia',
      shape: 'FORMA: CEPILLO & PASTA DENTAL / MUELA',
      image: '/src/assets/images/diecut_dental_magnets_1793489487708.jpg',
      price: '€18.90',
      tagUid: 'tag-dental-magnets',
      niche: 'dental',
    },
    inmo: {
      title: 'Peana Troquelada "Casita Nórdica" & Llavero de Pisos',
      subtitle: 'En mesa de firmas y llaveros de entrega de llaves: al acercar el móvil abre el tour virtual 360º o el contacto del asesor.',
      category: 'Inmobiliarias & Agencias de Fincas',
      shape: 'FORMA: CASA NÓRDICA / HOGAR',
      image: '/src/assets/images/diecut_real_estate_house_1793489456675.jpg',
      price: '€28.90',
      tagUid: 'tag-inmo-casa',
      niche: 'inmobiliaria',
    },
    hotel: {
      title: 'Colgadores de Pomo Troquelados & Llavero Motel Vintage',
      subtitle: 'Para puertas de suite y llaves: WiFi del hotel sin teclear contraseñas, pedir servicio de habitaciones y guía turística.',
      category: 'Hoteles Boutique & Casas Rurales',
      shape: 'FORMA: COLGADOR POMO / LLAVE RETRO',
      image: '/src/assets/images/diecut_hotel_key_hanger_1793489503883.jpg',
      price: '€26.50',
      tagUid: 'tag-hotel-suite',
      niche: 'hotel',
    },
    pan: {
      title: 'Peana Troquelada "Croissant Dorado" & Pegatinas de Tartas',
      subtitle: 'Mostrador de pan recién horneado y cajas de repostería: consulta alérgenos y encarga tartas de cumpleaños por WhatsApp.',
      category: 'Panaderías & Pastelerías Artesanas',
      shape: 'FORMA: CROISSANT FRANCÉS DE MANTEQUILLA',
      image: '/src/assets/images/diecut_croissant_bakery_1793489472692.jpg',
      price: '€23.90',
      tagUid: 'tag-pan-croissant',
      niche: 'panaderia',
    },
    taller: {
      title: 'Peana "Llave Inglesa" & Adhesivo Luna de Parabrisas',
      subtitle: 'Soporte troquelado en mostrador y adhesivo electrostático sin pegamento en el parabrisas para avisos de ITV y cambio de aceite.',
      category: 'Talleres Mecánicos & Automoción',
      shape: 'FORMA: LLAVE INGLESA & COCHE',
      image: '/src/assets/images/diecut_mechanic_wrench_keychain_1793488413939.jpg',
      price: '€27.90',
      tagUid: 'tag-taller-llave',
      niche: 'taller',
    },
    gym: {
      title: 'Soporte "Pesa Rusa Kettlebell" & Adhesivos Mancuerna',
      subtitle: 'Recepción del box de crossfit y vinilos en máquinas para ver el tutorial con la técnica correcta de levantamiento en vídeo.',
      category: 'Gimnasios & Crossfit Boxes',
      shape: 'FORMA: PESA RUSA KETTLEBELL & MANCUERNA',
      image: '/src/assets/images/diecut_gym_kettlebell_stand_1793488413535.jpg',
      price: '€26.50',
      tagUid: 'tag-gym-kettlebell',
      niche: 'fitness',
    },
    tattoo: {
      title: 'Placa Troquelada "Máquina de Tatuar / Calavera"',
      subtitle: 'En recepción del estudio: descarga instantánea de protocolo de cicatrización y cuidados, Instagram y reseñas.',
      category: 'Estudios de Tatuaje & Piercing',
      shape: 'FORMA: MÁQUINA DE TATUAR & CALAVERA',
      image: '/src/assets/images/diecut_tattoo_skull_stand_1793490406395.jpg',
      price: '€27.00',
      tagUid: 'tag-tattoo-skull',
      niche: 'tatuajes',
    },
    estetica: {
      title: 'Peana Troquelada "Frasco de Esmalte de Uñas"',
      subtitle: 'En mesas de manicura y estética: catálogo nail-art y cita previa por WhatsApp mientras se secan las uñas.',
      category: 'Salones de Belleza & Nail Spa',
      shape: 'FORMA: FRASCO DE ESMALTE MANICURA',
      image: '/src/assets/images/diecut_nail_polish_stand_1793490420339.jpg',
      price: '€24.00',
      tagUid: 'tag-unassigned-forma',
      niche: 'estetica',
    },
    floristeria: {
      title: 'Tags para Macetas "Hoja de Monstera & Regadera"',
      subtitle: 'Pinchos impermeables para plantas: toca con el móvil para ver la frecuencia de riego, luz solar y abono.',
      category: 'Floristerías & Plant Shops',
      shape: 'FORMA: HOJA DE MONSTERA DELICIOSA',
      image: '/src/assets/images/diecut_monstera_stake_1793490433131.jpg',
      price: '€17.50',
      tagUid: 'tag-unassigned-forma',
      niche: 'floristeria',
    },
    lavadero: {
      title: 'Adhesivos "Coche Deportivo con Burbujas de Lavado"',
      subtitle: 'Vinilo exterior para pistas de lavado a presión: compra o renovación de bonos de 10 lavados sin bajarte del coche.',
      category: 'Lavaderos & Detailing',
      shape: 'FORMA: COCHE DEPORTIVO CON ESPUMA',
      image: '/src/assets/images/diecut_carwash_foam_sticker_1793490448308.jpg',
      price: '€21.00',
      tagUid: 'tag-unassigned-forma',
      niche: 'lavadero',
    },
    joyeria: {
      title: 'Peana Troquelada "Diamante Facetado" de Alta Gama',
      subtitle: 'En vitrinas y mostradores de joyería: consulta el certificado gemológico digital en PDF y concierta citas privadas por WhatsApp.',
      category: 'Joyerías & Alta Relojería',
      shape: 'FORMA: DIAMANTE TALLA BRILLANTE FACETADO',
      image: '/src/assets/images/diecut_diamond_jewelry_1793499953305.jpg',
      price: '€29.90',
      tagUid: 'tag-joyeria-diamante',
      niche: 'joyeria',
    },
    optica: {
      title: 'Peana Troquelada "Gafas de Pasta en Carey"',
      subtitle: 'En mostradores de óptica: abre el probador virtual con cámara, solicita cita de gabinete o consulta tu graduación.',
      category: 'Ópticas & Gabinetes de Visión',
      shape: 'FORMA: MONTURA DE GAFAS VINTAGE EN CAREY',
      image: '/src/assets/images/diecut_glasses_optics_1793499970610.jpg',
      price: '€25.50',
      tagUid: 'tag-optica-gafas',
      niche: 'optica',
    },
    cerveceria: {
      title: 'Peana Troquelada "Jarra de Cerveza con Espuma 3D"',
      subtitle: 'En la barra junto a los grifos: pizarra de tiradores artesanos en tiempo real (IBUs, grados y lúpulos) con 1 solo toque.',
      category: 'Cervecerías Artesanales & Taprooms',
      shape: 'FORMA: JARRA CERVECERA BÁVARA CON ESPUMA',
      image: '/src/assets/images/diecut_beer_stein_1793499989573.jpg',
      price: '€26.90',
      tagUid: 'tag-beer-jarra',
      niche: 'cerveceria',
    },
    heladeria: {
      title: 'Peana Troquelada "Cucurucho de Helado Pastel"',
      subtitle: 'En vitrinas de helado artesano: tabla de sabores de temporada, opciones sin gluten certificadas y valoraciones en Google.',
      category: 'Heladerías & Gelaterias',
      shape: 'FORMA: CUCURUCHO DE BARQUILLO GOFRADO',
      image: '/src/assets/images/diecut_ice_cream_1793500007102.jpg',
      price: '€23.50',
      tagUid: 'tag-helado-cucurucho',
      niche: 'heladeria',
    },
    burger: {
      title: 'Peana Troquelada "Hamburguesa Gourmet con Queso Fundido"',
      subtitle: 'En cada mesa de la burger house: carta smash burgers en PDF, selección de punto de la carne y pedidos sin esperas.',
      category: 'Hamburgueserías & Smash Burgers',
      shape: 'FORMA: HAMBURGUESA DOBLE CON CHEDDAR',
      image: '/src/assets/images/diecut_burger_gourmet_1793500024227.jpg',
      price: '€24.90',
      tagUid: 'tag-burger-house',
      niche: 'burger',
    },
    mascotas: {
      title: 'Peana & Llaveros "Hueso Canino con Huellas"',
      subtitle: 'En mostrador de peluquería canina y spa: ficha de cuidados del pelo, descuento en próximo baño y llaveros con chip para el collar.',
      category: 'Peluquerías Caninas & Spa Mascotas',
      shape: 'FORMA: HUESO CANINO & HUELLA DE MASCOTA',
      image: '/src/assets/images/diecut_dog_bone_1793500043899.jpg',
      price: '€27.50',
      tagUid: 'tag-pet-grooming',
      niche: 'mascotas',
    },
  };

  const currentHero = heroShowcaseMap[heroNiche] || heroShowcaseMap.pizza;

  const niches = [
    { id: 'all', label: 'Todos los Formatos' },
    { id: 'dental', label: 'Dentistas (Muela & Cepillo)' },
    { id: 'pizzeria', label: 'Pizzerías (Pizza & Vespa)' },
    { id: 'joyeria', label: 'Joyerías (Diamante)' },
    { id: 'optica', label: 'Ópticas (Gafas Carey)' },
    { id: 'cerveceria', label: 'Cervecerías (Jarra Espuma)' },
    { id: 'heladeria', label: 'Heladerías (Cucurucho)' },
    { id: 'burger', label: 'Burgers (Hamburguesa)' },
    { id: 'inmobiliaria', label: 'Inmobiliarias (Casita & Llavero)' },
    { id: 'hotel', label: 'Hoteles (Pomo & Llave Retro)' },
    { id: 'panaderia', label: 'Panaderías (Croissant & Tartas)' },
    { id: 'taller', label: 'Talleres (Llave & Parabrisas)' },
    { id: 'fitness', label: 'Gimnasios (Kettlebell & Mancuerna)' },
    { id: 'farmacia', label: 'Farmacias (Cruz & Cápsula)' },
    { id: 'marisqueria', label: 'Marisquerías (Centollo & Ostra)' },
    { id: 'cafeteria', label: 'Cafeterías (Taza Suelo & Posavasos)' },
    { id: 'tatuajes', label: 'Tatuajes (Máquina & Calavera)' },
    { id: 'estetica', label: 'Estética & Uñas (Esmalte)' },
    { id: 'floristeria', label: 'Floristerías (Hoja Monstera)' },
    { id: 'lavadero', label: 'Lavaderos (Coche Burbujas)' },
    { id: 'mascotas', label: 'Mascotas & Spa (Hueso & Huella)' },
    { id: 'barberia', label: 'Barberías (Tijeras & Navaja)' },
    { id: 'universal', label: 'Universal (Escudo 5★)' },
  ];

  const filteredProducts = selectedNiche === 'all'
    ? products
    : products.filter((p) => p.niche === selectedNiche || (selectedNiche === 'universal' && p.niche === 'universal'));

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      
      {/* 1. Hero Section on Clean White Background */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Subtle geometric background accents */}
        <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-50 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-orange-50 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left: Value proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Troquelados Asequibles por Nicho · Chip NFC & QR Dinámico</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Soportes Físicos con Formas Originales para Cada Negocio
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Cartelería troquelada, vinilos de suelo, imanes, chapas y llaveros. Diseños con siluetas icónicas (muelas para dentistas, porciones de pizza para pizzerías, pesas rusas para gimnasios, llaves inglesas para talleres o cruces para farmacias) con espacio reservado para la etiqueta QR y chip NFC.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={scrollToCatalog}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <span>Explorar Formatos Troquelados</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSimulateTag('tag-pizza-slice')}
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-xl text-sm transition-all border border-slate-300 flex items-center gap-2"
              >
                <Nfc className="w-4 h-4 text-emerald-600" />
                <span>Simular Tap de la Pizza / Muela / Llave</span>
              </button>
            </div>

            {/* Quick Proof Metrics */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 max-w-lg text-xs">
              <div>
                <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">22 Nichos</div>
                <div className="text-slate-500 mt-0.5">70+ Formatos troquelados</div>
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">Hueco QR</div>
                <div className="text-slate-500 mt-0.5">Espacio reservado con rotuladora</div>
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">Chip Pasivo</div>
                <div className="text-slate-500 mt-0.5">NTAG215 sin pilas eterno</div>
              </div>
            </div>

          </div>

          {/* Hero Right: Interactive die-cut showcase card with shape switcher */}
          <div className="lg:col-span-5">
            {/* Quick Shape Switcher Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
              {[
                { id: 'pizza', label: '🍕 Pizza' },
                { id: 'dental', label: '🦷 Dental' },
                { id: 'joyeria', label: '💎 Joyería' },
                { id: 'optica', label: '👓 Óptica' },
                { id: 'cerveceria', label: '🍺 Cervecería' },
                { id: 'heladeria', label: '🍦 Heladería' },
                { id: 'burger', label: '🍔 Burger' },
                { id: 'mascotas', label: '🦴 Mascotas Spa' },
                { id: 'inmo', label: '🏠 Inmobiliaria' },
                { id: 'hotel', label: '🏨 Hotel' },
                { id: 'pan', label: '🥐 Panadería' },
                { id: 'taller', label: '🔧 Taller' },
                { id: 'gym', label: '🏋️ Gym' },
                { id: 'tattoo', label: '💀 Tattoo' },
                { id: 'estetica', label: '💅 Esmalte Uñas' },
                { id: 'floristeria', label: '🌿 Monstera' },
                { id: 'lavadero', label: '🚗 Lavadero' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setHeroNiche(tab.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all shrink-0 border ${
                    heroNiche === tab.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xl group hover:shadow-2xl transition-all">
              <div className="aspect-[4/3] bg-slate-50 overflow-hidden relative">
                <img
                  src={currentHero.image}
                  alt={currentHero.title}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-200 text-xs font-mono text-emerald-700 font-bold flex items-center gap-1.5 shadow-sm">
                  <Nfc className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{currentHero.shape}</span>
                </div>
              </div>

              <div className="p-6 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider text-emerald-800 font-bold">
                    {currentHero.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 font-mono text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>Silueta Original</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {currentHero.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {currentHero.subtitle}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Desde unidad suelta:</span>
                    <span className="text-xl font-bold font-mono text-slate-900">{currentHero.price}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSimulateTag(currentHero.tagUid)}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Nfc className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Probar Tap</span>
                    </button>
                    <button
                      onClick={() => {
                        const targetProduct = products.find(p => p.niche === currentHero.niche) || products[0];
                        onSelectProduct(targetProduct);
                      }}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                    >
                      Configurar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* 2. Scalable Niche Matrix: 16+ business sectors with custom shapes & new proposals */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 bg-slate-50/60 rounded-3xl my-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-mono text-emerald-700 uppercase tracking-wider font-bold mb-2">
            EL MODELO DE ESCALABILIDAD AHORRAAI POR NICHOS
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Una silueta reconocible para cada profesión y necesidad
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Los troquelados se fabrican asequibles en masa sin marcas individuales. Solo pegas la etiqueta adhesiva neutra con rotuladora que contiene el QR dinámico y chip NFC.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* 1. Dental */}
          <div 
            onClick={() => setSelectedNiche('dental')}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Dentistas & Clínicas
            </h3>
            <div className="text-xs font-medium text-sky-700 mb-2 font-mono">
              Silueta: Muela + Pack Imanes Cepillo
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Peana muela en recepción para 5★ Google + imán de cepillo y tubo de pasta que el paciente se lleva a la nevera de su casa para urgencias.
            </p>
          </div>

          {/* 2. Pizzerías */}
          <div 
            onClick={() => setSelectedNiche('pizzeria')}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Pizza className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Pizzerías & Trattorias
            </h3>
            <div className="text-xs font-medium text-orange-700 mb-2 font-mono">
              Silueta: Porción Pizza + Vespa Delivery
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Peana triangular de pizza en mesa para carta y WiFi + adhesivo troquelado de scooter Vespa en cada caja de delivery para repetir pedido en 1 tap.
            </p>
          </div>

          {/* 3. Inmobiliarias (NUEVO) */}
          <div 
            onClick={() => setSelectedNiche('inmobiliaria')}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Home className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Inmobiliarias & Fincas
            </h3>
            <div className="text-xs font-medium text-teal-700 mb-2 font-mono">
              Silueta: Casita Nórdica + Llavero
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Soporte de casa minimalista para escaparate o mesa de firmas + llavero de entrega de llaves con chip NFC para tour virtual 360º y dossier PDF.
            </p>
          </div>

          {/* 4. Hoteles & Turismo (NUEVO) */}
          <div 
            onClick={() => setSelectedNiche('hotel')}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Hotel className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Hoteles & Casas Rurales
            </h3>
            <div className="text-xs font-medium text-emerald-800 mb-2 font-mono">
              Silueta: Colgador Pomo + Llavero Retro
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Colgador troquelado para pomo de suite: el huésped acerca el smartphone para WiFi sin contraseña, room service por WhatsApp y guía turística.
            </p>
          </div>

          {/* 5. Panaderías & Pastelerías (NUEVO) */}
          <div 
            onClick={() => setSelectedNiche('panaderia')}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Tag className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Panaderías & Pastelerías
            </h3>
            <div className="text-xs font-medium text-amber-800 mb-2 font-mono">
              Silueta: Croissant Francés + Tartas
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Soporte troquelado de croissant dorado en mostrador y adhesivos para cajas de tartas: consulta de alérgenos y encargos de cumpleaños por WhatsApp.
            </p>
          </div>

          {/* 6. Talleres Mecánicos */}
          <div 
            onClick={() => setSelectedNiche('taller')}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Talleres Mecánicos
            </h3>
            <div className="text-xs font-medium text-blue-700 mb-2 font-mono">
              Silueta: Llave Inglesa + Luna Parabrisas
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Peana de llave inglesa en caja + vinilo electrostático sin pegamento en el parabrisas interior para consultar próxima ITV y cita de aceite en 1 tap.
            </p>
          </div>

          {/* 7. Gimnasios & Crossfit */}
          <div 
            onClick={() => setSelectedNiche('fitness')}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Gimnasios & Crossfit
            </h3>
            <div className="text-xs font-medium text-slate-800 mb-2 font-mono">
              Silueta: Pesa Rusa + Mancuerna Racks
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kettlebell en recepción del box y adhesivos vinílicos de mancuerna en máquinas para ver vídeos de técnica de levantamiento y WOD del día.
            </p>
          </div>

          {/* 8. Farmacias & Ópticas */}
          <div 
            onClick={() => setSelectedNiche('farmacia')}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Cross className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Farmacias & Ópticas
            </h3>
            <div className="text-xs font-medium text-emerald-700 mb-2 font-mono">
              Silueta: Cruz Verde + Cápsula Rápida
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cruz verde en cristal de guardia 24h + peana troquelada de cápsula bicolor en mostrador para encargar recetas crónicas por WhatsApp y saltar colas.
            </p>
          </div>

          {/* 9. Marisquerías */}
          <div 
            onClick={() => setSelectedNiche('marisqueria')}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Fish className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Marisquerías & Pescados
            </h3>
            <div className="text-xs font-medium text-red-600 mb-2 font-mono">
              Silueta: Centollo / Cigala + Chapa Staff
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Soporte de madera marina en mesas para carta de lonja + chapas magnéticas de gamba/ostra en el polo de los camareros para reseñas y propinas.
            </p>
          </div>

          {/* 10. Bares & Cafeterías */}
          <div 
            onClick={() => setSelectedNiche('cafeteria')}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Coffee className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Bares & Cafeterías
            </h3>
            <div className="text-xs font-medium text-amber-700 mb-2 font-mono">
              Silueta: Taza Suelo + Posavasos Grano
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vinilos gigantes antideslizantes para el suelo de la barra + posavasos lavables de corcho con chip NFC para conectar al WiFi sin pedir clave.
            </p>
          </div>

          {/* 11. Estudios de Tatuaje (NUEVO) */}
          <div 
            onClick={() => setSelectedNiche('tatuajes')}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Brush className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Tatuajes & Piercing
            </h3>
            <div className="text-xs font-medium text-zinc-800 mb-2 font-mono">
              Silueta: Máquina Rotativa & Calavera
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Placa troquelada negra en recepción: el cliente descarga la guía de cicatrización y curas del tattoo, sigue en Instagram y valora en Google.
            </p>
          </div>

          {/* 12. Salones de Uñas & Estética (NUEVO) */}
          <div 
            onClick={() => setSelectedNiche('estetica')}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Estética, Uñas & Spa
            </h3>
            <div className="text-xs font-medium text-pink-700 mb-2 font-mono">
              Silueta: Frasco de Esmalte Manicura
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Peana troquelada en la mesa de manicura: la clienta apoya el móvil mientras se secan las uñas para ver el catálogo y reservar cita por WhatsApp.
            </p>
          </div>

          {/* 13. Floristerías & Plantas (NUEVO) */}
          <div 
            onClick={() => setSelectedNiche('floristeria')}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Flower2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Floristerías & Viveros
            </h3>
            <div className="text-xs font-medium text-emerald-700 mb-2 font-mono">
              Silueta: Pincho Hoja Monstera
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pinchos impermeables que se clavan en la maceta: el comprador toca con el móvil y accede a la guía de riego, sol y abono de esa planta.
            </p>
          </div>

          {/* 14. Lavaderos & Detailing (NUEVO) */}
          <div 
            onClick={() => setSelectedNiche('lavadero')}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Lavaderos & Detailing
            </h3>
            <div className="text-xs font-medium text-cyan-700 mb-2 font-mono">
              Silueta: Coche con Espuma Lavado
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vinilo exterior troquelado en cabinas y túneles: renueva bonos de 10 lavados y paga sin bajarte del coche aproximando el smartphone.
            </p>
          </div>

          {/* 15. Barberías & Peluquerías */}
          <div 
            onClick={() => setSelectedNiche('barberia')}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Scissors className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Barberías & Estilistas
            </h3>
            <div className="text-xs font-medium text-slate-700 mb-2 font-mono">
              Silueta: Tijeras Clásicas & Navaja Espejo
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Llavero acrílico con forma de tijeras y adhesivo de navaja para la esquina del espejo frente al sillón de corte para reservar el siguiente turno.
            </p>
          </div>

          {/* 16. Veterinarias */}
          <div 
            onClick={() => setSelectedNiche('mascotas')}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <PawPrint className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Veterinarias & Mascotas
            </h3>
            <div className="text-xs font-medium text-teal-700 mb-2 font-mono">
              Silueta: Huella de Mascota Imantada
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Imán de nevera troquelado con forma de huella y peana de hueso con llaveros identificadores para el collar de la mascota.
            </p>
          </div>

          {/* 17. Joyerías & Relojería (NUEVO) */}
          <div 
            onClick={() => setSelectedNiche('joyeria')}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Gem className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Joyerías & Relojería
            </h3>
            <div className="text-xs font-medium text-amber-700 mb-2 font-mono">
              Silueta: Diamante Facetado
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Peana facetada en metacrilato de alta gama y base en oro cepillado: el cliente abre el certificado gemológico digital en PDF y concierta citas privadas por WhatsApp.
            </p>
          </div>

          {/* 18. Ópticas & Gabinetes (NUEVO) */}
          <div 
            onClick={() => setSelectedNiche('optica')}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Glasses className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Ópticas & Visión
            </h3>
            <div className="text-xs font-medium text-sky-700 mb-2 font-mono">
              Silueta: Gafas de Pasta en Carey
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Silueta anatómica de gafas en carey sobre mostrador de exposición: probador virtual de monturas con cámara y cita directa para graduación de la vista.
            </p>
          </div>

          {/* 19. Cervecerías Artesanales (NUEVO) */}
          <div 
            onClick={() => setSelectedNiche('cerveceria')}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Beer className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Cervecerías & Brewpubs
            </h3>
            <div className="text-xs font-medium text-amber-800 mb-2 font-mono">
              Silueta: Jarra Bávara con Espuma
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Acrílico ámbar translúcido y base de roble resistente a líquidos junto a los grifos: consulta de la pizarra viva de tiradores, IBUs, lúpulos y alcoholes.
            </p>
          </div>

          {/* 20. Heladerías Artesanales (NUEVO) */}
          <div 
            onClick={() => setSelectedNiche('heladeria')}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <IceCream className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Heladerías & Gelaterias
            </h3>
            <div className="text-xs font-medium text-emerald-700 mb-2 font-mono">
              Silueta: Cucurucho Barquillo Pastel
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Barquillo gofrado con bolas en tonos pastel sobre la vitrina: tabla de sabores de temporada, sello sin gluten para celíacos y reseñas en Google.
            </p>
          </div>

          {/* 21. Hamburgueserías & Smash Burgers (NUEVO) */}
          <div 
            onClick={() => setSelectedNiche('burger')}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Hamburgueserías Gourmet
            </h3>
            <div className="text-xs font-medium text-rose-700 mb-2 font-mono">
              Silueta: Burger Doble & Cheddar
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Troquelado multicapa resistente a grasas y salsas en cada mesa: carta smash burgers en PDF, punto de la carne y pedidos take-away por WhatsApp.
            </p>
          </div>

        </div>

        {/* The Universal Rule */}
        <div className="mt-10 p-6 bg-white border border-slate-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block font-bold text-sm mb-0.5">
                La misma base física para todo tu nicho
              </strong>
              <span>
                El WiFi es universal; la muela es universal para cualquier dentista; la porción de pizza para cualquier pizzería; la llave para talleres. El troquelado se produce a escala y la etiqueta neutra se asigna en 30 segundos.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Products Catalog Grid */}
      <section id="catalog" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono text-emerald-700 uppercase tracking-wider font-bold mb-1">
              CATÁLOGO DE PRODUCTOS TROQUELADOS POR SECTOR
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Formatos Físicos con Siluetas Asequibles & Chip NFC
            </h2>
          </div>

          {/* Filter tabs by niche */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl">
            {niches.map((n) => (
              <button
                key={n.id}
                onClick={() => setSelectedNiche(n.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedNiche === n.id
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid on Clean White */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-slate-300 hover:shadow-xl transition-all group"
            >
              <div>
                {/* Product Image */}
                <div 
                  className="aspect-[4/3] bg-slate-50 overflow-hidden relative cursor-pointer border-b border-slate-100 p-4" 
                  onClick={() => onSelectProduct(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono text-slate-700 border border-slate-200 font-semibold shadow-sm">
                    {product.dieCutShape}
                  </div>

                  {product.badgeTag && (
                    <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2.5 py-1 rounded-md text-[10px] font-bold shadow-sm">
                      {product.badgeTag}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">
                    <span>{product.category}</span>
                    <span className="font-mono text-emerald-700 lowercase font-bold">{product.chipType}</span>
                  </div>

                  <h3 
                    onClick={() => onSelectProduct(product)}
                    className="text-base font-bold text-slate-900 hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    {product.name}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {product.subtitle}
                  </p>

                  {/* Reserved QR space highlight */}
                  <div className="mt-3 p-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700 flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">{product.stickerReservedArea}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer & Purchase */}
              <div className="p-5 pt-0">
                <div className="flex items-center justify-between mb-3 border-t border-slate-100 pt-3">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Unidad individual:</span>
                    <span className="text-xl font-bold font-mono text-slate-900">
                      €{product.price.toFixed(2)}
                    </span>
                  </div>

                  {product.unitPackOptions.length > 1 && (
                    <span className="text-xs text-emerald-700 font-bold font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Pack hasta -{product.unitPackOptions[product.unitPackOptions.length - 1].discountPercent}%
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Ficha Técnica
                  </button>

                  <button
                    onClick={() => onAddToCart(product, 1, product.price)}
                    className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/15"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Comprar
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </section>

      {/* 4. Production & Supabase Callout */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
              <Cpu className="w-4 h-4" />
              <span>STACK TÉCNICO: GITHUB + SUPABASE + VERCEL</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Gestión de Negocios & Redirección Dinámica
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Asigna soportes troquelados neutros en lote con chip NFC y QR a cualquier nuevo cliente, y personaliza su espacio con colores de marca, carta PDF, WiFi y reseñas en Google.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={onNavigateToSupabase}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 border border-slate-700"
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              Ver Código SQL Supabase
            </button>
            <button
              onClick={onNavigateToBusinesses}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <span>Gestión de Negocios & Tags</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
