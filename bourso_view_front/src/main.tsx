/**
 * @file main.tsx
 * @description Point d'entrée de l'application React.
 * Monte le composant racine {@link App} dans le DOM via `createRoot`.
 * Encapsule l'application dans `StrictMode` pour détecter les problèmes potentiels en développement.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
