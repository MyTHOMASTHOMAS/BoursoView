/**
 * @file SidebarProvider.tsx
 * @description Provider React pour la gestion de l'état de la sidebar.
 * Créé via {@link createProvider} de MypkgReact, il expose un contexte
 * contenant l'état ouvert/fermé et les méthodes de contrôle.
 *
 * @example
 * ```tsx
 * const { isOpen, toggle, open, close } = useSidebarContext();
 * ```
 */
import { useMemo, useState } from 'react';
import { createProvider } from 'MypkgReact/AppProvider/createProvider';
import type { ProviderInterface } from 'MypkgReact/AppProvider/ProviderInterface';

/**
 * Interface du contexte exposé par le SidebarProvider.
 * @extends ProviderInterface
 */
export interface SidebarProviderInterface extends ProviderInterface {
    /** Identifiant unique du provider. */
    name: 'sidebar';
    /** Indique si la sidebar est actuellement ouverte. */
    isOpen: boolean;
    /** Ouvre la sidebar. */
    open: () => void;
    /** Ferme la sidebar. */
    close: () => void;
    /** Inverse l'état de la sidebar (ouvert ↔ fermé). */
    toggle: () => void;
}

/**
 * Props du SidebarProvider.
 */
interface SidebarProviderProps {
    /** État initial de la sidebar. Par défaut : `true` (ouverte). */
    initialOpen?: boolean;
}

/**
 * Hook interne gérant la logique d'état de la sidebar.
 * @param props - Les propriétés d'initialisation.
 * @returns L'interface du contexte sidebar avec état et actions mémorisés.
 */
function useSidebar({ initialOpen = true }: SidebarProviderProps): SidebarProviderInterface {
    const [isOpen, setIsOpen] = useState(initialOpen);

    return useMemo(() => ({
        name: 'sidebar',
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        toggle: () => setIsOpen(prev => !prev),
    }), [isOpen]);
}

export const [SidebarProvider, useSidebarContext, SidebarContext] = createProvider(useSidebar);
