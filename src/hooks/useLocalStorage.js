import { useEffect, useRef, useState } from 'react'
import { readStorage, resolveValue, writeStorage } from '../utils/storage'

export function useLocalStorage(key, initialValue) {
  const initialRef = useRef(initialValue)
  initialRef.current = initialValue
  const keyRef = useRef(key)
  const skipWrite = useRef(false)
  const [value, setValue] = useState(() => readStorage(key, initialValue))

  useEffect(() => {
    if (keyRef.current === key) return
    keyRef.current = key
    setValue(readStorage(key, resolveValue(initialRef.current)))
    skipWrite.current = true
  }, [key])

  useEffect(() => {
    if (skipWrite.current) {
      skipWrite.current = false
      return
    }
    writeStorage(key, value)
  }, [key, value])

  return [value, setValue]
}
