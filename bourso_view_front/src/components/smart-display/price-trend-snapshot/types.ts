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
