export type Color = string

/**
 * Propriétés du composant TrendArrowIcon.
 */
type TrendArrowIconProps = {
    /**
     * Tableau des valeurs numériques représentant les points de la courbe.
     * Si le tableau est vide ou ne contient qu'une seule valeur, un trait droit horizontal sera tracé.
     */
    values: number[]
    /**
     * Tableau définissant l'espacement (ou le "poids" visuel) entre chaque point sur l'axe X.
     * Utile pour représenter des intervalles temporels irréguliers (ex: `[30, 7, 1]`).
     * Si le tableau est plus court que le nombre d'intervalles nécessaires, la dernière valeur sera répétée.
     * Si non fourni, l'espacement entre chaque point sera uniforme.
     */
    gap?: number[]
    /**
     * Largeur totale du conteneur SVG en pixels.
     * @default 100
     */
    width?: number
    /**
     * Hauteur totale du conteneur SVG en pixels.
     * @default 40
     */
    height?: number
    /**
     * Couleur de la ligne.
     * Accepte n'importe quelle valeur CSS valide (hex, rgb, noms de couleur, 'currentColor').
     * @default 'currentColor'
     */
    color?: string
    /**
     * Épaisseur du trait de la courbe en pixels.
     * @default 1.8
     */
    strokeWidth?: number
    /**
     * Valeur minimum forcée pour l'axe Y.
     * Si non fournie, le minimum est calculé à partir des valeurs.
     */
    minY?: number
    /**
     * Valeur maximum forcée pour l'axe Y.
     * Si non fournie, le maximum est calculé à partir des valeurs.
     */
    maxY?: number
    /**
     * Couleur de fond sous chaque portion de courbe entre deux points consécutifs.
     * `backgroundColors[i]` remplit la zone entre le point i et le point i + 1.
     * S'il manque des entrées par rapport au nombre de segments, ces portions restent sans fond (transparent).
     */
    backgroundColors?: Color[]
    /**
     * Pour chaque segment de fond : si `true`, applique une animation de clignotement (variance saturée).
     * Doit avoir la même longueur que les segments avec couleur ; entrées manquantes = pas d’animation.
     */
    backgroundPulseSegments?: boolean[]
}

type ChartPoint = { x: number; y: number }

function computeChartGeometry(
    values: number[],
    gap: number[] | undefined,
    width: number,
    height: number,
    minY: number | undefined,
    maxY: number | undefined
): {
    strokePath: string
    points: ChartPoint[]
    baseY: number
    paddingY: number
} | null {
    const midY = height / 2

    if (!values || values.length < 2) {
        return {
            strokePath: `M 0,${midY} L ${width - 8},${midY}`,
            points: [],
            baseY: height - 7,
            paddingY: 7
        }
    }

    const dataMin = Math.min(...values)
    const dataMax = Math.max(...values)
    const min = minY !== undefined ? minY : dataMin
    const max = maxY !== undefined ? maxY : dataMax
    const range = max - min || 1

    const paddingX = 10
    const paddingY = 7
    const drawWidth = width - paddingX
    const drawHeight = height - paddingY * 2
    const baseY = height - paddingY

    const actualGaps: number[] = []
    const hasCustomGaps = gap && gap.length > 0

    for (let i = 0; i < values.length - 1; i++) {
        if (!hasCustomGaps) {
            actualGaps.push(1)
        } else if (gap && i < gap.length) {
            actualGaps.push(gap[i])
        } else if (gap) {
            actualGaps.push(gap[gap.length - 1])
        }
    }

    const cumulativeGaps = [0]
    let totalGapSum = 0
    for (const g of actualGaps) {
        totalGapSum += g
        cumulativeGaps.push(totalGapSum)
    }

    const points = values.map((val, index) => {
        const x = totalGapSum === 0 ? 0 : (cumulativeGaps[index] / totalGapSum) * drawWidth

        const normalizedY = ((val - min) / range) * drawHeight
        const y = height - paddingY - normalizedY

        return { x, y }
    })

    let strokePath: string
    if (points.length === 2) {
        strokePath = `M ${points[0].x},${points[0].y} L ${points[1].x},${points[1].y}`
    } else {
        let path = `M ${points[0].x},${points[0].y}`
        for (let i = 1; i < points.length; i += 1) {
            const prev = points[i - 1]
            const current = points[i]
            const midX = (prev.x + current.x) / 2
            const midY = (prev.y + current.y) / 2
            path += ` Q ${prev.x},${prev.y} ${midX},${midY}`
        }
        const last = points[points.length - 1]
        path += ` T ${last.x},${last.y}`
        strokePath = path
    }

    return { strokePath, points, baseY, paddingY }
}

/**
 * Composant React affichant un mini-graphique d'évolution (sparkline).
 * * @example
 * ```tsx
 * // Affiche une courbe bleue avec un espacement spécifique
 * <TrendArrowIcon values={[120, 140, 110, 115]} gap={[30, 7, 1]} color="#2563eb" />
 * ```
 */
export function TrendArrowIcon({
    values,
    gap,
    width = 100,
    height = 40,
    color = 'currentColor',
    strokeWidth = 1.8,
    minY,
    maxY,
    backgroundColors,
    backgroundPulseSegments
}: TrendArrowIconProps) {
    const geometry = computeChartGeometry(values, gap, width, height, minY, maxY)

    const fillPaths =
        geometry &&
        geometry.points.length >= 2 &&
        backgroundColors &&
        backgroundColors.length > 0
            ? geometry.points.slice(0, -1).map((p0, i) => {
                  const segmentColor = backgroundColors[i]
                  if (segmentColor === undefined || segmentColor === '') {
                      return null
                  }

                  const p1 = geometry.points[i + 1]
                  const { baseY } = geometry
                  const d = `M ${p0.x},${baseY} L ${p0.x},${p0.y} L ${p1.x},${p1.y} L ${p1.x},${baseY} Z`

                  const pulse = Boolean(backgroundPulseSegments?.[i])

                  return (
                      <path
                          key={`bg-${i}`}
                          d={d}
                          fill={segmentColor}
                          stroke="none"
                          className={pulse ? 'animate-variance-extreme' : undefined}
                      />
                  )
              })
            : null

    const strokePath = geometry?.strokePath ?? `M 0,${height / 2} L ${width - 8},${height / 2}`

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ overflow: 'visible' }}
        >
            {fillPaths}
            <path
                d={strokePath}
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}
