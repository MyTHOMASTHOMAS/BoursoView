type SettingsNumberInputProps = {
    id: string
    value: string
    onChange: (value: string) => void
    onCommit: () => void
    min?: number
    max?: number
    step?: number
    inputMode?: 'decimal' | 'numeric'
    describedBy?: string
}

const inputClassName =
    'w-36 rounded-lg border border-primary/30 bg-slate-900/80 px-3 py-2 text-text text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

export function SettingsNumberInput({
    id,
    value,
    onChange,
    onCommit,
    min,
    max,
    step,
    inputMode = 'decimal',
    describedBy,
}: SettingsNumberInputProps) {
    return (
        <input
            id={id}
            type="number"
            inputMode={inputMode}
            step={step}
            min={min}
            max={max}
            className={inputClassName}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onCommit}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.currentTarget.blur()
                }
            }}
            aria-describedby={describedBy}
        />
    )
}
