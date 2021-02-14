import { Button, createStyles, Divider, Grid, makeStyles } from "@material-ui/core"
import React, { useCallback, useMemo, useRef, useState } from "react"
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
  const {initialValue} = useParams<{initialValue?: string}>()
  const classes = useStyles()
  const mathfieldRef = useRef<MathViewRef>(null)
  const [value, setValue] = useState<string>(initialValue ? initialValue : "r→q")

  const [shareNotificationOpen, setShareNotificationOpen] = useState(false)
  const onShareClick = useCallback(() => {
    window.navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}/truthtable/${value}`)
    setShareNotificationOpen(true)
  },[value])
  const onShareClose = useCallback(() => {
    setShareNotificationOpen(false)
  },[])

  const process = useCallback(() => {
    if (mathfieldRef.current) {
      setValue(mathfieldRef.current.getValue("ASCIIMath"))
    }
  }, [mathfieldRef])

  const [columns, data] = useMemo(() => {
    return buildTable(value)
  }, [value])

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
      <Notification message='Share link copied to clipboard!' severity='info' open={shareNotificationOpen} onClose={onShareClose}/>
      <Divider />
      <div className={classes.table}>
        <LatexTable columns={columns} data={data} />
      </div>
    </>
  )
}
