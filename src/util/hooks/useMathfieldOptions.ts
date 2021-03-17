import { MathfieldElement } from "mathlive"
import type { MathfieldOptions } from "mathlive/dist/public/options"
import { useEffect } from "react"

export function useMathfieldOptions(
  ref: React.RefObject<MathfieldElement>,
  options: (mathfield: MathfieldElement) => Partial<MathfieldOptions>
): void {
  useEffect(() => {
    const mathfield = ref.current
    if (mathfield) {
      mathfield.setOptions(options(mathfield))
    }
  }, [options, ref])
}
