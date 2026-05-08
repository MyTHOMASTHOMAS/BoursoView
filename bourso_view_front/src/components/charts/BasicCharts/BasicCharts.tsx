import { useState } from 'react'
import { BasicChartsView } from './BasicChartsView'
import { type DurationOption, useBasicCharts } from './useBasicCharts'

type BasicChartsProps = {
    indice: string
    authToken: string
}

export function BasicCharts({ indice, authToken }: BasicChartsProps) {
    const [selectedDuration, setSelectedDuration] = useState<DurationOption>('6M')
    const [appliedDuration, setAppliedDuration] = useState<DurationOption>('6M')
    const [customStartDate, setCustomStartDate] = useState('')
    const [customEndDate, setCustomEndDate] = useState('')
    const [appliedCustomRange, setAppliedCustomRange] = useState<{ startDate: string; endDate: string } | undefined>(undefined)

    const chartState = useBasicCharts({
        indice,
        authToken,
        duration: appliedDuration,
        customRange: appliedCustomRange
    })

    const onDurationChange = (nextDuration: DurationOption) => {
        setSelectedDuration(nextDuration)
        if (nextDuration !== 'CUSTOM') {
            setAppliedDuration(nextDuration)
        }
    }

    const onApplyCustomRange = () => {
        if (!customStartDate || !customEndDate) return
        setAppliedCustomRange({ startDate: customStartDate, endDate: customEndDate })
        setAppliedDuration('CUSTOM')
    }

    return (
        <BasicChartsView
            {...chartState}
            selectedDuration={selectedDuration}
            customStartDate={customStartDate}
            customEndDate={customEndDate}
            onCustomStartDateChange={setCustomStartDate}
            onCustomEndDateChange={setCustomEndDate}
            onApplyCustomRange={onApplyCustomRange}
            onDurationChange={onDurationChange}
        />
    )
}
