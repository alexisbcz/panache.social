import { useRef, useCallback } from "react"

/**
 * Returns a throttled version of the provided callback that invokes the callback at most once per specified delay interval.
 *
 * The throttled function preserves the latest arguments and ensures that calls made within the delay period are deferred until the interval has elapsed.
 *
 * @param callback - The function to be throttled
 * @param delay - The minimum delay in milliseconds between callback invocations
 * @returns A throttled function with the same parameters as the original callback
 */
export function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastRan = useRef(Date.now())
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  return useCallback(
    (...args: Parameters<T>) => {
      const handler = () => {
        if (Date.now() - lastRan.current >= delay) {
          callback(...args)
          lastRan.current = Date.now()
        } else {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
          timeoutRef.current = setTimeout(
            () => {
              callback(...args)
              lastRan.current = Date.now()
            },
            delay - (Date.now() - lastRan.current)
          )
        }
      }

      handler()
    },
    [callback, delay]
  )
}
