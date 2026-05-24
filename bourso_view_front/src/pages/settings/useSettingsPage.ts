import { useCallback } from 'react'
import {
    DASHBOARD_TOP_INDICES_MAX,
    DASHBOARD_TOP_INDICES_MIN,
    DISPLAY_VARIANCE_MAX_INCLUSIVE,
    DISPLAY_VARIANCE_MIN_EXCLUSIVE,
    useAppStore,
} from '../../store/app-store'
import { useNumericSettingInput } from './useNumericSettingInput'

function formatVarianceHint(value: number): string {
    if (!Number.isFinite(value)) return ''
    const pct = value * 100
    return `≈ ±${pct % 1 === 0 ? pct.toFixed(0) : pct.toFixed(1)} %`
}

export function useSettingsPage() {
    const defaultVariance = useAppStore((s) => s.defaultVariance)
    const setDefaultVariance = useAppStore((s) => s.setDefaultVariance)
    const portfolioVariance = useAppStore((s) => s.portfolioVariance)
    const setPortfolioVariance = useAppStore((s) => s.setPortfolioVariance)
    const dashboardTopIndicesLimit = useAppStore((s) => s.dashboardTopIndicesLimit)
    const setDashboardTopIndicesLimit = useAppStore((s) => s.setDashboardTopIndicesLimit)

    const parseVariance = useCallback(
        (raw: string) => Number(raw.trim().replace(',', '.')),
        [],
    )

    const isVarianceValid = useCallback(
        (value: number) =>
            Number.isFinite(value) &&
            value > DISPLAY_VARIANCE_MIN_EXCLUSIVE &&
            value <= DISPLAY_VARIANCE_MAX_INCLUSIVE,
        [],
    )

    const parseTopIndices = useCallback(
        (raw: string) => Number(raw.trim()),
        [],
    )

    const isTopIndicesValid = useCallback(
        (value: number) =>
            Number.isInteger(value) &&
            value >= DASHBOARD_TOP_INDICES_MIN &&
            value <= DASHBOARD_TOP_INDICES_MAX,
        [],
    )

    const varianceField = useNumericSettingInput({
        storedValue: defaultVariance,
        onCommit: setDefaultVariance,
        parse: parseVariance,
        isValid: isVarianceValid,
    })

    const portfolioVarianceField = useNumericSettingInput({
        storedValue: portfolioVariance,
        onCommit: setPortfolioVariance,
        parse: parseVariance,
        isValid: isVarianceValid,
    })

    const topIndicesField = useNumericSettingInput({
        storedValue: dashboardTopIndicesLimit,
        onCommit: setDashboardTopIndicesLimit,
        parse: parseTopIndices,
        isValid: isTopIndicesValid,
    })

    return {
        defaultVariance,
        portfolioVariance,
        dashboardTopIndicesLimit,
        varianceHint: formatVarianceHint(defaultVariance),
        portfolioVarianceHint: formatVarianceHint(portfolioVariance),
        varianceField,
        portfolioVarianceField,
        topIndicesField,
    }
}

export type SettingsPageViewProps = ReturnType<typeof useSettingsPage>
