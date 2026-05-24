export { getVarianceGradientIndex, isVarianceGradientExtreme } from './varianceGradientIndex'

export {
    REFERENTIEL_TREND_REF_HORIZON_DAYS,
    varianceGradientGapFromIndice,
    computeReferentielVarianceGapScore,
    rankReferentielsByVarianceGap,
    pickTopReferentielsByVarianceGap,
} from './referentielVarianceRanking'

export type { RankedReferentiel } from './referentielVarianceRanking'

export {
    computePnL,
    computePeriodDelta,
    computeModifiedDietz,
    computeAdjustedPriceReference,
    computeTotalInvested,
    format,
    formatSignedPercent,
    formatSignedNumber,
    formatSignedEur,
} from './portfolioStats'

export type { PnLResult, PeriodDelta } from './portfolioStats'
