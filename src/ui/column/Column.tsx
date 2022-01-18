import React from 'react'
import styles from './Column.module.scss'

type Props = {
  after?: React.ReactNode
}

const Column: React.FC<Props> = ({ children, after }) => {
  return (
    <div className={styles.column}>
      <div className={styles.column__main}>{children}</div>
      {after && <div className={styles.column__after}>{after}</div>}
    </div>
  )
}

export default Column
