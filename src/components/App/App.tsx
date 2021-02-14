import React from "react"
import {
  AppBar,
  createStyles,
  CssBaseline,
  Drawer,
  Link,
  List,
  makeStyles,
  Toolbar,
  Typography
} from "@material-ui/core"
import { BrowserRouter as Router, Link as RouterLink, Route, Switch } from "react-router-dom"
import { ListItemNavLink } from "../ListItemLink"
import { TruthTable } from "../../pages/TruthTable"

const drawerWidth = 240
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth
    },
    drawerContainer: {
      overflow: "auto"
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3)
    },
    active: {
      background: theme.palette.grey[300],
      "&:hover": {
        background: theme.palette.grey[400]
      }
    },
    titleLink: {
      "&:hover": {
        textDecoration: 'none'
      }
    }
  })
)

export const App = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Router>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6">
              <Link component={RouterLink} to="/" color={"inherit"} className={classes.titleLink}>
                Discrete Calculator
              </Link>
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <Toolbar />
          <div className={classes.drawerContainer}>
            <List>
              <ListItemNavLink to="/truthtable" primary="Truth Tables" activeClassName={classes.active} />
              {/* <ListItemNavLink to="/setprops" primary="Set Properties" activeClassName={classes.active} /> */}
              {/* <ListItemNavLink to="/relations" primary="Relations" activeClassName={classes.active} /> */}
            </List>
          </div>
        </Drawer>
        <main className={classes.content}>
          <Toolbar />
          <Switch>
            <Route path="/truthtable">
              <TruthTable />
            </Route>
          </Switch>
        </main>
      </Router>
    </div>
  )
}
