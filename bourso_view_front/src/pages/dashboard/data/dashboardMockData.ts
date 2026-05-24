/**
 * @file dashboardMockData.ts
 * @description Données statiques factices pour le template de la page d'accueil Dashboard.
 *
 * @remarks
 * Ce fichier est utilisé UNIQUEMENT pour la prévisualisation.
 * Toutes les valeurs sont fictives et ne proviennent pas de l'API.
 * Remplacer par les hooks réels (useReferentiel, etc.) lors de l'intégration.
 */

// ─── Types locaux ─────────────────────────────────────────────────────────────

/** Structure des données résumées du portefeuille (réponse API `/summary`). */
export type DashboardSummaryData = {
    fund: {
        /** Total versé sur le compte-titre. */
        total: number
        /** Liquidités non investies (cash disponible). */
        available: number
    }
    transaction: {
        /** Nombre de transactions effectuées. */
        count: number
        /** Valeur brute des titres (sans frais). */
        price: number
        /** Nombre de titres détenus en portefeuille. */
        nb: number
        /** Commissions totales payées. */
        comission: number
        /** Frais additionnels payés. */
        fee: number
        /** Prix de revient unitaire moyen (PRU). */
        pru: number
        total: {
            /** Montant total investi par période (price + commission + fee). */
            invest: {
                current: number; j1: number; j7: number
                j30: number;    m6: number;  y1: number
            }
            /** Valeur liquidative estimée des positions par période. */
            estimated: {
                current: number; j1: number; j7: number
                j30: number;    m6: number;  y1: number
            }
        }
    }
    dividendes: {
        /** Nombre de versements de dividendes reçus. */
        count: number
        /** Montant brut total des dividendes. */
        amount_brut: number
        /** Taux de taxe moyen appliqué. */
        taxe: number
        /** Commissions sur dividendes. */
        comission: number
        /** Montant net perçu après taxe et commissions. */
        amount_net: number
    }
}

// ─── Types locaux ─────────────────────────────────────────────────────────────

export type MockIndiceRow = {
    id: string
    name: string
    isin: string
    price: number
    price_j_1: number
    price_j_7: number
    price_m_1: number
    managementFee: string
}

// ─── Mock données résumées ────────────────────────────────────────────────────

/** Données factices de résumé du portefeuille (format réponse API). */
export const MOCK_SUMMARY: DashboardSummaryData = {
    fund: {
        total: 2610,
        available: 1.6,
    },
    transaction: {
        count: 13,
        price: 2595.44,
        nb: 152,
        comission: 14,
        fee: 0,
        pru: 17.17,
        total: {
            invest: {
                current: 2609.44, j1: 2609.44, j7: 2609.44,
                j30: 2368.63,     m6: 1400.81, y1: 0,
            },
            estimated: {
                current: 2912.91, j1: 2920.6, j7: 2792.53,
                j30: 2492.64,     m6: 1324.38, y1: 0,
            },
        },
    },
    dividendes: {
        count: 4,
        amount_brut: 1.24,
        taxe: 0.2,
        comission: 0,
        amount_net: 1.04,
    },
}


// ─── Top Indices / Referentiels ───────────────────────────────────────────────


export const MOCK_TOP_INDICES: MockIndiceRow[] = [
    {
        id: 'EWLD',
        name: 'Amundi MSCI World',
        isin: 'LU1681043599',
        price: 438.52,
        price_j_1: 435.10,
        price_j_7: 429.80,
        price_m_1: 418.30,
        managementFee: '0,38 %',
    },
    {
        id: 'ESE',
        name: 'Amundi MSCI Europe',
        isin: 'FR0010261198',
        price: 184.30,
        price_j_1: 186.20,
        price_j_7: 181.50,
        price_m_1: 176.80,
        managementFee: '0,15 %',
    },
    {
        id: 'CW8',
        name: 'Amundi MSCI World II',
        isin: 'LU2655993207',
        price: 512.10,
        price_j_1: 508.90,
        price_j_7: 503.20,
        price_m_1: 488.60,
        managementFee: '0,12 %',
    },
    {
        id: 'PAEEM',
        name: 'Amundi MSCI Emerging Markets',
        isin: 'LU1681045370',
        price: 67.44,
        price_j_1: 67.10,
        price_j_7: 65.80,
        price_m_1: 64.20,
        managementFee: '0,20 %',
    },
    {
        id: 'PTPEHB',
        name: 'BNP Paribas Easy S&P 500',
        isin: 'FR0011550185',
        price: 62.80,
        price_j_1: 62.10,
        price_j_7: 64.30,
        price_m_1: 59.90,
        managementFee: '0,15 %',
    },
]
