import { Snackbar } from "@material-ui/core"
import { Alert } from "@material-ui/lab"
import React from "react"

interface NotificationProps {
  message: string
  severity: "success" | "info" | "warning" | "error"
  open: boolean,
  onClose?: () => void
}

export const Notification = ({message, severity, open, onClose}: NotificationProps) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <Alert elevation={6} variant="filled" onClose={onClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  )
}
