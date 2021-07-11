import { Grid, Typography } from "@material-ui/core"

const Home = () => {
  return (
    <Grid container direction="column" justifyContent="center" alignItems="center" alignContent="center">
      <Grid item>
        <Typography variant="h1">Discrete Calculator</Typography>
      </Grid>
      <Grid item>
        <Typography variant="h4" component="div" role="doc-subtitle">
          A Calculator for Discrete Mathematics
        </Typography>
      </Grid>
    </Grid>
  )
}

export default Home
