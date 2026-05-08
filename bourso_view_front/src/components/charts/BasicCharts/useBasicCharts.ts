/**
 * @file useBasicCharts.ts
 * @description Hook métier du composant BasicCharts.
 *
 * Délègue la récupération et la mise en cache des données historiques à
 * {@link useFinanceHistory} (slice Zustand + cache intelligent DateSequenceManager).
 *
 * Ce hook reste responsable de :
 * - Calculer la plage de dates depuis une {@link DurationOption}.
 * - Transformer les données brutes en {@link BasicChartPoint}[] pour le rendu.
 * - Exposer les états `loading`, `error`, `hasData`, etc. au composant.
 */

import { useMemo } from 'react'
import { useFinanceHistory } from '../../../store/wallet/slices/financeHistorySlice'

// ─── Types publics ────────────────────────────────────────────────────────────

export type BasicChartPoint = {
    date: string
    close: number | null
}

export type DurationOption = '7D' | '1M' | '3M' | '6M' | '1Y' | '2Y' | '3Y' | 'CUSTOM'

export const DURATION_OPTIONS: Array<{ value: DurationOption; label: string }> = [
    { value: '7D',    label: '7 jours' },
    { value: '1M',    label: '1 mois' },
    { value: '3M',    label: '3 mois' },
    { value: '6M',    label: '6 mois' },
    { value: '1Y',    label: '1 an' },
    { value: '2Y',    label: '2 ans' },
    { value: '3Y',    label: '3 ans' },
    { value: 'CUSTOM', label: 'Personnalisé' },
]

type UseBasicChartsParams = {
    indice: string
    /** @deprecated Le token est désormais lu depuis `useAppStore` dans `useFinanceHistory`. Ce champ est ignoré. */
    authToken?: string
    duration: DurationOption
    customRange?: {
        startDate: string
        endDate: string
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(date: Date): string {
    const y = date.getFullYear()
    const m = `${date.getMonth() + 1}`.padStart(2, '0')
    const d = `${date.getDate()}`.padStart(2, '0')
    return `${y}-${m}-${d}`
}

/**
 * Calcule les bornes `startDate` / `endDate` (string ISO) depuis une {@link DurationOption}.
 * Pour `CUSTOM`, retourne les dates fournies en paramètre (ordonnées si inversées).
 */
function getRangeFromDuration(
    duration: DurationOption,
    customRange?: { startDate: string; endDate: string }
): { startDate: string; endDate: string } {
    const endDate   = new Date()
    const startDate = new Date()

    if (duration === 'CUSTOM' && customRange?.startDate && customRange?.endDate) {
        return {
            startDate: customRange.startDate <= customRange.endDate ? customRange.startDate : customRange.endDate,
            endDate:   customRange.startDate <= customRange.endDate ? customRange.endDate   : customRange.startDate,
        }
    } else if (duration === '7D') {
        startDate.setDate(startDate.getDate() - 7)
    } else if (duration === '1M') {
        startDate.setMonth(startDate.getMonth() - 1)
    } else if (duration === '3M') {
        startDate.setMonth(startDate.getMonth() - 3)
    } else if (duration === '6M') {
        startDate.setMonth(startDate.getMonth() - 6)
    } else if (duration === '1Y') {
        startDate.setFullYear(startDate.getFullYear() - 1)
    } else if (duration === '2Y') {
        startDate.setFullYear(startDate.getFullYear() - 2)
    } else if (duration === '3Y') {
        startDate.setFullYear(startDate.getFullYear() - 3)
    }

    return {
        startDate: formatDate(startDate),
        endDate:   formatDate(endDate),
    }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Hook métier pour le composant BasicCharts.
 *
 * Les données historiques sont fournies par {@link useFinanceHistory} qui gère
 * le cache intelligent (DateSequenceManager). Aucune requête directe n'est émise ici.
 *
 * @param indice      - Ticker boursier (ex: `"CAC:IND"`).
 * @param duration    - Période sélectionnée par l'utilisateur.
 * @param customRange - Plage personnalisée (uniquement si `duration === 'CUSTOM'`).
 */
export function useBasicCharts({ indice, duration, customRange }: UseBasicChartsParams) {
    const isCustomRangeReady =
        duration !== 'CUSTOM' || Boolean(customRange?.startDate && customRange?.endDate)

    // Calcul des bornes de la plage (stable par mémoïsation)
    const { startDate, endDate } = useMemo(
        () => getRangeFromDuration(duration, customRange),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [duration, customRange?.startDate, customRange?.endDate]
    )

    // Bornes converties en Date pour useFinanceHistory
    const startDateObj = useMemo(() => new Date(startDate), [startDate])
    const endDateObj   = useMemo(() => new Date(endDate),   [endDate])

    // ── Délégation au cache intelligent ───────────────────────────────────────
    const { tickerData, loading, error, hasData } = useFinanceHistory(
        indice,
        startDateObj,
        endDateObj,
    )

    // ── Transformation en points pour Recharts ─────────────────────────────────
    const chartData = useMemo<BasicChartPoint[]>(() => {
        const dates  = tickerData.date
        const closes = tickerData.close
        return dates.map((date, index) => ({
            date,
            close: closes[index] ?? null,
        }))
    }, [tickerData])

    return {
        startDate,
        endDate,
        loading,
        error,
        hasData: isCustomRangeReady && hasData,
        chartData,
        indice,
        duration,
        isCustomRangeReady,
    }
}
