/**
 * Types des props du bloc « snapshot » des variations de prix (cartes 1j / 7j / 1 mois).
 */

/**
 * Props du composant `PriceTrendSnapshot` : prix spot et références historiques pour trois horizons.
 */
export type PriceTrendSnapshotProps = {
    /** Prix courant affiché en en-tête et utilisé comme extrémité de chaque segment de variation. */
    price: number
    /** Référence « il y a ~1 jour » (comparaison courte). */
    price_j_1: number
    /** Référence « il y a ~7 jours ». */
    price_j_7: number
    /** Référence « il y a ~1 mois » (~30 jours), alignée avec le point 30j du sparkline. */
    price_m_1: number
    /**
     * Amplitude de référence pour la variation relative normalisée (ex. **0.2** pour ±20 %).
     * Doit rester alignée avec `QuickTrendCurve` (`maxVariancePercent`) lorsque les deux sont utilisés ensemble.
     */
    variance?: number
    /** Classes Tailwind additionnelles sur le conteneur racine. */
    className?: string
}

/**
 * Description d’une colonne de variation dans `PriceTrendSnapshot` : libellé, prix de référence et durée du segment.
 */
export type DeltaMeta = {
    /** Texte affiché au-dessus de la carte (ex. « 1 jour »). */
    label: string
    /** Prix historique servant de début de segment pour le delta et l’indice de variance. */
    reference: number
    /**
     * Durée du segment en jours (pour `getVarianceGradientIndex`), cohérente avec l’horizon global du module.
     */
    segmentDays: number
}

/**
 * Séries temporelles de valorisation d'un portefeuille.
 * Utilisées par `PortfolioTrendSnapshot` et `PortfolioTrendHoverCard`.
 *
 * Seuls `current`, `j1`, `j7` et `j30` alimentent le module tendance (sparkline + 3 cartes popup).
 * `m6` et `y1` restent disponibles pour d'autres écrans mais ne sont pas affichés dans `TrendHoverCard`.
 *
 * Les valeurs à `0` sont une sentinelle « pas de données »
 * (ex : `y1 = 0` si le portefeuille a moins d'un an d'historique).
 */
export type PortfolioPeriodSeries = {
    current: number
    j1: number
    j7: number
    j30: number
    m6: number
    y1: number
}
