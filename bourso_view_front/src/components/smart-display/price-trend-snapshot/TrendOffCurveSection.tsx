import type { ReactNode } from 'react'

type TrendOffCurveSectionProps = {
    children: ReactNode
}

/** Rangée des cartes long terme (6 mois, 1 an), sous les cartes du sparkline. */
export function TrendOffCurveSection({ children }: TrendOffCurveSectionProps) {
    return <div className="flex flex-wrap gap-1.5 sm:gap-2">{children}</div>
}
