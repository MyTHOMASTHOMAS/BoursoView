/**
 * @file dashboardMockData.ts
 * @description Données statiques factices pour le template Dashboard (referentiels).
 */
import type { ResponseType as RT } from 'Shared/RouteType'

/** Alias du type réponse API getResume. */
export type DashboardSummaryData = RT.GetResumeAction

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

// ─── Top Indices / Referentiels (mock) ────────────────────────────────────────


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
