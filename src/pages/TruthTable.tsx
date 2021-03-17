import type { MathfieldOptions } from "mathlive/dist/public/options"
import { Button, createStyles, Divider, Grid, makeStyles, Typography } from "@material-ui/core"
import { useCallback, useEffect, useRef, useState } from "react"
import MathView, { MathViewRef } from "react-math-view"
import { useParams } from "react-router-dom"
import TeX from "@matejmazur/react-katex"
import { LatexTable } from "../components/LatexTable"
import { Notification } from "../components/Notification"
import { buildTable } from "../util/buildTable"
import { Column } from "react-table"
import { MathfieldElement } from "mathlive"
import { useMathfieldOptions } from "../util/hooks/useMathfieldOptions"

const useStyles = makeStyles((theme) =>
  createStyles({
    gridRoot: {
      paddingTop: 10,
      paddingBottom: 30
    },
    mathfield: {
      minWidth: "25%",
      maxWidth: "50%",
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

const TruthTable = () => {
  const { initialValue } = useParams<{ initialValue?: string }>()
  const classes = useStyles()
  const mathfieldRef = useRef<MathViewRef>(null)
  const [value, setValue] = useState<string>(initialValue ? initialValue : "r→q")

  const process = useCallback(() => {
    if (mathfieldRef.current) {
      setValue(mathfieldRef.current.getValue("ASCIIMath"))
    }
  }, [mathfieldRef])

  const mathfieldOptions = useCallback(
    (mathfield: MathfieldElement): Partial<MathfieldOptions> => {
      return {
        defaultMode: "math",
        smartMode: false,
        smartFence: false,
        macros: {},
        inlineShortcuts: {
          "->": "\\to",
          "<->": "\\leftrightarrow",
          iff: "\\leftrightarrow",
          if: "\\to",
          implies: "\\to",
          to: "\\to",
          not: "\\neg",
          and: "\\wedge",
          or: "\\vee",
          xor: "\\oplus"
        },
        onKeystroke: (_sender, _keystroke, e) => {
          if (e.code === "Enter") {
            process()
            return false
          }
          return true
        }
      }
    },
    [process]
  )

  useMathfieldOptions(mathfieldRef, mathfieldOptions)

  const [notificationData, setNotificationData] = useState<{
    message: string
    severity: "info" | "success" | "warning" | "error"
  }>({
    message: "",
    severity: "info"
  })
  const [notificationOpen, setNotificationOpen] = useState(false)
  const onShareClick = useCallback(() => {
    window.navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}/truthtable/${value}`)
    setNotificationData({ message: "Share link copied to clipboard!", severity: "info" })
    setNotificationOpen(true)
  }, [value])
  const onNotificationClose = useCallback(() => {
    setNotificationOpen(false)
  }, [])

  const [helpOpen, setHelpOpen] = useState(true)
  const toggleHelp = useCallback(() => setHelpOpen(!helpOpen), [helpOpen])

  const [error, setError] = useState(false)
  const onError = useCallback((error: Error) => {
    setError(true)
    console.error(error)
    setNotificationData({ message: `Failed to parse proposition. See console for details`, severity: "error" })
    setNotificationOpen(true)
  }, [])

  const [[columns, data], setColumns] = useState<[Array<Column>, Array<any>]>([[], []])
  useEffect(() => {
    buildTable(value)
      .then((table) => {
        setColumns(table)
        setError(false)
      })
      .catch((error) => onError(error))
  }, [onError, value])

  return (
    <>
      <Grid container justify="center" alignItems="center" alignContent="center" className={classes.gridRoot}>
        <Grid item className={classes.mathfield}>
          <MathView value={value} ref={mathfieldRef} />
        </Grid>
        <Grid item className={classes.button}>
          <Button variant="contained" color="primary" onClick={process}>
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
      <div className={classes.table}>{error ? null : <LatexTable columns={columns} data={data} />}</div>
      <Notification {...notificationData} open={notificationOpen} onClose={onNotificationClose} />
    </>
  )
}

export default TruthTable
