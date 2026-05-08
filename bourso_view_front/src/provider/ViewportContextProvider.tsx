import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// --- TYPES ---
export interface ViewportState {
  width: number;
  height: number;
  isMobile: boolean;
  isLandscape: boolean;
}

interface ViewportProviderProps {
  children?: ReactNode;
  /** Permet de surcharger la limite pour considérer l'écran comme "mobile" (défaut: 768) */
  mobileBreakpoint?: number; 
}

// --- CONTEXTE ---
const ViewportContext = createContext<ViewportState | undefined>(undefined);

// --- PROVIDER ---
export const ViewportProvider: React.FC<ViewportProviderProps> = ({ 
  children, 
  mobileBreakpoint = 768 
}) => {
  // Initialisation sécurisée pour le SSR (Server-Side Rendering)
  const [viewport, setViewport] = useState<ViewportState>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
    isMobile: typeof window !== 'undefined' ? window.innerWidth < mobileBreakpoint : false,
    isLandscape: typeof window !== 'undefined' ? window.innerWidth > window.innerHeight : true,
  });

  useEffect(() => {
    // Si on n'est pas dans le navigateur, on ne fait rien
    if (typeof window === 'undefined') return;

    // Fonction de mise à jour
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < mobileBreakpoint,
        isLandscape: window.innerWidth > window.innerHeight,
      });
    };

    // Écouteur d'événement sur le redimensionnement de la fenêtre
    window.addEventListener('resize', handleResize);
    
    // Appel initial au cas où l'écran aurait changé entre le rendu et l'hydratation
    handleResize();

    // Nettoyage de l'écouteur au démontage du composant
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileBreakpoint]);

  return (
    <ViewportContext.Provider value={viewport}>
      {children}
    </ViewportContext.Provider>
  );
};

// --- HOOKS PERSONNALISÉS ---

/**
 * Hook principal pour récupérer toutes les données du viewport.
 */
export const useViewport = (): ViewportState => {
  const context = useContext(ViewportContext);
  if (context === undefined) {
    throw new Error('useViewport doit être utilisé à l\'intérieur d\'un ViewportProvider');
  }
  return context;
};

/**
 * Alias de migration : expose uniquement isMobile pour remplacer ton ancien hook en douceur.
 */
export const useIsMobile = (): boolean => {
  return useViewport().isMobile;
};