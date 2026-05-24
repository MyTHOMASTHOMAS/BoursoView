/**
 * @file Constantes « prix / tendance » partagées entre le sparkline (`QuickTrendCurve`),
 * les cartes delta (`TrendDeltaCard`) et la normalisation {@link getVarianceGradientIndex}.
 *
 * Toute évolution des durées du sparkline doit passer par ce fichier pour garder un horizon
 * et des segments cohérents avec les calculs de gradient.
 */

/** Durée calendaire du segment J-30 → J-7 ; utilisée pour l’axe temporel du sparkline et la variance du segment. */
export const REAL_DAYS_J30_TO_J7 = 30 - 7

/** Durée calendaire du segment J-7 → J-1 (entre deux points du sparkline). */
export const REAL_DAYS_J7_TO_J1 = 7 - 1

/** Durée calendaire du segment J-1 → prix actuel (dernier segment du sparkline). */
export const REAL_DAYS_J1_TO_NOW = 1

/**
 * Horizon de référence pour la formule de variance : **somme** des trois segments ci-dessus (~30 jours).
 * À utiliser comme `refHorizonDays` dans `getVarianceGradientIndex` pour ce module.
 */
export const PRICE_TREND_REF_HORIZON_DAYS =
    REAL_DAYS_J30_TO_J7 + REAL_DAYS_J7_TO_J1 + REAL_DAYS_J1_TO_NOW

/**
 * Couleurs HEX du dégradé interpolé : extrême baisse → extrême hausse.
 * Référence unique partagée : `calculateMultiColor` ne mute pas le tableau (pas besoin de `[...]` à chaque appel).
 */
export const PRICE_TREND_GRADIENT_HEX: string[] = ['#ef4444', '#22c55e']

/**
 * Horizons affichés dans le snapshot popup, alignés sur les 4 points du sparkline (J-30 → spot).
 */
export const TREND_SNAPSHOT_PERIODS = [
    { label: '1 jour', segmentDays: 1, portfolioKey: 'j1' as const },
    { label: '7 jours', segmentDays: 7, portfolioKey: 'j7' as const },
    { label: '1 mois', segmentDays: 30, portfolioKey: 'j30' as const },
] as const

/**
 * Horizons **cartes uniquement** (absents du sparkline / mini-courbe).
 * SegmentDays sert au gradient de couleur, pas à la courbe.
 */
export const TREND_SNAPSHOT_OFF_CURVE_PERIODS = [
    { label: '6 mois', segmentDays: 182, portfolioKey: 'm6' as const },
    { label: '1 an', segmentDays: 365, portfolioKey: 'y1' as const },
] as const
