import React from 'react'
import styles from './Column.module.scss'

const Column: React.FC = ({ children }) => {
    return (
        <div className={styles.column}>
            {children}
        </div>
    )
}

export default Column