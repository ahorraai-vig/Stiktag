import React, { useState, useEffect, useRef } from 'react';
import { 
  Nfc, 
  QrCode, 
  Smartphone, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Radio, 
  Copy, 
  Check, 
  Plus,
  Layers,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  ExternalLink
} from 'lucide-react';
import QRCode from 'qrcode';
import { NfcQrTag, ProductFormatId } from '../types';

interface NfcHardwareTesterProps {
  tags: Record<string, NfcQrTag>;
  onTestTagUid: (tagUid: string) => void;
  onGenerateBatch: (productType: ProductFormatId, count: number, shapeName?: string, chipModel?: 'NTAG213' | 'NTAG215') => void;
  onNavigateToBusinesses?: (tagUid?: string) => void;
}

export const NfcHardwareTester: React.FC<NfcHardwareTesterProps> = ({
  tags,
  onTestTagUid,
  onGenerateBatch,
  onNavigateToBusinesses,
}) => {
  const [selectedTagUid, setSelectedTagUid] = useState<string>('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  
  // Batch generation form
  const [batchCount, setBatchCount] = useState<number>(5);
  const [batchFormat, setBatchFormat] = useState<ProductFormatId>('troquel_carteleria');
  const [batchShape, setBatchShape] = useState<string>('Peana Troquelada Nicho');
  const [batchChip, setBatchChip] = useState<'NTAG213' | 'NTAG215'>('NTAG215');
  const [batchCreatedSuccess, setBatchCreatedSuccess] = useState<boolean>(false);

  // Real Web NFC API detection
  const [hasWebNfc, setHasWebNfc] = useState<boolean>(false);
  const [isNfcScanning, setIsNfcScanning] = useState<boolean>(false);
  const [nfcReadingMessage, setNfcReadingMessage] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  // Camera QR scanner stream
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Set default selected tag
  useEffect(() => {
    const tagList = Object.values(tags);
    if (tagList.length > 0 && !selectedTagUid) {
      const neutralTag = tagList.find((t) => t.status === 'unassigned');
      setSelectedTagUid(neutralTag ? neutralTag.tagUid : tagList[0].tagUid);
    }
  }, [tags, selectedTagUid]);

  const currentTag = tags[selectedTagUid] || Object.values(tags)[0] || {
    tagUid: 'tag-neutro-demo',
    serialNumber: 'AAI-NEUTRO-01',
    dieCutShape: 'Peana Troquelada Neutra',
    chipModel: 'NTAG215',
    status: 'unassigned',
    claimToken: 'PIN-8842',
  };

  const targetUrl = `https://ahorraai.com/t/${currentTag.tagUid}`;

  useEffect(() => {
    if ('NDEFReader' in window) {
      setHasWebNfc(true);
    }
  }, []);

  useEffect(() => {
    if (targetUrl) {
      QRCode.toDataURL(targetUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      }).then(setQrCodeDataUrl);
    }
  }, [targetUrl]);

  const handleStartWebNfc = async () => {
    if (!('NDEFReader' in window)) {
      setNfcReadingMessage('Tu navegador actual no soporta Web NFC API directa. Usa Google Chrome en Android o la app NFC Tools en tu teléfono.');
      return;
    }

    try {
      // @ts-ignore
      const ndef = new window.NDEFReader();
      await ndef.scan();
      setIsNfcScanning(true);
      setNfcReadingMessage('¡Antena NFC activa! Acerca tu soporte troquelado con chip NFC...');

      // @ts-ignore
      ndef.onreading = (event: any) => {
        const serialNumber = event.serialNumber;
        setNfcReadingMessage(`¡Chip detectado! Hardware UID: ${serialNumber}`);
        for (const record of event.message.records) {
          if (record.recordType === 'url') {
            const textDecoder = new TextDecoder(record.encoding);
            const url = textDecoder.decode(record.data);
            setNfcReadingMessage(`Lectura NDEF URL: ${url}`);
          }
        }
      };

      // @ts-ignore
      ndef.onreadingerror = () => {
        setNfcReadingMessage('Error al leer el chip. Mantén el chip quieto a 2-3 cm.');
      };
    } catch (error: any) {
      setNfcReadingMessage(`Permiso NFC denegado o error: ${error.message}`);
      setIsNfcScanning(false);
    }
  };

  const handleToggleCamera = async () => {
    if (cameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraActive(true);
      } catch (err) {
        alert('No se pudo acceder a la cámara. Comprueba los permisos en el navegador.');
      }
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleTriggerGenerateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateBatch(batchFormat, batchCount, batchShape, batchChip);
    setBatchCreatedSuccess(true);
    setTimeout(() => setBatchCreatedSuccess(false), 3000);
  };

  const neutralTagsList = Object.values(tags).filter((t) => t.status === 'unassigned');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-bold mb-1">
              <Radio className="w-4 h-4 animate-pulse text-emerald-600" />
              <span>LABORATORIO HARDWARE · IDENTIDADES NEUTRAS & CHIPS NFC</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Generador de Identidades Neutras & Lector NFC
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Genera en lote códigos QR neutros con chip NFC dedicado NTAG213/215 listos para imprimir en rotuladora (30×30 mm). Cada soporte nace con una identidad neutra que queda en espera hasta que consigues el cliente y se la asignas.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onNavigateToBusinesses && (
              <button
                onClick={() => onNavigateToBusinesses()}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-sm"
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Ir a Gestión de Negocios</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Tag Selector Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Soporte en banco de pruebas:</span>
            <select
              value={selectedTagUid}
              onChange={(e) => setSelectedTagUid(e.target.value)}
              className="bg-white border border-slate-300 text-xs text-slate-900 font-bold rounded-xl px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-xs max-w-md truncate"
            >
              <optgroup label={`Identidades Neutras Libres (${neutralTagsList.length})`}>
                {neutralTagsList.map((t) => (
                  <option key={t.id} value={t.tagUid}>
                    [Libre] {t.tagUid} — {t.dieCutShape} ({t.chipModel || 'NTAG215'})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Soportes Asignados a Clientes">
                {Object.values(tags).filter((t) => t.status === 'active').map((t) => (
                  <option key={t.id} value={t.tagUid}>
                    [Asignado] {t.tagUid} — {t.dieCutShape}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Estado:</span>
            <span className={`px-2.5 py-1 rounded-full font-mono text-[11px] font-bold ${
              currentTag.status === 'unassigned' 
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}>
              {currentTag.status === 'unassigned' ? 'NEUTRO (SIN ASIGNAR)' : 'ASIGNADO A CLIENTE'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: 3 Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* MODULE 1: GENERADOR DE IDENTIDADES NEUTRAS EN LOTE (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Generar Identidades Neutras en Lote</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              POOL DE STOCK
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Crea códigos QR únicos con chip NFC pasivo pre-asociado y clave PIN de reclamación. Se generan en estado <strong>neutro</strong> para imprimir en tu rotuladora y pegar en las peanas troqueladas antes de salir a vender.
          </p>

          <form onSubmit={handleTriggerGenerateBatch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Cantidad de unidades neutras a generar:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 5, 10, 25].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setBatchCount(cnt)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      batchCount === cnt
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cnt} uds
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Formato físico troquelado de destino:
              </label>
              <select
                value={batchFormat}
                onChange={(e) => {
                  const fmt = e.target.value as ProductFormatId;
                  setBatchFormat(fmt);
                  if (fmt === 'troquel_carteleria') setBatchShape('Peana Troquelada Nicho');
                  else if (fmt === 'troquel_suelo') setBatchShape('Vinilo de Suelo Antideslizante');
                  else if (fmt === 'llaveros_troquelados') setBatchShape('Llavero Acrílico Troquelado');
                  else if (fmt === 'imanes_troquelados') setBatchShape('Imán de Nevera Troquelado');
                  else if (fmt === 'chapas_nfc') setBatchShape('Chapa Pin con Alfiler');
                  else if (fmt === 'colgadores_pomos') setBatchShape('Colgador de Pomo Habitación');
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="troquel_carteleria">Peanas & Cartelería Troquelada de Mesa</option>
                <option value="troquel_suelo">Adhesivos Troquelados de Suelo Antideslizante</option>
                <option value="llaveros_troquelados">Llaveros Acrílicos Troquelados</option>
                <option value="imanes_troquelados">Imanes Troquelados para Frigorífico</option>
                <option value="chapas_nfc">Chapas / Badges con Pin Metálico</option>
                <option value="colgadores_pomos">Colgadores de Pomo para Hoteles & Villas</option>
                <option value="posavasos_troquelados">Posavasos Rígidos Lavables</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chip NFC Pasivo:
                </label>
                <select
                  value={batchChip}
                  onChange={(e) => setBatchChip(e.target.value as 'NTAG213' | 'NTAG215')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white"
                >
                  <option value="NTAG215">NTAG215 (504 bytes)</option>
                  <option value="NTAG213">NTAG213 (144 bytes)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Silueta Troquelada:
                </label>
                <input
                  type="text"
                  value={batchShape}
                  onChange={(e) => setBatchShape(e.target.value)}
                  placeholder="Ej: Muela, Pizza, Llave"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generar Lote de {batchCount} Identidades Neutras</span>
            </button>

            {batchCreatedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>¡Lote añadido con éxito al pool de identidades disponibles!</span>
              </div>
            )}
          </form>

          {/* Neutral stock list */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-2 font-bold">
              <span>Tags Neutros en Stock ({neutralTagsList.length})</span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {neutralTagsList.slice(0, 8).map((tag) => (
                <div
                  key={tag.id}
                  onClick={() => setSelectedTagUid(tag.tagUid)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors flex items-center justify-between ${
                    selectedTagUid === tag.tagUid
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="truncate">
                    <span className="font-mono text-[11px]">{tag.tagUid}</span>
                    <span className="text-[10px] text-slate-500 block truncate">{tag.dieCutShape}</span>
                  </div>
                  <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                    PIN {tag.claimToken}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MODULE 2: ETIQUETA ROTULADORA TÉRMICA & PRUEBA FÍSICA (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>Etiqueta para Rotuladora (30×30 mm)</span>
            </h3>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              TÉRMICA / VINILO
            </span>
          </div>

          <div className="text-center">
            {/* Real Rotuladora Sticker Simulation */}
            <div className="inline-block bg-white p-4 rounded-2xl border-2 border-dashed border-slate-300 shadow-md relative">
              
              {/* Sticker Frame */}
              <div className="w-48 h-48 bg-white border border-slate-800 rounded-xl p-3 flex flex-col items-center justify-between relative shadow-inner">
                
                {/* Header of sticker */}
                <div className="w-full flex items-center justify-between text-[9px] font-mono font-bold text-slate-800 border-b border-slate-200 pb-1">
                  <div className="flex items-center gap-1">
                    <Radio className="w-3 h-3 text-emerald-600" />
                    <span>AhorraAI</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Nfc className="w-3 h-3 text-slate-700" />
                    <span>NFC TAP</span>
                  </div>
                </div>

                {/* The QR */}
                <div className="my-auto">
                  {qrCodeDataUrl ? (
                    <img
                      src={qrCodeDataUrl}
                      alt="QR para imprimir"
                      className="w-28 h-28 object-contain"
                    />
                  ) : (
                    <div className="w-28 h-28 bg-slate-100 flex items-center justify-center">
                      <QrCode className="w-8 h-8 text-slate-400" />
                    </div>
                  )}
                </div>

                {/* Footer of sticker */}
                <div className="w-full text-center border-t border-slate-200 pt-1">
                  <div className="font-mono text-[9px] font-extrabold text-slate-900 truncate">
                    {currentTag.tagUid}
                  </div>
                  <div className="font-mono text-[8px] text-slate-500">
                    PIN: {currentTag.claimToken} • {currentTag.chipModel || 'NTAG215'}
                  </div>
                </div>

              </div>

              <div className="text-[10px] text-slate-500 mt-2 font-mono">
                Área reservada de 30×30 mm en el troquel
              </div>
            </div>

            {/* URL Display */}
            <div className="mt-4 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-left">
              <span className="text-[10px] font-mono text-slate-500 uppercase block mb-0.5">
                URL Grabada en QR y Chip NFC:
              </span>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] font-bold text-emerald-800 truncate">
                  {targetUrl}
                </span>
                <button
                  onClick={() => handleCopy(targetUrl)}
                  className="px-2 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg text-[10px] flex items-center gap-1 shrink-0 font-medium"
                >
                  {copiedUrl ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {copiedUrl ? 'Copiado' : 'Copiar'}
                </button>
              </div>
            </div>

            {/* Test Action */}
            <button
              onClick={() => onTestTagUid(currentTag.tagUid)}
              className="mt-4 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Simular Escaneo en Teléfono</span>
            </button>
          </div>
        </div>

        {/* MODULE 3: LECTOR REAL WEB NFC & CÁMARA (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Nfc className="w-4 h-4 text-emerald-600" />
              <span>Lector NFC & Cámara</span>
            </h3>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
              hasWebNfc ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {hasWebNfc ? 'Web NFC OK' : 'Emulador'}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Acerca una pegatina con chip NFC físico a la antena de tu dispositivo para verificar que lee la URL neutra sin errores de paridad.
          </p>

          <button
            onClick={handleStartWebNfc}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
              isNfcScanning
                ? 'bg-amber-500 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
            }`}
          >
            <Nfc className="w-4 h-4" />
            <span>{isNfcScanning ? 'Antena Escaneando...' : 'Escanear Chip NFC Físico'}</span>
          </button>

          {nfcReadingMessage && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-emerald-800 font-mono font-medium">
              {nfcReadingMessage}
            </div>
          )}

          {/* Camera Scanner */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900">Cámara Web:</span>
              <button
                onClick={handleToggleCamera}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Camera className="w-3 h-3 text-emerald-600" />
                <span>{cameraActive ? 'Apagar' : 'Encender'}</span>
              </button>
            </div>

            {cameraActive && (
              <div className="rounded-xl overflow-hidden bg-black aspect-square border border-slate-300 relative flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Quick guide */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 space-y-1.5 leading-relaxed">
            <div className="font-bold text-slate-800">Instrucciones para campo:</div>
            <div>1. Imprime la etiqueta 30×30 mm con rotuladora.</div>
            <div>2. Graba el chip NFC con la URL de arriba (NFC Tools).</div>
            <div>3. Pega la etiqueta en la hendidura del troquelado.</div>
            <div>4. Al contratar al cliente, asígnalo en el panel.</div>
          </div>
        </div>

      </div>

    </div>
  );
};
