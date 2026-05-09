/**
 * Formatage affichage des variations signées (pourcentage et montant brut).
 */

/**
 * Affiche un pourcentage avec signe explicite (`+` / `-`) ou `--` si la valeur n’est pas finie.
 *
 * @param value — Pourcentage déjà calculé (ex. variation relative × 100).
 * @returns Chaîne du type `+1,23 %` (locale dépend du navigateur pour `.`).
 */
export function formatSignedPercent(value: number): string {
    if (!Number.isFinite(value)) return '--'
    const sign = value > 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}%`
}

/**
 * Affiche une variation en valeur absolue avec signe ou `--` si non finie.
 *
 * @param value — Différence `prix - référence` (même unité que les prix).
 */
export function formatSignedAmount(value: number): string {
    if (!Number.isFinite(value)) return '--'
    const sign = value > 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}`
}
