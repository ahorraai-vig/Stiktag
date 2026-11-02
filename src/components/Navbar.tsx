import React from 'react';
import { ShoppingBag, Shapes, Building2, Radio, Smartphone, Database, Plus } from 'lucide-react';

export type AppView = 'store' | 'businesses' | 'lab' | 'resolver' | 'supabase';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView, extra?: string) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  cartCount,
  onOpenCart,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigate('store')}
          className="text-xl font-bold tracking-tight text-slate-900 hover:text-emerald-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
            <Shapes className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">
            AhorraAI<span className="text-emerald-600">.com</span>
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button
            onClick={() => onNavigate('store')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
              currentView === 'store' ? 'text-slate-900 font-bold border-b-2 border-emerald-600' : ''
            }`}
          >
            Tienda Troquelados
          </button>

          <button
            onClick={() => onNavigate('businesses')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 ${
              currentView === 'businesses' ? 'text-slate-900 font-bold border-b-2 border-emerald-600' : ''
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Negocios & Clientes</span>
          </button>

          <button
            onClick={() => onNavigate('lab')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 ${
              currentView === 'lab' ? 'text-slate-900 font-bold border-b-2 border-emerald-600' : ''
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-600" />
            <span>Laboratorio (Tags Neutros)</span>
          </button>

          <button
            onClick={() => onNavigate('resolver', 'tag-dental-muela')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 ${
              currentView === 'resolver' ? 'text-slate-900 font-bold border-b-2 border-emerald-600' : ''
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Simulador Móvil</span>
          </button>

          <button
            onClick={() => onNavigate('supabase')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 ${
              currentView === 'supabase' ? 'text-slate-900 font-bold border-b-2 border-emerald-600' : ''
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Supabase SQL</span>
          </button>
        </nav>

        {/* Zone 3: Cart + Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Cart button */}
          <button
            onClick={onOpenCart}
            className="relative p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            title="Ver cesta de compras"
            aria-label="Ver cesta de compras"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white text-xs font-bold rounded-full flex items-center justify-center font-mono shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => onNavigate('businesses')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              currentView === 'businesses'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Gestión Negocios</span>
          </button>
        </div>

      </div>

      {/* Mobile subnavigation bar for small screens */}
      <div className="lg:hidden flex items-center justify-around px-2 py-2 bg-white border-t border-slate-200 text-xs font-semibold text-slate-600 overflow-x-auto">
        <button
          onClick={() => onNavigate('store')}
          className={`px-2 py-1 whitespace-nowrap ${currentView === 'store' ? 'text-emerald-600 font-bold' : ''}`}
        >
          Tienda
        </button>
        <button
          onClick={() => onNavigate('businesses')}
          className={`px-2 py-1 whitespace-nowrap ${currentView === 'businesses' ? 'text-emerald-600 font-bold' : ''}`}
        >
          Negocios
        </button>
        <button
          onClick={() => onNavigate('lab')}
          className={`px-2 py-1 whitespace-nowrap ${currentView === 'lab' ? 'text-emerald-600 font-bold' : ''}`}
        >
          Lab Tags
        </button>
        <button
          onClick={() => onNavigate('resolver', 'tag-dental-muela')}
          className={`px-2 py-1 whitespace-nowrap ${currentView === 'resolver' ? 'text-emerald-600 font-bold' : ''}`}
        >
          Simulador
        </button>
        <button
          onClick={() => onNavigate('supabase')}
          className={`px-2 py-1 whitespace-nowrap ${currentView === 'supabase' ? 'text-emerald-600 font-bold' : ''}`}
        >
          SQL
        </button>
      </div>
    </header>
  );
};
