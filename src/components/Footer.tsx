import React from 'react';
import { Layers, Database, Nfc, QrCode, Shapes } from 'lucide-react';

import { AppView } from './Navbar';

interface FooterProps {
  onNavigate: (view: AppView, extra?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Col */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base tracking-tight">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Shapes className="w-3.5 h-3.5" />
            </div>
            <span>AhorraAI.com</span>
          </div>
          <p className="text-slate-600 text-xs leading-relaxed">
            Soportes troquelados con formas de nicho (muelas, mariscos, tazas, tijeras, huellas), adhesivos de suelo, chapas e imanes con chip NFC y QR para negocios físicos.
          </p>
          <div className="text-[11px] text-slate-400">
            Dominio oficial: <span className="text-slate-800 font-mono font-semibold">ahorraai.com</span>
          </div>
        </div>

        {/* Formatos Físicos */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            Formatos Troquelados
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-600">
            <li>
              <button onClick={() => onNavigate('store')} className="hover:text-slate-900 transition-colors">
                Peana Muela Dental (Clínicas & 5★)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('store')} className="hover:text-slate-900 transition-colors">
                Peana Centollo / Cigala (Marisquerías)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('store')} className="hover:text-slate-900 transition-colors">
                Vinilo de Suelo Taza de Café (Bares)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('store')} className="hover:text-slate-900 transition-colors">
                Imanes Nevera Huella Mascota (Veterinarias)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('store')} className="hover:text-slate-900 transition-colors">
                Chapas Pins Metálicos para Uniformes
              </button>
            </li>
          </ul>
        </div>

        {/* Ecosistema & Tecnologías */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            Arquitectura & APIs
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-600">
            <li>
              <button onClick={() => onNavigate('supabase')} className="hover:text-slate-900 transition-colors">
                Esquema SQL para Supabase (7 Tablas)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('resolver', 'tag-dental-muela')} className="hover:text-slate-900 transition-colors">
                Motor de Redirección Dinámica /t/:tagUid
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('businesses')} className="hover:text-slate-900 transition-colors">
                Gestión de Negocios & Espacio Personalizado
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('lab')} className="hover:text-slate-900 transition-colors">
                Laboratorio Web NFC & Lector QR
              </button>
            </li>
          </ul>
        </div>

        {/* Contacto & Despliegue */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            Soporte & Despliegue
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Preparado para producción con GitHub CI/CD, Supabase Database & Auth y Vercel Edge.
          </p>
          <div className="pt-2 text-slate-800 font-mono text-xs font-semibold">
            contacto@ahorraai.com
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
        <div>
          © {new Date().getFullYear()} AhorraAI.com. Todos los derechos reservados.
        </div>
        <div className="flex items-center gap-4">
          <span>Siluetas Troqueladas Escalables</span>
          <span aria-hidden="true">·</span>
          <span>Etiquetas Adhesivas QR + NFC NTAG215</span>
          <span aria-hidden="true">·</span>
          <span>Supabase PostgreSQL</span>
        </div>
      </div>
    </footer>
  );
};
