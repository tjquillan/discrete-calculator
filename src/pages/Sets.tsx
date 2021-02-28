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
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import MathView, { MathViewRef } from "react-math-view"
import TeX from "@matejmazur/react-katex"
import { Notification } from "../components/Notification"
import "katex/dist/katex.min.css"

const useStyles = makeStyles((theme) =>
  createStyles({
    gridRoot: {
      paddingTop: 10,
      paddingBottom: 30
    },
    mathfieldContainer: {
      textAlign: "center",
      padding: "8px"
    },
    mathfield: {
      minWidth: "50%",
      maxWidth: "75%",
      fontSize: "32px",
      textAlign: "center",
      padding: "8px",
      borderWidth: 2,
      borderStyle: "solid",
      borderColor: theme.palette.divider
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
      paddingBottom: 20
    }
  })
)

const Sets = () => {
  const classes = useStyles()
  const setInputdRef = useRef<MathViewRef>(null)
  const exprInputRef = useRef<MathViewRef>(null)
  const [sets, setSets] = useState<{ [id: string]: string }>({})
  const [selectedSet, setSelectedSet] = useState<string>("")
  const [currentSet, setCurrentSet] = useState<string>("")
  const [expr, setExpr] = useState<string>("")

  const onRadioSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSet(event.target.value)
  }, [])

  const onRadioEditSelect = useCallback(() => setCurrentSet(sets[selectedSet]), [selectedSet, sets])

  const processSet = useCallback(() => {
    const mathfield = setInputdRef.current
    if (mathfield) {
      const value = mathfield.getValue("latex-expanded")
      const key = value.split("=")[0]
      const newSets = { ...sets }
      newSets[key] = value
      setSets(newSets)
    }
  }, [sets])

  const processExpr = useCallback(() => {
    const mathfield = exprInputRef.current
    if (mathfield) {
      setExpr(mathfield.getValue("latex-expanded"))
    }
  }, [])

  useEffect(() => {
    const mathfield = setInputdRef.current
    if (mathfield) {
      mathfield.setOptions({
        defaultMode: "math",
        smartMode: false,
        smartFence: false,
        macros: {},
        inlineShortcuts: {},
        onKeystroke: (_sender, _keystroke, e) => {
          if (e.code === "Enter") {
            processSet()
            return false
          }
          return true
        }
      })
    }
  }, [processSet])

  useEffect(() => {
    const mathfield = exprInputRef.current
    if (mathfield) {
      mathfield.setOptions({
        defaultMode: "math",
        smartMode: false,
        smartFence: false,
        macros: {},
        inlineShortcuts: {
          uni: "\\cup",
          union: "\\cup",
          int: "\\cap",
          intersect: "\\cap"
        },
        onKeystroke: (_sender, _keystroke, e) => {
          if (e.code === "Enter") {
            processExpr()
            return false
          }
          return true
        }
      })
    }
  }, [processExpr])

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
            <Typography>Sets: </Typography>
          </Grid>
          <Grid item className={classes.mathfield}>
            <MathView value={currentSet} ref={setInputdRef} />
          </Grid>
          <Grid item>
            <Typography>Operations: </Typography>
          </Grid>
          <Grid item className={classes.mathfield}>
            <MathView value={expr} ref={exprInputRef} />
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
        <Grid container alignItems="center" justify="center" spacing={2}>
          <Grid item>
            <Typography variant="h6">
              not: <TeX>\neg</TeX>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6">
              and: <TeX>\wedge</TeX>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6">
              or: <TeX>\vee</TeX>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6">
              xor: <TeX>\oplus</TeX>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6">
              if: <TeX>\to</TeX>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6">
              iff: <TeX>\leftrightarrow</TeX>
            </Typography>
          </Grid>
        </Grid>
        <Divider />
      </div>
      <Notification {...notificationData} open={notificationOpen} onClose={onNotificationClose} />
    </>
  )
}

export default Sets
