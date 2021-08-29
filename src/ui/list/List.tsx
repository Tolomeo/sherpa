import React from 'react'
import styles from './List.module.scss'

const List: React.FC = ({ children }) => {
  return (
    <ul className={styles.list}>
      {React.Children.map(
        children,
        (child) => child && <li className={styles.list__item}>{child}</li>,
      )}
    </ul>
  )
}

export default List
