/**
 * @file MainLayout.tsx
 * @description Layout principal de l'application.
 * Compose la {@link Sidebar} à gauche et le contenu des routes enfants à droite
 * via `<Outlet />` de React Router.
 *
 * @remarks
 * Ce layout est utilisé comme élément de la route racine dans {@link Routes.tsx}.
 * Toutes les pages (Dashboard, Portfolio, etc.) sont rendues dans l'`<Outlet />`.
 */
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'

/**
 * Layout principal avec sidebar et zone de contenu.
 * @returns Le layout flex avec la sidebar collée à gauche et le contenu scrollable à droite.
 */
export default function MainLayout() {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
