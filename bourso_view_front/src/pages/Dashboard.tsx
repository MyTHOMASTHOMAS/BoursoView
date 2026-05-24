/**
 * @file Dashboard.tsx
 * @description Page d'accueil — résumé portefeuille via API getResume.
 */
import { Loader } from '../components/loading'
import { DashboardHeader } from './dashboard/components/DashboardHeader'
import { DashboardPortfolioCard } from './dashboard/components/DashboardPortfolioCard'
import { DashboardTopIndices } from './dashboard/components/DashboardTopIndices'
import { DashboardSummary } from './dashboard/components/DashboardSummary'
import { useDashboardPage } from './dashboard/useDashboardPage'

function DashboardResumeLoader() {
    return (
        <div className="glass-card radius-card">
            <Loader message="Chargement du résumé portefeuille..." />
        </div>
    )
}

function DashboardResumeError({
    message,
    onRetry,
}: {
    message: string
    onRetry: () => void
}) {
    return (
        <div className="glass-card radius-card p-5 space-y-3 text-center">
            <p className="text-error text-small">{message}</p>
            <button
                type="button"
                onClick={onRetry}
                className="btn-padding radius-btn border border-subtle text-primary hover:surface-hover transition-colors cursor-pointer"
            >
                Réessayer
            </button>
        </div>
    )
}

export default function Dashboard() {
    const {
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
    } = useDashboardPage()

    return (
        <div className="space-y-6">
            <DashboardHeader lastUpdated={lastUpdated} />

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                <div className="xl:col-span-2">
                    {resumeLoading && <DashboardResumeLoader />}
                    {!resumeLoading && resumeError && (
                        <DashboardResumeError
                            message={resumeError}
                            onRetry={() => { void refetchResume() }}
                        />
                    )}
                    {!resumeLoading && resume && (
                        <DashboardPortfolioCard
                            totalValue={totalValue}
                            totalDelta={totalDelta}
                            asOf={asOf}
                            total={resume.transaction.total}
                        />
                    )}
                </div>

                <div className="xl:col-span-3">
                    <DashboardTopIndices
                        indices={topIndices}
                        loading={referentielsLoading}
                        error={referentielsError}
                        onRetry={() => { void refetchReferentiels() }}
                    />
                </div>
            </div>

            {!resumeLoading && resume && <DashboardSummary data={resume} />}
        </div>
    )
}
