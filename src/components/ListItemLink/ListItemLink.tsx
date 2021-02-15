/**
 * The contents of this file were derrived from: https://codesandbox.io/s/ku5mv?file=/demo.tsx:597-681
 */

import { ListItemText } from "@material-ui/core"
import { ListItem, ListItemIcon } from "@material-ui/core"
import clsx from "clsx"
import React, { forwardRef, useMemo } from "react"
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
  NavLink as RouterNavLink,
  NavLinkProps as RouterNavLinkProps
} from "react-router-dom"

interface ListItemLinkProps {
  icon?: React.ReactElement
  primary: string
  to: string
}

export const ListItemLink = (props: ListItemLinkProps) => {
  const { icon, primary, to } = props

  const renderLink = useMemo(
    () =>
      forwardRef<any, Omit<RouterLinkProps, "to">>((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
    [to]
  )

  return (
    <li>
      <ListItem button component={renderLink}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  )
}

interface ListItemNavLinkProps extends ListItemLinkProps {
  activeClassName?: string
}

export const ListItemNavLink = (props: ListItemNavLinkProps) => {
  const { icon, primary, to, activeClassName } = props

  const renderNavLink = useMemo(
    () =>
      forwardRef<any, Omit<RouterNavLinkProps, "to">>((itemProps, ref) => (
        <RouterNavLink to={to} ref={ref} activeClassName={clsx("Mui-selected", activeClassName)} {...itemProps} />
      )),
    [activeClassName, to]
  )

  return (
    <li>
      <ListItem button component={renderNavLink}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  )
}
