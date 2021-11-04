import { lazy, Suspense, useCallback, useMemo } from "react"
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
  CircularProgress,
  Grid
} from "@material-ui/core"
import { BrowserRouter as Router, Link as RouterLink, Route, Routes } from "react-router-dom"
import { ListItemNavLink } from "../ListItemLink"
import { createTheme, ThemeProvider } from "@material-ui/core/styles"
import { useState } from "react"
import MenuIcon from "@material-ui/icons/Menu"
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
    menuButton: {
      marginRight: theme.spacing(2)
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
  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggleDarkMode = useCallback(() => {
    localStorage.setItem("darkMode", `${!darkMode}`)
    setDarkMode(!darkMode)
  }, [darkMode])
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          type: darkMode ? "dark" : "light"
        }
      }),
    [darkMode]
  )

  const toggleDrawer = useCallback(() => setDrawerOpen(!drawerOpen), [drawerOpen])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={classes.root}>
        <Router>
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                onClick={toggleDrawer}
                className={classes.menuButton}
                color="inherit"
                aria-label="open drawer"
              >
                <MenuIcon />
              </IconButton>
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
            open={drawerOpen}
            onClose={toggleDrawer}
            className={classes.drawer}
            classes={{
              paper: classes.drawerPaper
            }}
          >
            <div className={classes.drawerContainer}>
              <List onClick={toggleDrawer} onKeyDown={toggleDrawer}>
                <ListItemNavLink to="truthtable" primary="Truth Tables" />
                <ListItemNavLink to="sets" primary="Sets" />
                {/* <ListItemNavLink to="/relations" primary="Relations" /> */}
              </List>
            </div>
          </Drawer>
          <main className={classes.content}>
            <Toolbar />
            <NotificationProvider>
              <Suspense
                fallback={
                  <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignContent="center"
                    alignItems="center"
                    className={classes.loading}
                  >
                    <Typography variant="h6">Loading...</Typography>
                    <CircularProgress />
                  </Grid>
                }
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="truthtable" element={<TruthTable />}>
                    <Route path=":initialValue" />
                  </Route>
                  <Route path="sets" element={<Sets />}>
                    <Route path=":initialValue" />
                  </Route>
                </Routes>
              </Suspense>
            </NotificationProvider>
          </main>
        </Router>
      </div>
    </ThemeProvider>
  )
}
