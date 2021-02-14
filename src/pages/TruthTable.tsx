import { Button, createStyles, Divider, Grid, makeStyles } from "@material-ui/core"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import MathView, { MathViewRef } from "react-math-view"
import { useParams } from "react-router-dom"
import { LatexTable } from "../components/LatexTable"
import { Notification } from "../components/Notification"
import { buildTable } from "./buildTable"

const useStyles = makeStyles((theme) =>
  createStyles({
    gridRoot: {
      paddingTop: 10,
      paddingBottom: 30
    },
    mathfield: {
      width: "25%",
      fontSize: "32px",
      textAlign: "center",
      padding: "8px",
      border: "1px solid rgba(0, 0, 0, .3)"
    },
    button: {
      paddingLeft: "10px"
    },
    table: {
      justifyContent: "center"
    }
  })
)

export const TruthTable = () => {
  const { initialValue } = useParams<{ initialValue?: string }>()
  const classes = useStyles()
  const mathfieldRef = useRef<MathViewRef>(null)
  const [value, setValue] = useState<string>(initialValue ? initialValue : "r→q")

  useEffect(() => {
    const ref = mathfieldRef.current
    if (ref) {
      ref.setOptions({
        defaultMode: 'math',
        smartMode: false,
        smartFence: false,
        macros: {},
        inlineShortcuts: {
          '->': '\\to',
          '<->': '\\leftrightarrow',
          iff: '\\leftrightarrow',
          implies: '\\to',
          to: '\\to',
          not: '\\neg',
          and: '\\wedge',
          or: '\\vee',
          xor: '\\oplus'
        }
      })
    }
  }, [mathfieldRef])

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
    setNotificationData({message: "Share link copied to clipboard!", severity: 'info'})
    setNotificationOpen(true)
  }, [value])
  const onNotificationClose = useCallback(() => {
    setNotificationOpen(false)
  }, [])

  const process = useCallback(() => {
    if (mathfieldRef.current) {
      setValue(mathfieldRef.current.getValue("ASCIIMath"))
    }
  }, [mathfieldRef])

  const [error, setError] = useState(false)
  const onError = useCallback((error: Error) => {
    setError(true)
    console.error(error)
    setNotificationData({message: `Failed to parse proposition. See console for details`, severity: 'error'})
    setNotificationOpen(true)
  }, [])
  const [columns, data] = useMemo(() => {
    let output: any[] = []
    try {
      output = buildTable(value)
      setError(false)
    } catch (error) {
      onError(error)
    }
    return output
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
      </Grid>
      <Notification {...notificationData} open={notificationOpen} onClose={onNotificationClose} />
      <Divider />
      <div className={classes.table}>
        { error ?
          null :
          <LatexTable columns={columns} data={data} />}
      </div>
    </>
  )
}
