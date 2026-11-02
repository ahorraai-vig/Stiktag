import React, { useState } from 'react';
import { 
  Database, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  Layers, 
  ShieldCheck, 
  Sparkles,
  GitBranch,
  Cloud,
  ExternalLink,
  ChevronRight,
  Shapes
} from 'lucide-react';
import { SUPABASE_SQL_SCHEMA } from '../data/supabaseScript';

export const SupabaseSqlViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'sql' | 'tables' | 'guide'>('sql');

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([SUPABASE_SQL_SCHEMA], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ahorraai-supabase-schema.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-bold">
              <Database className="w-4 h-4" />
              <span>SUPABASE POSTGRESQL ARCHITECTURE · AHORRAAI.COM</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Esquema SQL para Supabase (Troquelados, Lotes y Redirección)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Código DDL y DML listo para copiar y pegar directamente en el <strong>SQL Editor</strong> de Supabase. Incluye soporte para siluetas troqueladas (`die_cut_shape`), nichos, lotes neutros, redirección dinámica y telemetría de escaneos.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-2 shadow-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡Código Copiado!' : 'Copiar Script SQL'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 border border-slate-300"
            >
              <Download className="w-4 h-4" />
              <span>Descargar .sql</span>
            </button>
          </div>
        </div>

        {/* View mode tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-200">
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 ${
              activeTab === 'sql'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Código SQL Completo</span>
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 ${
              activeTab === 'tables'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Estructura de Tablas (ER)</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
            <span>Guía GitHub + Supabase + Vercel</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Code Block */}
      {activeTab === 'sql' && (
        <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
              <span className="ml-2 text-slate-300">schema_ahorraai_troquelados.sql</span>
            </div>

            <button
              onClick={handleCopy}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors font-mono font-bold"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <div className="p-5 sm:p-6 overflow-x-auto max-h-[640px] text-xs font-mono leading-relaxed text-slate-300 bg-slate-950 selection:bg-emerald-500/30">
            <pre>
              <code>{SUPABASE_SQL_SCHEMA}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: Tables Schema Explorer */}
      {activeTab === 'tables' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="text-xs font-mono text-emerald-700 font-bold mb-1">TABLA: businesses</div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Negocios & Nichos</h3>
            <p className="text-xs text-slate-600 mb-4">
              Perfil comercial, nicho específico, logo, colores, WiFi y URL oficial de Google Reviews.
            </p>
            <ul className="text-[11px] font-mono space-y-1 text-slate-700 border-t border-slate-200 pt-3">
              <li><span className="text-emerald-700 font-bold">id</span>: UUID (PK)</li>
              <li><span className="text-sky-700 font-bold">slug</span>: VARCHAR (Unique)</li>
              <li><span className="text-slate-500">niche</span>: dental | marisqueria | cafe...</li>
              <li><span className="text-slate-500">name, brand_color</span></li>
              <li><span className="text-slate-500">google_review_url</span></li>
              <li><span className="text-slate-500">wifi_ssid, wifi_password</span></li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="text-xs font-mono text-emerald-700 font-bold mb-1">TABLA: tags</div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Soportes Físicos & Siluetas</h3>
            <p className="text-xs text-slate-600 mb-4">
              Identidad neutra troquelada con URL única `ahorraai.com/t/:tag_uid` y silueta de nicho.
            </p>
            <ul className="text-[11px] font-mono space-y-1 text-slate-700 border-t border-slate-200 pt-3">
              <li><span className="text-emerald-700 font-bold">id</span>: UUID (PK)</li>
              <li><span className="text-sky-700 font-bold">tag_uid</span>: VARCHAR (Unique)</li>
              <li><span className="text-slate-500">die_cut_shape</span>: Muela | Centollo...</li>
              <li><span className="text-slate-500">redirect_mode</span>: direct | micropage</li>
              <li><span className="text-slate-500">status</span>: unassigned | active</li>
              <li><span className="text-slate-500">scan_count</span>: INT (Tabular)</li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="text-xs font-mono text-emerald-700 font-bold mb-1">TABLA: batches</div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Lotes de Fábrica Troquelados</h3>
            <p className="text-xs text-slate-600 mb-4">
              Control de producción en serie por forma troquelada antes de aplicar las etiquetas.
            </p>
            <ul className="text-[11px] font-mono space-y-1 text-slate-700 border-t border-slate-200 pt-3">
              <li><span className="text-emerald-700 font-bold">id</span>: UUID (PK)</li>
              <li><span className="text-sky-700 font-bold">batch_code</span>: VARCHAR (Unique)</li>
              <li><span className="text-slate-500">product_type</span>: ENUM</li>
              <li><span className="text-slate-500">die_cut_shape</span>: VARCHAR</li>
              <li><span className="text-slate-500">total_units</span>: INT</li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="text-xs font-mono text-emerald-700 font-bold mb-1">TABLA: micropages</div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Micro-páginas Personalizadas</h3>
            <p className="text-xs text-slate-600 mb-4">
              Micro-portal tipo Linktree con botones a medida que se abre al tocar el chip o QR.
            </p>
            <ul className="text-[11px] font-mono space-y-1 text-slate-700 border-t border-slate-200 pt-3">
              <li><span className="text-emerald-700 font-bold">id</span>: UUID (PK)</li>
              <li><span className="text-sky-700 font-bold">business_id</span>: FK</li>
              <li><span className="text-slate-500">title, bio</span>: TEXT</li>
              <li><span className="text-slate-500">theme_config</span>: JSONB</li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="text-xs font-mono text-emerald-700 font-bold mb-1">TABLA: micropage_links</div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Botones & Acciones</h3>
            <p className="text-xs text-slate-600 mb-4">
              Botones de carta de marisco, WiFi, 5★ Google, reservas por WhatsApp e Instagram.
            </p>
            <ul className="text-[11px] font-mono space-y-1 text-slate-700 border-t border-slate-200 pt-3">
              <li><span className="text-emerald-700 font-bold">id</span>: UUID (PK)</li>
              <li><span className="text-slate-500">title, subtitle, url</span></li>
              <li><span className="text-slate-500">icon_type, clicks</span>: INT</li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="text-xs font-mono text-emerald-700 font-bold mb-1">TABLA: scan_analytics</div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">Telemetría de Escaneo</h3>
            <p className="text-xs text-slate-600 mb-4">
              Analíticas de escaneo para medir la efectividad física del soporte troquelado.
            </p>
            <ul className="text-[11px] font-mono space-y-1 text-slate-700 border-t border-slate-200 pt-3">
              <li><span className="text-emerald-700 font-bold">id</span>: UUID (PK)</li>
              <li><span className="text-slate-500">scan_method</span>: nfc | qr | web</li>
              <li><span className="text-slate-500">device_os</span>: ios | android</li>
              <li><span className="text-slate-500">scanned_at</span>: TIMESTAMPTZ</li>
            </ul>
          </div>

        </div>
      )}

      {/* Tab 3: Deployment Guide for GitHub, Supabase and Vercel */}
      {activeTab === 'guide' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 max-w-4xl shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Guía de Despliegue en Producción (GitHub + Supabase + Vercel)
            </h2>
            <p className="text-xs text-slate-600">
              Conexión del dominio ahorraai.com con la base de datos Supabase y Vercel en 4 pasos.
            </p>
          </div>

          <div className="space-y-6">
            
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                1
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900">
                  Crear Proyecto en Supabase y Ejecutar el SQL
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Entra en <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-700 font-bold underline">supabase.com</a>, crea un proyecto ("ahorraai-prod"), abre el <strong>SQL Editor</strong> en el menú lateral, pulsa <strong>New Query</strong>, pega el script copiado de la pestaña anterior y pulsa <strong>Run</strong>.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                2
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900">
                  Subir Código a Repositorio GitHub
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Crea un repositorio en GitHub (<code className="text-emerald-800 font-mono font-bold">github.com/tu-usuario/ahorraai</code>) y sube este proyecto Vite + React + Tailwind v4.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                3
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900">
                  Importar en Vercel y Configurar Dominio ahorraai.com
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  En Vercel, importa el repositorio. Configura las variables <code className="text-emerald-800 font-mono font-bold">VITE_SUPABASE_URL</code> y <code className="text-emerald-800 font-mono font-bold">VITE_SUPABASE_ANON_KEY</code>. Asigna tu dominio <code className="text-emerald-800 font-mono font-bold">ahorraai.com</code> en la sección Domains.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                4
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900">
                  Impresión en Rotuladora y Grabación NFC
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Imprime las etiquetas cuadradas con el QR para pegarlas en el espacio delimitado de la silueta troquelada (Muela, Centollo, Taza). Graba los chips con la URL <code className="text-emerald-800 font-mono font-bold">https://ahorraai.com/t/[tag_uid]</code> usando NFC Tools o grabadora USB.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
