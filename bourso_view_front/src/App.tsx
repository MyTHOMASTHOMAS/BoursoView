/**
 * @file App.tsx
 * @description Composant racine de l'application BoursoView.
 * Configure le système de providers via {@link AppProvider} et
 * initialise le routeur avec {@link RouterProvider} et le schéma de routes.
 *
 * @remarks
 * Les providers sont définis dans le tableau `providers`.
 * Pour ajouter un nouveau provider, il suffit de l'ajouter à ce tableau.
 */
import { RouterProvider } from 'react-router-dom'
import { AppProvider } from 'MypkgReact/AppProvider/AppProvider'
import { ReactQueryProvider } from 'MypkgReact/ReactQuery/ReactQueryProvider'
import { SidebarProvider } from './features/sidebar/SidebarProvider'
import { ViewportProvider } from './provider/ViewportContextProvider'
import { R } from './routes/Routes'

/** Tableau des providers de l'application, instanciés avec leurs props initiales. */
const providers = [
  // @ts-ignore
  <ReactQueryProvider key="react-query" showDevtools={import.meta.env.DEV} />,
  <ViewportProvider key="viewport" />,
  <SidebarProvider key="sidebar" initialOpen={false} />,
]

/**
 * Composant racine de l'application.
 * Imbrique les providers puis monte le routeur avec les routes « root » et « noroute ».
 * @returns L'arbre React complet de l'application.
 */
function App() {
  return (
    <AppProvider providers={providers}>
      <RouterProvider router={R.router(['root', 'noroute'], { basename: import.meta.env.BASE_URL })} />
    </AppProvider>
  )
}

export default App
