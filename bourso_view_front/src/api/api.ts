/**
 * @file api.ts
 * @description Instance centralisée du client API BoursoView.
 *
 * Utilise `createApi` (ReactQueryBuilder) pour créer des hooks typés
 * basés sur les types partagés du package `shared`.
 *
 */
import { createApi } from 'MypkgReact/ReactQuery/ReactQueryBuilder'
import { ApiClient } from 'MypkgTypescript/ApiClient/ApiClient'
import { health, auth, referentiel, getTransactions, createTransaction, deleteTransaction } from './routes'

// 1. Récupère l'URL
// @ts-ignore
const baseUrl = import.meta.env.VITE_API_URL as string;

// 2. Configure le client AVANT de créer l'API
const apiClient = ApiClient.getInstance(baseUrl, {});

// ASTUCE CORS POUR GOOGLE APPS SCRIPT :
// On force le Content-Type en text/plain pour éviter la requête preflight OPTIONS
apiClient.setHeaders({
    'Content-Type': 'text/plain;charset=utf-8'
});

// 3. Crée ton API et expose le client configuré
export const api = Object.assign(createApi(baseUrl, {
    health,
    auth,
    referentiel,
    getTransactions,
    createTransaction,
    deleteTransaction,
}), { client: apiClient });
