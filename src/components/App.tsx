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
  Box,
  Container
} from "@material-ui/core"
import { Link as RouterLink, Route, Routes } from "react-router-dom"
import { ListItemNavLink } from "./ListItemLink"
import { createTheme, ThemeProvider } from "@material-ui/core/styles"
import { useState } from "react"
import MenuIcon from "@material-ui/icons/Menu"
import Brightness7Icon from "@material-ui/icons/Brightness7"
import Brightness4Icon from "@material-ui/icons/Brightness4"
import { NotificationProvider } from "./NotificationProvider"

const Home = lazy(() => import("../pages/Home"))
const TruthTable = lazy(() => import("../pages/TruthTable"))
const Sets = lazy(() => import("../pages/Sets"))

const drawerWidth = 240
const useStyles = makeStyles((theme) =>
  createStyles({
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
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            className={classes.menuButton}
            onClick={toggleDrawer}
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
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <Box role="presentation" className={classes.drawerContainer}>
          <List onClick={toggleDrawer} onKeyDown={toggleDrawer}>
            <ListItemNavLink to="truthtable" primary="Truth Tables" />
            <ListItemNavLink to="sets" primary="Sets" />
          </List>
        </Box>
      </Drawer>
      <NotificationProvider>
        <Suspense
          fallback={
            <Container component="main">
              <Typography variant="h6">Loading...</Typography>
              <CircularProgress />
            </Container>
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
    </ThemeProvider>
  )
}
