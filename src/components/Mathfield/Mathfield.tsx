import type { MathfieldElement } from "mathlive"
import type { MathfieldOptions } from "mathlive/dist/public/options"
import "mathlive/dist/mathlive-fonts.css"
import "mathlive/dist/mathlive.min"
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, memo } from "react"
import { createStyles, makeStyles } from "@material-ui/core"
import clsx from "clsx"

declare global {
  /** @internal */
  namespace JSX {
    interface IntrinsicElements {
      "math-field": React.DetailedHTMLProps<React.HTMLAttributes<MathfieldElement>, MathfieldElement>
    }
  }
}

const useStyles = makeStyles((theme) =>
  createStyles({
    mathfield: {
      borderColor: theme.palette.divider,
      borderWidth: 2,
      borderStyle: "solid",
      padding: "8px",
      fontSize: "32px",
      textAlign: "center",
      "&:focus-within": {
        borderColor: theme.palette.primary.main
      },
      // Mathlive specific styles (https://cortexjs.io/mathlive/guides/customizing/)
      "--hue": `204 !important`,
      "--highlight": `${theme.palette.action.selected} !important`,
      "--highlight-inactive": `${theme.palette.action.disabled} !important`,
      "--caret": `${theme.palette.primary.light} !important`,
      "--primary": `${theme.palette.primary.light} !important`
    }
  })
)

type MathfieldProps = {
  value?: string
  className?: string
  options?: Partial<MathfieldOptions>
  onEnter?: () => void
}

const baseOptions: Partial<MathfieldOptions> = {
  defaultMode: "math",
  smartMode: false,
  smartFence: false,
  plonkSound: null,
  keypressSound: null,
  macros: {},
  inlineShortcuts: {}
}

export const Mathfield = memo(
  forwardRef<MathfieldElement, MathfieldProps>(({ value, className, options, onEnter }, ref) => {
    const classes = useStyles()
    const internalRef = useRef<MathfieldElement>(null)
    useImperativeHandle(ref, () => internalRef.current!, [internalRef])

    const mathfieldOptions: Partial<MathfieldOptions> = useMemo(() => {
      return { ...baseOptions, ...options }
    }, [options])
    useEffect(() => {
      internalRef.current?.setOptions(mathfieldOptions)
    }, [mathfieldOptions])

    // Apply onKeystroke option (This is seperate because we don't want other settings overwritten when onEnter changes)
    useEffect(() => {
      const mathfield = internalRef.current
      if (mathfield && onEnter) {
        mathfield.setOptions({
          onKeystroke: (_sender, _keystroke, e) => {
            if (e.code === "Enter" && mathfield.mode !== "latex") {
              onEnter()
              return false
            }
            return true
          }
        })
      }
    }, [onEnter])

    useEffect(() => {
      internalRef.current?.setValue(value)
    }, [value])

    return (
      <div className={clsx(classes.mathfield, className)}>
        <math-field
          ref={internalRef}
          style={{
            outline: "none"
          }}
        >
          {value}
        </math-field>
      </div>
    )
  })
)
