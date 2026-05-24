/**
 * @file Dashboard.tsx
 * @description Page d'accueil — résumé portefeuille via API getResume.
 */
import { Loader } from '../components/loading'
import { DashboardHeader } from './dashboard/components/DashboardHeader'
import { DashboardPortfolioCard } from './dashboard/components/DashboardPortfolioCard'
import { DashboardIndicesSection } from './dashboard/components/DashboardIndicesSection'
import { DashboardSummary } from './dashboard/components/DashboardSummary'
import { useDashboardPage } from './dashboard/useDashboardPage'

function DashboardResumeLoader() {
    return (
        <div className="glass-card radius-card flex items-center justify-center min-h-[12rem] p-5">
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
        <div className="glass-card radius-card flex flex-col items-center justify-center min-h-[12rem] p-5 gap-3 text-center h-full w-full">
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
        <div className="flex flex-col gap-6 w-full">
            <DashboardHeader lastUpdated={lastUpdated} />

            {resumeLoading && <DashboardResumeLoader />}

            {!resumeLoading && (
                <div className="flex flex-col gap-6 w-full">
                    {/* Ligne 1 : portefeuille | référentiels (même hauteur) */}
                    <div className="flex flex-col xl:flex-row gap-6 items-stretch w-full">
                        <div className="flex min-w-0 xl:flex-[2] self-stretch">
                            {resumeError && (
                                <DashboardResumeError
                                    message={resumeError}
                                    onRetry={() => { void refetchResume() }}
                                />
                            )}
                            {resume && (
                                <DashboardPortfolioCard
                                    totalValue={totalValue}
                                    totalDelta={totalDelta}
                                    asOf={asOf}
                                    total={resume.transaction.total}
                                />
                            )}
                        </div>

                        <div className="flex min-w-0 xl:flex-[3] self-stretch">
                            <DashboardIndicesSection
                                indices={topIndices}
                                loading={referentielsLoading}
                                error={referentielsError}
                                onRetry={() => { void refetchReferentiels() }}
                            />
                        </div>
                    </div>

                    {resume && <DashboardSummary data={resume} />}
                </div>
            )}
        </div>
    )
}
