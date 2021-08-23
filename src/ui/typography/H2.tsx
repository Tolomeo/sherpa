import React from 'react'
import styles from './Typography.module.scss'

const H2: React.FC = ({ children }) => {
  return <h2 className={styles.h2}>{children}</h2>
}

export default H2
