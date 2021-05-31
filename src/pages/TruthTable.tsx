import type { MathfieldElement } from "mathlive"
import type { MathfieldOptions } from "mathlive/dist/public/options"
import { Button, createStyles, Divider, Grid, makeStyles, Typography } from "@material-ui/core"
import { useCallback, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import TeX from "@matejmazur/react-katex"
import { LatexTable } from "../components/LatexTable"
import { useNotificationContext } from "../components/NotificationProvider"
import { buildTable } from "../util/buildTable"
import { Column } from "react-table"
import { Mathfield } from "../components/Mathfield"

const useStyles = makeStyles((theme) =>
  createStyles({
    gridRoot: {
      paddingTop: 10,
      paddingBottom: 10
    },
    mathfield: {
      minWidth: "25%",
      maxWidth: "50%"
    },
    buttonContainer: {
      paddingTop: 10
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

const mathfieldOptions: Partial<MathfieldOptions> = {
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
  }
}

const TruthTable = () => {
  const { initialValue } = useParams<{ initialValue?: string }>()
  const classes = useStyles()
  const mathfieldRef = useRef<MathfieldElement>(null)
  const [value, setValue] = useState<string>(initialValue ? decodeURI(initialValue) : "")
  const { triggerNotification } = useNotificationContext()

  const process = useCallback(() => {
    if (mathfieldRef.current) {
      setValue(mathfieldRef.current.getValue("latex-expanded"))
    }
  }, [mathfieldRef])

  const onShareClick = useCallback(() => {
    window.navigator.clipboard.writeText(
      `${window.location.protocol}//${window.location.host}/truthtable/${encodeURI(value)}`
    )
    triggerNotification("Share link copied to clipboard!", "info")
  }, [triggerNotification, value])

  const [helpOpen, setHelpOpen] = useState(true)
  const toggleHelp = useCallback(() => setHelpOpen(!helpOpen), [helpOpen])

  const [[columns, data], setColumns] = useState<[Array<Column>, Array<any>]>([[], []])
  useEffect(() => {
    if (value) {
      buildTable(value)
        .then((table) => {
          setColumns(table)
        })
        .catch((error) => {
          console.log(error)
          triggerNotification("Failed to parse proposition. See console for details", "error")
        })
    }
  }, [triggerNotification, value])

  return (
    <>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        alignContent="center"
        className={classes.gridRoot}
      >
        <Grid item>
          <Typography variant="h6" component="div">
            Proposition:
          </Typography>
        </Grid>
        <Grid item className={classes.mathfield}>
          <Mathfield value={value} options={mathfieldOptions} onSubmit={process} ref={mathfieldRef} />
        </Grid>
        <Grid
          container
          item
          direction="row"
          justify="center"
          alignItems="center"
          alignContent="center"
          className={classes.buttonContainer}
        >
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
      </Grid>
      <div className={classes.help} hidden={helpOpen}>
        <Divider />
        <Typography variant="h6" component="div">
          Shortcuts:
        </Typography>
        <Grid container alignItems="center" justify="center" spacing={2}>
          <Grid item>
            <Typography variant="h6" component="div">
              not: <TeX>\neg</TeX>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" component="div">
              and: <TeX>\wedge</TeX>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" component="div">
              or: <TeX>\vee</TeX>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" component="div">
              xor: <TeX>\oplus</TeX>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" component="div">
              if: <TeX>\to</TeX>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" component="div">
              iff: <TeX>\leftrightarrow</TeX>
            </Typography>
          </Grid>
        </Grid>
        <Divider />
      </div>
      <div className={classes.table}>{columns && data ? <LatexTable columns={columns} data={data} /> : null}</div>
    </>
  )
}

export default TruthTable
