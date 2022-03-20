import { Snackbar } from "@material-ui/core"
import { Alert } from "@material-ui/lab"
import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react"
import { createSafeContext } from "../util"

type NotificationType = "success" | "info" | "warning" | "error"

type Notification = {
  message: string
  type: NotificationType
}

type NotificationContext = {
  triggerNotification: (message: string, type: NotificationType) => void
  clearNotification: () => void
}

const [useNotificationContext, Provider] = createSafeContext<NotificationContext>()

export { useNotificationContext }

export const NotificationProvider = ({ children }: PropsWithChildren<{}>) => {
  const [notification, setNotification] = useState<Notification | null>(null)
  const [open, setOpen] = useState(false)

  const triggerNotification = useCallback(
    (message: string, type: NotificationType) => setNotification({ message, type }),
    []
  )
  const clearNotification = useCallback(() => setOpen(false), [])

  const handleClose = useCallback(
    (event?: React.SyntheticEvent, reason?: string) => {
      if (reason === "clickaway") {
        return
      }

      clearNotification()
    },
    [clearNotification]
  )

  const contextValue = useMemo<NotificationContext>(() => {
    return {
      triggerNotification,
      clearNotification
    }
  }, [clearNotification, triggerNotification])

  useEffect(() => {
    setOpen(notification !== null)
  }, [notification])

  return (
    <Provider value={contextValue}>
      {children}
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert elevation={6} variant="filled" onClose={handleClose} severity={notification?.type}>
          {notification?.message}
        </Alert>
      </Snackbar>
    </Provider>
  )
}
