/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, AppView } from './components/Navbar';
import { Storefront } from './components/Storefront';
import { TagResolverView } from './components/TagResolverView';
import { BusinessManager } from './components/BusinessManager';
import { SupabaseSqlViewer } from './components/SupabaseSqlViewer';
import { NfcHardwareTester } from './components/NfcHardwareTester';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';

import { 
  INITIAL_PRODUCTS, 
  INITIAL_BUSINESSES, 
  INITIAL_TAGS, 
  INITIAL_MICROPAGES, 
  INITIAL_SCAN_EVENTS 
} from './data/mockData';
import { 
  Business, 
  CartItem, 
  HardwareProduct, 
  Micropage, 
  NfcQrTag, 
  ProductFormatId, 
  RedirectMode, 
  ScanAnalyticEvent 
} from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('store');
  const [selectedTagUid, setSelectedTagUid] = useState<string>('tag-dental-muela');
  
  // App state with LocalStorage persistence for user changes
  const [products] = useState<HardwareProduct[]>(INITIAL_PRODUCTS);

  const [businesses, setBusinesses] = useState<Record<string, Business>>(() => {
    try {
      const saved = localStorage.getItem('ahorraai_businesses');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading businesses from localStorage', e);
    }
    return INITIAL_BUSINESSES;
  });

  const [tags, setTags] = useState<Record<string, NfcQrTag>>(() => {
    try {
      const saved = localStorage.getItem('ahorraai_tags');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading tags from localStorage', e);
    }
    return INITIAL_TAGS;
  });

  const [micropages, setMicropages] = useState<Record<string, Micropage>>(() => {
    try {
      const saved = localStorage.getItem('ahorraai_micropages');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading micropages from localStorage', e);
    }
    return INITIAL_MICROPAGES;
  });

  const [analytics, setAnalytics] = useState<ScanAnalyticEvent[]>(INITIAL_SCAN_EVENTS);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ahorraai_businesses', JSON.stringify(businesses));
    } catch (e) {
      console.warn('Could not save businesses to localStorage', e);
    }
  }, [businesses]);

  useEffect(() => {
    try {
      localStorage.setItem('ahorraai_tags', JSON.stringify(tags));
    } catch (e) {
      console.warn('Could not save tags to localStorage', e);
    }
  }, [tags]);

  useEffect(() => {
    try {
      localStorage.setItem('ahorraai_micropages', JSON.stringify(micropages));
    } catch (e) {
      console.warn('Could not save micropages to localStorage', e);
    }
  }, [micropages]);

  // Cart & Modals
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [detailProduct, setDetailProduct] = useState<HardwareProduct | null>(null);

  // URL query detector for /t/:tagUid
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tagParam = params.get('tag');
    if (tagParam && tags[tagParam]) {
      setSelectedTagUid(tagParam);
      setCurrentView('resolver');
    }
  }, [tags]);

  const handleNavigate = (view: AppView, extra?: string) => {
    setCurrentView(view);
    if (extra) {
      setSelectedTagUid(extra);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product: HardwareProduct, selectedPackUnits: number, packPrice: number) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedPackUnits === selectedPackUnits
      );
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += 1;
        return next;
      }
      return [...prev, { product, selectedPackUnits, packPrice, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (index: number, quantity: number) => {
    setCart((prev) => {
      const next = [...prev];
      next[index].quantity = quantity;
      return next;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Record scan telemetry
  const handleRecordScan = (eventData: Omit<ScanAnalyticEvent, 'id' | 'scannedAt'>) => {
    const newEvent: ScanAnalyticEvent = {
      ...eventData,
      id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      scannedAt: new Date().toISOString(),
    };

    setAnalytics((prev) => [newEvent, ...prev]);

    setTags((prev) => {
      const tag = prev[eventData.tagUid];
      if (!tag) return prev;
      return {
        ...prev,
        [eventData.tagUid]: {
          ...tag,
          scanCount: tag.scanCount + 1,
          lastScannedAt: newEvent.scannedAt,
        },
      };
    });
  };

  // Create new business with full schema and optional default micropage
  const handleCreateBusiness = (newBiz: Business, initialMicropage?: Micropage) => {
    setBusinesses((prev) => ({
      ...prev,
      [newBiz.id]: newBiz,
    }));

    if (initialMicropage) {
      setMicropages((prev) => ({
        ...prev,
        [newBiz.id]: initialMicropage,
      }));
    }
  };

  // Update existing business
  const handleUpdateBusiness = (updatedBiz: Business) => {
    setBusinesses((prev) => ({
      ...prev,
      [updatedBiz.id]: updatedBiz,
    }));
  };

  // Delete business and free its tags back to unassigned pool
  const handleDeleteBusiness = (businessId: string) => {
    setBusinesses((prev) => {
      const next = { ...prev };
      delete next[businessId];
      return next;
    });

    setMicropages((prev) => {
      const next = { ...prev };
      delete next[businessId];
      return next;
    });

    setTags((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((tagKey) => {
        if (next[tagKey].businessId === businessId) {
          next[tagKey] = {
            ...next[tagKey],
            status: 'unassigned',
            businessId: undefined,
            notes: 'Desvinculado por eliminación de negocio',
          };
        }
      });
      return next;
    });
  };

  // Assign a neutral tag to a client
  const handleAssignTagToBusiness = (
    tagUid: string,
    businessId: string,
    redirectMode: RedirectMode,
    directUrl?: string
  ) => {
    setTags((prev) => {
      const tag = prev[tagUid];
      if (!tag) return prev;
      return {
        ...prev,
        [tagUid]: {
          ...tag,
          businessId,
          redirectMode,
          directUrl: directUrl || (redirectMode === 'direct' ? businesses[businessId]?.googleReviewUrl || 'https://search.google.com' : undefined),
          status: 'active',
          notes: `Asignado a ${businesses[businessId]?.name || businessId}`,
        },
      };
    });
  };

  // Unassign a tag back to neutral pool
  const handleUnassignTag = (tagUid: string) => {
    setTags((prev) => {
      const tag = prev[tagUid];
      if (!tag) return prev;
      return {
        ...prev,
        [tagUid]: {
          ...tag,
          status: 'unassigned',
          businessId: undefined,
          directUrl: undefined,
          notes: 'Devuelto al pool de identidades neutras',
        },
      };
    });
  };

  // Update micropage (customizer changes)
  const handleUpdateMicropage = (updatedMp: Micropage) => {
    setMicropages((prev) => ({
      ...prev,
      [updatedMp.businessId]: updatedMp,
    }));
  };

  // Change redirect mode on a tag
  const handleUpdateTagMode = (
    tagUid: string,
    mode: RedirectMode,
    directUrl?: string
  ) => {
    setTags((prev) => {
      const tag = prev[tagUid];
      if (!tag) return prev;
      return {
        ...prev,
        [tagUid]: {
          ...tag,
          redirectMode: mode,
          directUrl: directUrl !== undefined ? directUrl : tag.directUrl,
        },
      };
    });
  };

  // Generate a batch of neutral tags (QR + NFC chip UID + PIN)
  const handleGenerateBatch = (
    productType: ProductFormatId, 
    count: number, 
    shapeName?: string,
    chipModel: 'NTAG213' | 'NTAG215' = 'NTAG215'
  ) => {
    const batchId = `batch-${Date.now()}`;
    const newTags: Record<string, NfcQrTag> = {};

    for (let i = 1; i <= count; i++) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
      const hexUid = Array.from({ length: 7 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()).join(':');
      const tagUid = `TAG-${chipModel}-${randomSuffix}`;
      const serialNumber = `AAI-NEUTRO-${chipModel}-${randomSuffix}`;

      newTags[tagUid] = {
        id: `tag-${Date.now()}-${i}`,
        tagUid,
        serialNumber,
        batchId,
        productType,
        dieCutShape: shapeName || 'Peana Troquelada Neutra',
        status: 'unassigned',
        redirectMode: 'micropage',
        chipModel,
        nfcChipUid: hexUid,
        scanCount: 0,
        claimToken: `PIN-${Math.floor(1000 + Math.random() * 9000)}`,
        notes: `Generado en lote neutro (${shapeName || productType})`,
        createdAt: new Date().toISOString(),
      };
    }

    setTags((prev) => ({ ...prev, ...newTags }));
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-700">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'store' && (
          <Storefront
            products={products}
            onSelectProduct={(p) => setDetailProduct(p)}
            onAddToCart={handleAddToCart}
            onSimulateTag={(uid) => handleNavigate('resolver', uid)}
            onNavigateToSupabase={() => handleNavigate('supabase')}
            onNavigateToBusinesses={() => handleNavigate('businesses')}
          />
        )}

        {currentView === 'businesses' && (
          <BusinessManager
            businesses={businesses}
            tags={tags}
            micropages={micropages}
            onUpdateBusiness={handleUpdateBusiness}
            onCreateBusiness={handleCreateBusiness}
            onDeleteBusiness={handleDeleteBusiness}
            onAssignTagToBusiness={handleAssignTagToBusiness}
            onUnassignTag={handleUnassignTag}
            onUpdateMicropage={handleUpdateMicropage}
            onUpdateTagMode={handleUpdateTagMode}
            onNavigateToSimulator={(uid) => handleNavigate('resolver', uid)}
            onNavigateToLab={() => handleNavigate('lab')}
          />
        )}

        {currentView === 'resolver' && (
          <TagResolverView
            tagUid={selectedTagUid}
            tags={tags}
            businesses={businesses}
            micropages={micropages}
            onRecordScan={handleRecordScan}
            onClaimTag={handleAssignTagToBusiness}
            onNavigateToBusinesses={() => handleNavigate('businesses')}
            onNavigateToLab={() => handleNavigate('lab')}
          />
        )}

        {currentView === 'supabase' && (
          <SupabaseSqlViewer />
        )}

        {currentView === 'lab' && (
          <NfcHardwareTester
            tags={tags}
            onTestTagUid={(uid) => handleNavigate('resolver', uid)}
            onGenerateBatch={handleGenerateBatch}
            onNavigateToBusinesses={() => handleNavigate('businesses')}
          />
        )}
      </main>

      {/* Product Technical Specs Modal */}
      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* Brand Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}
