import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, CheckCircle2, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.packPrice * item.quantity, 0);
  const shipping = subtotal > 60 ? 0 : 4.90;
  const total = subtotal + (cart.length > 0 ? shipping : 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderCompleted(true);
  };

  const handleReset = () => {
    onClearCart();
    setOrderCompleted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Cesta de Pedidos</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
            aria-label="Cerrar cesta"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {orderCompleted ? (
          <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              ¡Pedido Troquelado #AAI-8120 Confirmado!
            </h3>
            <p className="text-xs text-slate-600 mb-6 max-w-xs leading-relaxed">
              Hemos registrado el pedido para <strong>{customerName || 'tu negocio'}</strong>. Los soportes físicos y las etiquetas QR+NFC están listos para despacho en 24h.
            </p>

            <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-500">Total abonado:</span>
                <span className="font-mono text-emerald-700 font-bold">€{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Envío a:</span>
                <span className="text-slate-800 truncate max-w-[180px]">{shippingAddress || 'Dirección comercial'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Entrega estimada:</span>
                <span className="text-slate-800">24/48 horas</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
            >
              Volver a la Tienda Troquelada
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800 mb-1">Tu cesta está vacía</p>
            <p className="text-xs text-slate-500 max-w-xs mb-4">
              Añade peanas troqueladas de muela, centollos para marisquería o adhesivos de suelo para equipar tu local.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Ver Formatos Troquelados
            </button>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.map((item, idx) => (
                <div
                  key={`${item.product.id}-${idx}`}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex gap-3"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-contain bg-white border border-slate-200 shrink-0 p-1"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(idx)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-0.5"
                        aria-label="Eliminar producto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Pack de {item.selectedPackUnits} uds · {item.product.dieCutShape}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-300 rounded bg-white">
                        <button
                          onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}
                          className="px-2 py-0.5 text-xs text-slate-600 hover:text-slate-900 font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-slate-600 hover:text-slate-900 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-xs font-extrabold font-mono text-slate-900">
                        €{(item.packPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Fast Checkout Form */}
              <form id="checkout-form" onSubmit={handleCheckout} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 mt-4">
                <h4 className="text-xs font-bold text-slate-900">
                  Datos de Envío y Facturación B2B
                </h4>
                <div>
                  <label className="text-[10px] text-slate-600 font-medium block mb-0.5">Nombre o Negocio:</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej. Clínica Dental Sonrisas S.L."
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-600 font-medium block mb-0.5">Email de confirmación:</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="contacto@negocio.com"
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-600 font-medium block mb-0.5">Dirección de entrega (Península):</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Calle, número, código postal, ciudad"
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </form>
            </div>

            {/* Footer Summary */}
            <div className="p-5 border-t border-slate-200 bg-white">
              <div className="space-y-1.5 text-xs mb-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal productos:</span>
                  <span className="font-mono text-slate-900 font-bold">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Envío 24h:</span>
                  <span className="font-mono text-slate-900">
                    {shipping === 0 ? <span className="text-emerald-700 font-bold">GRATIS</span> : `€${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total (IVA incluido):</span>
                  <span className="font-mono text-emerald-700 font-extrabold">€{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
              >
                <span>Tramitar Pedido Seguro</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
