import { Snackbar } from "@material-ui/core"
import { Alert } from "@material-ui/lab"
import React from "react"

interface NotificationProps {
  message: string
  severity: "success" | "info" | "warning" | "error"
  open: boolean
  onClose?: () => void
}

export const Notification = ({ message, severity, open, onClose }: NotificationProps) => {
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return
    }

    if (onClose) {
      onClose()
    }
  }
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
      <Alert elevation={6} variant="filled" onClose={handleClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  )
}
