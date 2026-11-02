import React, { useState } from 'react';
import { X, Check, ShieldCheck, Cpu, Truck, ShoppingBag, Sparkles, QrCode } from 'lucide-react';
import { HardwareProduct } from '../types';

interface ProductDetailModalProps {
  product: HardwareProduct | null;
  onClose: () => void;
  onAddToCart: (product: HardwareProduct, packUnits: number, packPrice: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedPackIndex, setSelectedPackIndex] = useState(0);
  const currentPack = product.unitPackOptions[selectedPackIndex] || product.unitPackOptions[0];

  const handleAdd = () => {
    onAddToCart(product, currentPack.units, currentPack.price);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Product Image */}
          <div className="bg-slate-50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-slate-200 relative p-4 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-200 text-[11px] font-mono text-emerald-700 font-bold shadow-sm">
                FORMA: {product.dieCutShape}
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <QrCode className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{product.stickerReservedArea}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{product.leadTime} a toda España</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Troquelado resistente a caídas y lavado diario</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Purchase Module */}
          <div className="p-6 flex flex-col justify-between bg-white">
            <div>
              <div className="text-xs uppercase tracking-wider text-emerald-700 font-bold mb-1">
                {product.category} · Nicho {product.niche}
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">
                {product.name}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Pack Selector */}
              <div className="mb-4">
                <label className="text-xs font-bold text-slate-800 block mb-2">
                  Selecciona volumen o pack para negocio:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {product.unitPackOptions.map((pack, idx) => (
                    <button
                      key={pack.units}
                      type="button"
                      onClick={() => setSelectedPackIndex(idx)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        selectedPackIndex === idx
                          ? 'bg-emerald-50 border-emerald-600 text-slate-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold font-mono">
                        {pack.units} {pack.units === 1 ? 'Unidad' : 'Uds'}
                      </div>
                      <div className="text-sm font-extrabold text-slate-900 font-mono mt-0.5">
                        €{pack.price.toFixed(2)}
                      </div>
                      {pack.discountPercent > 0 && (
                        <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                          -{pack.discountPercent}% dto.
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Technical Specifications List */}
              <div className="border-t border-slate-200 pt-3 mb-6">
                <h4 className="text-xs font-bold text-slate-900 mb-2">
                  Especificaciones del Troquelado:
                </h4>
                <dl className="grid grid-cols-1 gap-1 text-xs">
                  {product.specs.map((spec) => (
                    <div key={spec.label} className="flex justify-between py-0.5">
                      <dt className="text-slate-500">{spec.label}:</dt>
                      <dd className="text-slate-800 font-mono font-medium text-right">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
              <div>
                <div className="text-[10px] text-slate-500">Precio total pack:</div>
                <div className="text-2xl font-extrabold font-mono text-slate-900">
                  €{currentPack.price.toFixed(2)}
                  <span className="text-xs text-slate-500 font-normal ml-1">IVA inc.</span>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-2 shadow-md shadow-emerald-600/20"
              >
                <ShoppingBag className="w-4 h-4" />
                Añadir al Pedido
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
