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
import React, { useCallback, useMemo, useRef, useState } from "react"
import TeX from "@matejmazur/react-katex"
import { Notification } from "../components/Notification"
import "katex/dist/katex.min.css"
import { Mathfield } from "../components/Mathfield"
import { parseSet } from "../util/parser/set"
import { evalSetExpression, parseSetExpression } from "../util/parser/setexpression"

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
  const setInputRef = useRef<MathfieldElement>(null)
  const exprInputRef = useRef<MathfieldElement>(null)
  const [sets, setSets] = useState<{ [id: string]: string }>({})
  const [selectedSet, setSelectedSet] = useState<string>("")
  const [currentSet, setCurrentSet] = useState<string>("")
  const [expr, setExpr] = useState<string>("")

  const onRadioSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSet(event.target.value)
  }, [])

  const onRadioEditSelect = useCallback(() => setCurrentSet(sets[selectedSet]), [selectedSet, sets])

  const processSet = useCallback(() => {
    const mathfield = setInputRef.current
    if (mathfield) {
      const value = mathfield.getValue("latex-expanded")
      const key = value.split("=")[0]
      if (key) {
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

  const [notificationData, setNotificationData] = useState<{
    message: string
    severity: "info" | "success" | "warning" | "error"
  }>({
    message: "",
    severity: "info"
  })
  const [notificationOpen, setNotificationOpen] = useState(false)
  const onShareClick = useCallback(() => {
    // TODO: Implement sharing
    window.navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}/sets/`)
    setNotificationData({ message: "Share link copied to clipboard!", severity: "info" })
    setNotificationOpen(true)
  }, [])
  const onNotificationClose = useCallback(() => {
    setNotificationOpen(false)
  }, [])

  const [helpOpen, setHelpOpen] = useState(true)
  const toggleHelp = useCallback(() => setHelpOpen(!helpOpen), [helpOpen])

  const renderSets = useMemo(
    () =>
      Object.keys(sets).map((value) => (
        <FormControlLabel key={value} value={value} control={<Radio />} label={<TeX>{sets[value]}</TeX>} />
      )),
    [sets]
  )

  const result = useMemo(() => {
    if (sets && expr) {
      const parsedSets = new Map<string, Set<SetElement>>()
      for (const key of Object.keys(sets)) {
        const [id, set] = parseSet(sets[key])
        parsedSets.set(id, set)
      }
      const exprAST = parseSetExpression(expr)
      return evalSetExpression(exprAST, parsedSets)
    }
  }, [expr, sets])

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
          <Button variant="contained" color="primary" onClick={onShareClick}>
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
        <Divider />
      </div>
      {result ? <TeX>{result}</TeX> : null}
      <Notification {...notificationData} open={notificationOpen} onClose={onNotificationClose} />
    </>
  )
}

export default Sets
