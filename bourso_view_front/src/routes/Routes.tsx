/**
 * @file Routes.tsx
 * @description Configuration centralisée du routage de l'application.
 *
 * Utilise {@link RouteBuilder} pour créer un routeur typé et
 * {@link LinkBuilder} pour générer des composants de navigation typés.
 *
 * @remarks
 * - `R` : instance de `RouteBuilder` — utilisée dans App.tsx pour créer le `RouterProvider`.
 * - `L` : instance de `LinkBuilder` — utilisée dans les composants pour les liens typés (`L.Link`, `L.NavLink`).
 *
 * Pour ajouter une nouvelle route :
 * 1. Créer la page dans `src/pages/`
 * 2. Définir la `RouteObject` ici
 * 3. L'ajouter aux `children` de `RootRoute` et au `linkSchema`
 */
import type { RouteSchema } from 'MypkgReact/RouterBuilder/RouteBuilder.tsx'
import { RouteBuilder, LinkBuilder } from 'MypkgReact/RouterBuilder/RouteBuilder.tsx'
import type { RouteObject } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Dashboard from '../pages/Dashboard'
import { Indices } from '../pages/indices'
import { Transactions } from '../pages/transactions'
import { Fons } from '../pages/fons'
import Settings from '../pages/Settings'
import NotFound from '../pages/NotFound'
import { AppInitializer } from '../components/AppInitializer'

// ─── Routes individuelles ────────────────────────────────
const DashboardRoute: RouteObject    = { path: '/', element: <Dashboard />, index: true }
const IndicesRoute: RouteObject      = { path: '/indices', element: <Indices /> }
const TransactionsRoute: RouteObject = { path: '/transactions', element: <Transactions /> }
const FonsRoute: RouteObject         = { path: '/fons', element: <Fons /> }
const SettingsRoute: RouteObject     = { path: '/settings', element: <Settings /> }
const NoRoute: RouteObject           = { path: '*', element: <NotFound /> }

// ─── Route racine d'initialisation ──────────────────────────
const InitRoute: RouteObject = {
    path: '/',
    element: <AppInitializer />,
    children: [
        {
            path: '/',
            element: <MainLayout />,
            children: [DashboardRoute, IndicesRoute, TransactionsRoute, FonsRoute, SettingsRoute, NoRoute],
        }
    ]
}

// ─── RouteBuilder (router) ───────────────────────────────
type RouteName = 'root' | 'noroute'
const routeSchema: RouteSchema<RouteName> = {
    root: InitRoute,
    noroute: NoRoute,
}
export const R = new RouteBuilder(routeSchema)

// ─── LinkBuilder (navigation typée) ──────────────────────
type LinkName = 'dashboard' | 'indices' | 'transactions' | 'fons' | 'settings'
const linkSchema: RouteSchema<LinkName> = {
    dashboard: DashboardRoute,
    indices: IndicesRoute,
    transactions: TransactionsRoute,
    fons: FonsRoute,
    settings: SettingsRoute,
}
export const L = new LinkBuilder(linkSchema)
