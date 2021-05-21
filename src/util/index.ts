import React, { createContext, useContext } from "react"

export function createSafeContext<T>(): [() => T, React.Provider<T | undefined>] {
  const context = createContext<T | undefined>(undefined)

  const useSafeContext = (): T => {
    const safeContext = useContext(context)
    if (!safeContext) {
      throw new Error("useSafeContext must be used from within a Provider")
    }
    return safeContext
  }

  return [useSafeContext, context.Provider]
}
