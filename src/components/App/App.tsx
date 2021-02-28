import React, { lazy, Suspense, useCallback, useMemo } from "react"
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
  IconButton,
  CircularProgress
} from "@material-ui/core"
import { BrowserRouter as Router, Link as RouterLink, Route, Switch } from "react-router-dom"
import { ListItemNavLink } from "../ListItemLink"
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles"
import { useState } from "react"
import Brightness7Icon from "@material-ui/icons/Brightness7"
import Brightness4Icon from "@material-ui/icons/Brightness4"
import Home from "../../pages/Home"
import { NotificationProvider } from "../NotificationProvider"

const TruthTable = lazy(() => import("../../pages/TruthTable"))
const Sets = lazy(() => import("../../pages/Sets"))

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
    },
    loading: {
      justifyContent: "center",
      textAlign: "center"
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
  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: darkMode ? "dark" : "light"
        }
      }),
    [darkMode]
  )

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
                <ListItemNavLink to="/sets" primary="Sets" />
                {/* <ListItemNavLink to="/relations" primary="Relations" /> */}
              </List>
            </div>
          </Drawer>
          <main className={classes.content}>
            <Toolbar />
            <NotificationProvider>
              <Suspense
                fallback={
                  <div className={classes.loading}>
                    <Typography variant="caption">Loading...</Typography>
                    <CircularProgress />
                  </div>
                }
              >
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/truthtable/:initialValue?" component={TruthTable} />
                  <Route path="/sets/:initialValue?" component={Sets} />
                </Switch>
              </Suspense>
            </NotificationProvider>
          </main>
        </Router>
      </div>
    </ThemeProvider>
  )
}
