import { Button, createStyles, Divider, Grid, makeStyles } from "@material-ui/core"
import React, { useCallback, useMemo, useRef, useState } from "react"
import MathView, { MathViewRef } from "react-math-view"
import { LatexTable } from "../components/LatexTable"
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
      justifyContent: 'center'
    }
  })
)

export const TruthTable = () => {
  const classes = useStyles()
  const mathfieldRef = useRef<MathViewRef>(null)
  const [value, setValue] = useState<string>("p→q")

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
      </Grid>
      <Divider />
      <div className={classes.table}>
        <LatexTable columns={columns} data={data} />
      </div>
    </>
  )
}
