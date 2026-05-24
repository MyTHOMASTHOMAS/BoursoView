import { useMemo } from 'react'
import { useAppStore, useReferentiel, useResume } from '../../store'
import {
    computePnL,
    format,
    formatSignedPercent,
    pickTopReferentielsByVarianceGap,
} from '../../utils/math'

function formatDashboardAsOf(timestamp?: number): string {
    const date = timestamp ? new Date(timestamp) : new Date()
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
}

function formatLastUpdated(timestamp?: number): string {
    const date = timestamp ? new Date(timestamp) : new Date()
    return date.toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export function useDashboardPage() {
    const {
        resume,
        resumeLoading,
        resumeError,
        resumeUpdatedAt,
        refetchResume,
    } = useResume()

    const {
        referentiels,
        referentielsLoading,
        referentielsError,
        refetchReferentiels,
    } = useReferentiel()

    const defaultVariance = useAppStore((state) => state.defaultVariance)
    const dashboardTopIndicesLimit = useAppStore((state) => state.dashboardTopIndicesLimit)

    const topIndices = useMemo(
        () => pickTopReferentielsByVarianceGap(
            referentiels,
            dashboardTopIndicesLimit,
            defaultVariance,
        ),
        [referentiels, defaultVariance, dashboardTopIndicesLimit],
    )

    const totalValue = useMemo(
        () => (resume ? format(resume.transaction.total.estimated.current) : ''),
        [resume],
    )

    const totalDelta = useMemo(() => {
        if (!resume) return '—'
        const pnl = computePnL(
            resume.transaction.total.estimated.current,
            resume.transaction.total.invest.current,
        )
        return formatSignedPercent(pnl.percent)
    }, [resume])

    const asOf = useMemo(
        () => formatDashboardAsOf(resumeUpdatedAt),
        [resumeUpdatedAt],
    )

    const lastUpdated = useMemo(
        () => formatLastUpdated(resumeUpdatedAt),
        [resumeUpdatedAt],
    )

    return {
        resume,
        resumeLoading,
        resumeError,
        totalValue,
        totalDelta,
        asOf,
        lastUpdated,
        refetchResume,
        topIndices,
        referentielsLoading,
        referentielsError,
        refetchReferentiels,
    }
}
