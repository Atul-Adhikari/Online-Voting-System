import React from 'react'
import styles from "../Styles/LogoutMessage.module.css"

const LogoutMessage = () => {
  return (
    <div className={styles.logoutMessage}>
      <img src="/Loading_icon.gif" alt="" srcset="" />
      <p>Please wait while logging out.....</p>
    </div>
  )
}

export default LogoutMessage
