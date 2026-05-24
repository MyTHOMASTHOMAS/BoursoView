import { useCallback, useEffect, useState } from 'react'

type UseNumericSettingInputOptions = {
    storedValue: number
    onCommit: (value: number) => void
    parse: (raw: string) => number
    isValid: (value: number) => boolean
}

export function useNumericSettingInput({
    storedValue,
    onCommit,
    parse,
    isValid,
}: UseNumericSettingInputOptions) {
    const [input, setInput] = useState(() => String(storedValue))

    useEffect(() => {
        setInput(String(storedValue))
    }, [storedValue])

    const commit = useCallback(() => {
        const parsed = parse(input)
        if (isValid(parsed)) {
            onCommit(parsed)
            return
        }
        setInput(String(storedValue))
    }, [input, isValid, onCommit, parse, storedValue])

    return { input, setInput, commit }
}
