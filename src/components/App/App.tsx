import React, { useCallback } from "react"
import {
  AppBar,
  createStyles,
  CssBaseline,
  Drawer,
  Link,
  List,
  makeStyles,
  Toolbar,
  Typography,
  IconButton
} from "@material-ui/core"
import { BrowserRouter as Router, Link as RouterLink, Route, Switch } from "react-router-dom"
import { ListItemNavLink } from "../ListItemLink"
import { TruthTable } from "../../pages/TruthTable"
import { Home } from "../../pages/Home"
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles"
import { useState } from "react"
import Brightness7Icon from "@material-ui/icons/Brightness7"
import Brightness4Icon from "@material-ui/icons/Brightness4"

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
    title: {
      flexGrow: 1
    },
    titleLink: {
      "&:hover": {
        textDecoration: "none"
      }
    }
  })
)

export const App = () => {
  const classes = useStyles()

  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true")
  const toggleDarkMode = useCallback(() => {
    localStorage.setItem("darkMode", `${!darkMode}`)
    setDarkMode(!darkMode)
  }, [darkMode])
  const theme = createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light"
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <Router>
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                <Link component={RouterLink} to="/" color={"inherit"} className={classes.titleLink}>
                  Discrete Calculator
                </Link>
              </Typography>
              <IconButton color="inherit" onClick={toggleDarkMode}>
                {darkMode ? <Brightness4Icon /> : <Brightness7Icon />}
              </IconButton>
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
                <ListItemNavLink to="/truthtable" primary="Truth Tables" />
                {/* <ListItemNavLink to="/setprops" primary="Set Properties" /> */}
                {/* <ListItemNavLink to="/relations" primary="Relations" /> */}
              </List>
            </div>
          </Drawer>
          <main className={classes.content}>
            <Toolbar />
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/truthtable/:initialValue?" component={TruthTable} />
            </Switch>
          </main>
        </Router>
      </div>
    </ThemeProvider>
  )
}
