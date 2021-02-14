import { createStyles, makeStyles, Typography } from "@material-ui/core"

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      justifyContent: "center",
      textAlign: "center"
    }
  })
)

export const Home = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography variant="h1">Discrete Calculator</Typography>
      <Typography variant="h4">A Calculator for Discrete Mathematics</Typography>
    </div>
  )
}
