import type { MathfieldElement } from "mathlive"
import type { Set } from "immutable"
import type { SetElement } from "../util/parser/set/ast"
import {
  Button,
  createStyles,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  makeStyles,
  Radio,
  RadioGroup,
  Typography
} from "@material-ui/core"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import TeX from "@matejmazur/react-katex"
import "katex/dist/katex.min.css"
import { Mathfield } from "../components/Mathfield"
import { useNotificationContext } from "../components/NotificationProvider"
import { evalSetExpression, parseSetAssignment, parseSetExpression } from "../util/parser/set"

const useStyles = makeStyles(() =>
  createStyles({
    gridRoot: {
      paddingTop: 10,
      paddingBottom: 10
    },
    mathfieldContainer: {
      textAlign: "center",
      padding: "8px"
    },
    mathfield: {
      minWidth: "50%",
      maxWidth: "75%"
    },
    button: {
      paddingLeft: "10px"
    },
    table: {
      justifyContent: "center"
    },
    help: {
      justifyContent: "center",
      textAlign: "center",
      paddingBottom: 10
    },
    resultContainer: {
      paddingTop: 10
    },
    result: {
      fontSize: 30
    }
  })
)

const setMathfieldOptions = {
  inlineShortcuts: {
    eset: "\\emptyset"
  }
}

const exprMathfieldOptions = {
  inlineShortcuts: {
    uni: "\\cup",
    int: "\\cap",
    sup: "\\supseteq",
    nsup: "\\nsupseteq",
    psup: "\\supset",
    npsup: "\\not\\supset",
    sub: "\\subseteq",
    nsub: "\\nsubseteq",
    psub: "\\subset",
    npsub: "\\not\\subset"
  }
}

const Sets = () => {
  const classes = useStyles()
  const { triggerNotification } = useNotificationContext()
  const setInputRef = useRef<MathfieldElement>(null)
  const exprInputRef = useRef<MathfieldElement>(null)
  const [sets, setSets] = useState<{ [id: string]: string }>({})
  const [selectedSet, setSelectedSet] = useState<string>("")
  const [currentSet, setCurrentSet] = useState<string>("")
  const [expr, setExpr] = useState<string>("")
  const [result, setResult] = useState<string>()

  const onRadioSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSet(event.target.value)
  }, [])

  const onRadioEditSelect = useCallback(() => setCurrentSet(sets[selectedSet]), [selectedSet, sets])

  const processSet = useCallback(() => {
    const mathfield = setInputRef.current
    if (mathfield) {
      const value = mathfield.getValue("latex-expanded")
      const splitValue = value.split("=")
      if (splitValue.length >= 2 && splitValue[1] && splitValue[0] === splitValue[0].toUpperCase()) {
        const key = splitValue[0]
        const newSets = { ...sets }
        newSets[key] = value
        setSets(newSets)
      }
    }
  }, [sets])

  const processExpr = useCallback(() => {
    const mathfield = exprInputRef.current
    if (mathfield) {
      setExpr(mathfield.getValue("latex-expanded"))
    }
  }, [])

  const onShareClick = useCallback(() => {
    // TODO: Implement sharing
    // window.navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}/sets/`)
    triggerNotification("Link sharing is not yet implemented.", "warning")
  }, [triggerNotification])

  const [helpOpen, setHelpOpen] = useState(true)
  const toggleHelp = useCallback(() => setHelpOpen(!helpOpen), [helpOpen])

  const renderSets = useMemo(
    () =>
      Object.keys(sets).map((value) => (
        <FormControlLabel key={value} value={value} control={<Radio />} label={<TeX>{sets[value]}</TeX>} />
      )),
    [sets]
  )

  useEffect(() => {
    if (sets && expr) {
      const parsedSets = new Map<string, Set<SetElement>>()
      for (const key of Object.keys(sets)) {
        try {
          const [id, set] = parseSetAssignment(sets[key])
          parsedSets.set(id, set)
        } catch (error) {
          console.log(error)
          triggerNotification(`Failed to parse set ${key}! See console for details.`, "error")
          return
        }
      }
      try {
        const exprAST = parseSetExpression(expr)
        setResult(evalSetExpression(exprAST, parsedSets))
      } catch (error) {
        console.log(error)
        triggerNotification(`Failed to parse set expression! See console for details.`, "error")
      }
    }
  }, [expr, sets, triggerNotification])

  return (
    <>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        alignContent="center"
        className={classes.gridRoot}
      >
        <Grid container item direction="row" justify="center" alignItems="center" alignContent="center">
          {Object.keys(sets).length !== 0 ? (
            <>
              <Grid item>
                <FormControl component="fieldset">
                  <RadioGroup value={selectedSet} onChange={onRadioSelect}>
                    {renderSets}
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" onClick={onRadioEditSelect}>
                  Edit
                </Button>
              </Grid>
            </>
          ) : null}
        </Grid>
        <Grid
          container
          item
          direction="column"
          justify="center"
          alignItems="center"
          alignContent="center"
          className={classes.mathfieldContainer}
        >
          <Grid item>
            <Typography variant="h6">Set: </Typography>
          </Grid>
          <Grid item className={classes.mathfield}>
            <Mathfield value={currentSet} ref={setInputRef} options={setMathfieldOptions} onEnter={processSet} />
          </Grid>
          <Grid item>
            <Typography variant="h6">Expression: </Typography>
          </Grid>
          <Grid item className={classes.mathfield}>
            <Mathfield value={expr} ref={exprInputRef} options={exprMathfieldOptions} onEnter={processExpr} />
          </Grid>
        </Grid>
        <Grid item className={classes.button}>
          <Button variant="contained" color="primary" onClick={processExpr}>
            Go
          </Button>
        </Grid>
        <Grid item className={classes.button}>
          <Button variant="contained" disabled color="primary" onClick={onShareClick}>
            Share
          </Button>
        </Grid>
        <Grid item className={classes.button}>
          <Button variant="contained" color="primary" onClick={toggleHelp}>
            Help
          </Button>
        </Grid>
      </Grid>
      <div className={classes.help} hidden={helpOpen}>
        <Divider />
        <Typography variant="h6">Shortcuts:</Typography>
        <Grid container direction="row" alignItems="center" justify="center" spacing={4}>
          <Grid item>
            <Grid container direction="column" alignItems="center" justify="center">
              <Grid item>
                <Typography variant="h6">Set:</Typography>
                <Divider />
              </Grid>
              <Grid item>
                <Typography variant="h6">
                  emptyset (eset): <TeX>\emptyset</TeX>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="column" alignItems="center" justify="center">
              <Grid item>
                <Typography variant="h6">Expression:</Typography>
                <Divider />
              </Grid>
              <Grid item>
                <Typography variant="h6">
                  union (uni): <TeX>\cup</TeX>
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">
                  intersect (int): <TeX>\cap</TeX>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <Divider hidden={helpOpen && result === undefined} />
      {result ? (
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          alignContent="center"
          className={classes.resultContainer}
        >
          <Grid item>
            <Typography variant="h4">Result:</Typography>
          </Grid>
          <Grid item>
            <TeX block className={classes.result}>
              {result}
            </TeX>
          </Grid>
        </Grid>
      ) : null}
    </>
  )
}

export default Sets
