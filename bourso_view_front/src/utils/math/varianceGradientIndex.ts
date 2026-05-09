/**
 * Retourne un **indice dans [0, 1]** qui résume la **variation relative** d’un segment de prix
 * (du début à la fin), normalisée par une amplitude attendue et par la **durée** du segment.
 *
 * Ce nombre sert surtout à **mapper la variation du segment** vers un gradient de couleurs
 * (par ex. rouge = forte baisse, vert = forte hausse) ou toute échelle continue comparable
 * entre segments de longueurs différentes.
 *
 * Interprétation de l’indice :
 * - **0.5** — variation « neutre » par rapport à l’échelle (delta ~ 0 par rapport à la variance effective).
 * - **Strictement inférieur à 0.5** — baisse relative (plus bas = plus marquée, jusqu’à 0).
 * - **Strictement supérieur à 0.5** — hausse relative (plus haut = plus marquée, jusqu’à 1).
 *
 * La variance utile est pondérée par la taille du segment : plus le segment est court (vs l’horizon
 * de référence), plus l’écart attendu sur ce laps de temps est réduit — ce qui permet de comparer
 * visuellement des segments de durées différentes.
 *
 * Formule : `effectiveVariance = variance × √(segmentSize / refHorizonDays)`, puis l’indice dérive
 * du rapport `(priceEnd - priceStart) / priceStart` par rapport à `2 × effectiveVariance`.
 *
 * @param priceStart — Prix au début du segment (référence pour le delta relatif). Si nul, l’indice est **0.5** (neutre).
 * @param priceEnd — Prix à la fin du segment.
 * @param variance — Amplitude de référence attendue sur la variation **relative** (ex. **0.3** pour ±30 % comme borne « typique » avant saturation aux extrêmes du gradient).
 * @param segmentSize — Taille du segment dans **la même unité** que `refHorizonDays` (ex. nombre de jours réels entre les deux points).
 * @param refHorizonDays — Horizon de référence sur lequel `variance` est calibrée (ex. durée totale du sparkline ~30 j). Sert à l’échelle temps √(segment / référence).
 *
 * @returns Un nombre dans **[0, 1]** prêt à être passé à un interpolateur de gradient ou assimilé.
 */
export function getVarianceGradientIndex(
    priceStart: number,
    priceEnd: number,
    variance: number,
    segmentSize: number,
    refHorizonDays: number
): number {
    const safeVariance = Math.max(variance, Number.EPSILON)
    const safeRef = Math.max(refHorizonDays, Number.EPSILON)
    const safeSegment = Math.max(segmentSize, Number.EPSILON)

    const timeScale = Math.sqrt(safeSegment / safeRef)
    const effectiveVariance = safeVariance * timeScale

    if (priceStart === 0) {
        return 0.5
    }

    const deltaRatio = (priceEnd - priceStart) / priceStart
    const indice = 0.5 + deltaRatio / (2 * effectiveVariance)
    return Math.max(0, Math.min(1, indice))
}

const VARIANCE_EXTREME_EPS = 1e-9

/**
 * `true` lorsque l’indice **clampé** vaut effectivement une borne (**0** ou **1**) :
 * la variation relative dépasse alors ce que l’échelle (variance × temps) mappe sur le gradient ;
 * la couleur affichée est saturée (extrême baisse ou hausse).
 */
export function isVarianceGradientExtreme(indice: number): boolean {
    return indice <= VARIANCE_EXTREME_EPS || indice >= 1 - VARIANCE_EXTREME_EPS
}
